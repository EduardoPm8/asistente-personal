from rest_framework import viewsets, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from django.utils import timezone
from .models import Entry
from .serializers import EntrySerializer
import requests
import logging

logger = logging.getLogger(__name__)

from django.conf import settings

class EntryViewSet(viewsets.ModelViewSet):
    queryset = Entry.objects.all().order_by('-created_at')
    serializer_class = EntrySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        instance = serializer.save()
        self.send_to_webhook(instance)

    def send_to_webhook(self, entry):
        webhook_url = getattr(settings, 'N8N_WEBHOOK_URL', '')
        if not webhook_url:
            return

        data = EntrySerializer(entry).data
        # Add basic metadata useful for N8N
        data['webhook_type'] = 'entry_created'
        
        import json
        import urllib.request
        
        try:
            req = urllib.request.Request(
                webhook_url, 
                data=json.dumps(data).encode('utf-8'),
                headers={'Content-Type': 'application/json', 'User-Agent': 'MiVidaAutomatica/1.0'},
                method='POST'
            )
            # Set a short timeout (e.g., 2 seconds) so it doesn't slow down the app
            with urllib.request.urlopen(req, timeout=2) as response:
                pass 
        except Exception as e:
            # Silently fail or log ensuring we don't break the user's save flow
            logger.error(f"N8N Webhook failed: {e}") 

class StatsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        current_month = now.month
        current_year = now.year

        # Total Expenses this month
        total_expenses = Entry.objects.filter(
            type='EXPENSE', 
            created_at__month=current_month, 
            created_at__year=current_year
        ).aggregate(Sum('amount'))['amount__sum'] or 0

        # Pending Tasks
        pending_tasks = Entry.objects.filter(
            type='TASK', 
            is_completed=False
        ).count()

        # Total Notes
        total_notes = Entry.objects.filter(type='NOTE').count()
            
        return Response({
            "total_expenses_month": total_expenses,
            "pending_tasks": pending_tasks,
            "total_notes": total_notes
        })
