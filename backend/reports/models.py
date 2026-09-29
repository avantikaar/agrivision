from django.db import models
from django.conf import settings


class CropReport(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    farmer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reports',
    )
    image = models.ImageField(upload_to='reports/%Y/%m/')
    crop_name = models.CharField(max_length=50, default='Unknown')
    latitude = models.FloatField()
    longitude = models.FloatField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    detected_disease = models.CharField(max_length=100, blank=True)
    confidence = models.FloatField(null=True, blank=True)
    treatment_plan = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Report #{self.id} - {self.farmer.username} - {self.status}"