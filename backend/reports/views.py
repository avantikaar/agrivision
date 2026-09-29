from rest_framework import generics, permissions
from .models import CropReport
from .serializers import CropReportSerializer
from .tasks import process_report


class ReportListCreateView(generics.ListCreateAPIView):
    serializer_class = CropReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CropReport.objects.filter(farmer=self.request.user)

    def perform_create(self, serializer):
        report = serializer.save(farmer=self.request.user)
        # Fire off the AI pipeline asynchronously
        process_report.delay(report.id)


class ReportDetailView(generics.RetrieveAPIView):
    serializer_class = CropReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CropReport.objects.filter(farmer=self.request.user)