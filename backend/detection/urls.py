from django.urls import path
from .views import ThreatDetectionView

urlpatterns = [
    path("", ThreatDetectionView.as_view(), name="threat-detect"),
]
