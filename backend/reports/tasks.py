from celery import shared_task, chain
from django.utils import timezone

from .models import CropReport
from .genai import detect_disease, generate_treatment


@shared_task
def process_report(report_id: int):
    """Entry point — runs the full 3-task chain."""
    pipeline = chain(
        classify_disease.s(report_id),
        build_treatment.s(),
        save_results.s(),
    )
    return pipeline.apply_async()


@shared_task(bind=True, max_retries=2, default_retry_delay=30)
def classify_disease(self, report_id: int):
    report = CropReport.objects.get(id=report_id)
    report.status = 'processing'
    report.save(update_fields=['status'])

    try:
        result = detect_disease(report.image.path)
    except Exception as exc:
        report.status = 'failed'
        report.save(update_fields=['status'])
        raise self.retry(exc=exc)

    return {
        'report_id': report_id,
        'disease': result['disease'],
        'confidence': result['confidence'],
        'crop': result.get('crop', report.crop_name),
    }


@shared_task
def build_treatment(data: dict):
    report = CropReport.objects.get(id=data['report_id'])
    try:
        treatment = generate_treatment(
            disease=data['disease'],
            crop=data['crop'],
            language=report.farmer.preferred_language,
        )
    except Exception:
        treatment = "Treatment plan unavailable. Please consult your local agriculture officer."
    return {**data, 'treatment': treatment}


@shared_task
def save_results(data: dict):
    report = CropReport.objects.get(id=data['report_id'])
    report.detected_disease = data['disease']
    report.confidence = data['confidence']
    report.treatment_plan = data['treatment']
    report.status = 'completed'
    report.processed_at = timezone.now()
    report.save()
    return report.id