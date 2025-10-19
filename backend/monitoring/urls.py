from django.urls import path
from .views import MonitorPackets, system_health, analyze_ip, stats

urlpatterns = [
    path("", MonitorPackets.as_view(), name="monitor"),  # existing
    path("system-health/", system_health, name="system-health"),
    path("capture/", MonitorPackets.as_view(), name="network-capture"),  # 👈 alias
    path("ip/", analyze_ip, name="analyze-ip"),
    path("stats/", stats, name="monitor-stats"),
]
