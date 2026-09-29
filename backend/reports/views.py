import os
import logging
from rest_framework import generics, permissions

from .models import CropReport
from .serializers import CropReportSerializer

logger = logging.getLogger(__name__)
USE_CELERY = os.environ.get('USE_CELERY', 'false').lower() == 'true'


class ReportListCreateView(generics.ListCreateAPIView):
    serializer_class = CropReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CropReport.objects.filter(farmer=self.request.user)

    def perform_create(self, serializer):
        report = serializer.save(farmer=self.request.user)

        if USE_CELERY:
            from .tasks import process_report
            process_report.delay(report.id)
        else:
            from .tasks import classify_disease, build_treatment, save_results
            try:
                data = classify_disease.run(report.id)
                data = build_treatment.run(data)
                save_results.run(data)
            except Exception as e:
                logger.exception(f"Sync AI pipeline failed for report {report.id}: {e}")
                report.status = 'failed'
                report.save(update_fields=['status'])


class ReportDetailView(generics.RetrieveAPIView):
    serializer_class = CropReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CropReport.objects.filter(farmer=self.request.user)