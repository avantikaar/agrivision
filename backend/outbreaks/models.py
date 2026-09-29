from django.db import models


class OutbreakAlert(models.Model):
    disease = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    report_count = models.IntegerField()
    message = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.disease} in {self.district} ({self.report_count} reports)"