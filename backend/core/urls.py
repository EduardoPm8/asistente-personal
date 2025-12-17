from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EntryViewSet, StatsView

router = DefaultRouter()
router.register(r'entries', EntryViewSet, basename='entry')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/summary/', StatsView.as_view(), name='stats-summary'),
]
