from rest_framework import generics, permissions
from .models import OutbreakAlert
from .serializers import OutbreakAlertSerializer


class OutbreakAlertListView(generics.ListAPIView):
    serializer_class = OutbreakAlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = OutbreakAlert.objects.filter(is_active=True)