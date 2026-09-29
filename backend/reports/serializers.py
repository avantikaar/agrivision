from rest_framework import serializers
from .models import CropReport


class CropReportSerializer(serializers.ModelSerializer):
    farmer_username = serializers.CharField(source='farmer.username', read_only=True)

    class Meta:
        model = CropReport
        fields = [
            'id', 'farmer', 'farmer_username', 'image', 'crop_name',
            'latitude', 'longitude', 'status', 'detected_disease',
            'confidence', 'treatment_plan', 'created_at', 'processed_at',
        ]
        read_only_fields = [
            'farmer', 'status', 'detected_disease',
            'confidence', 'treatment_plan', 'processed_at',
        ]