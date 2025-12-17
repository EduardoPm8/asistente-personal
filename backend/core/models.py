from django.db import models

class Entry(models.Model):
    ENTRY_TYPES = (
        ('NOTE', 'Nota'),
        ('TASK', 'Tarea'),
        ('EXPENSE', 'Gasto'),
    )

    text = models.TextField(blank=True, null=True) # Text might be optional for a simple expense
    title = models.CharField(max_length=200, blank=True, null=True)
    type = models.CharField(max_length=10, choices=ENTRY_TYPES, default='NOTE')
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    due_date = models.DateTimeField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.created_at}"
