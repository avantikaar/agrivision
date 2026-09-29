from django.urls import path
from .views import OutbreakAlertListView

urlpatterns = [
    path('', OutbreakAlertListView.as_view(), name='outbreak-list'),
]