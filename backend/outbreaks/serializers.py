from rest_framework import serializers
from .models import OutbreakAlert


class OutbreakAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutbreakAlert
        fields = ['id', 'disease', 'district', 'report_count',
                  'message', 'is_active', 'created_at']