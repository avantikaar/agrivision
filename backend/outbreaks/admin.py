from django.contrib import admin
from .models import OutbreakAlert


@admin.register(OutbreakAlert)
class OutbreakAlertAdmin(admin.ModelAdmin):
    list_display = ['disease', 'district', 'report_count', 'is_active', 'created_at']
    list_filter = ['disease', 'district', 'is_active']