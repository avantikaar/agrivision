from django.contrib import admin
from .models import CropReport


@admin.register(CropReport)
class CropReportAdmin(admin.ModelAdmin):
    list_display = ['id', 'farmer', 'crop_name', 'status', 'detected_disease', 'created_at']
    list_filter = ['status', 'crop_name']
    search_fields = ['farmer__username', 'detected_disease']