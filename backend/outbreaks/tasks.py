from datetime import timedelta
from celery import shared_task
from django.utils import timezone

from reports.models import CropReport
from .models import OutbreakAlert


@shared_task
def check_outbreak(district: str, disease: str):
    """
    Look at reports from the last 7 days in a district.
    If 3+ reports of the same disease, create an outbreak alert.
    """
    if not district or disease in ('Unknown', 'Healthy', ''):
        return None

    cutoff = timezone.now() - timedelta(days=7)

    count = CropReport.objects.filter(
        farmer__district=district,
        detected_disease=disease,
        status='completed',
        created_at__gte=cutoff,
    ).count()

    if count < 3:
        return None

    # Skip if we already have an active alert for this pair
    existing = OutbreakAlert.objects.filter(
        district=district,
        disease=disease,
        is_active=True,
        created_at__gte=cutoff,
    ).exists()

    if existing:
        return None

    alert = OutbreakAlert.objects.create(
        disease=disease,
        district=district,
        report_count=count,
        message=(
            f"⚠️ Outbreak alert: {count} reports of {disease} "
            f"in {district} in the last 7 days. "
            f"Farmers in this area should check their crops and take preventive action."
        ),
    )
    return alert.id