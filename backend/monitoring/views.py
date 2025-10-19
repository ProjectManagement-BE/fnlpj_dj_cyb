from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import MonitoringRequestSerializer
from .utils import capture_packets, analyze_ip_address
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone
from datetime import timedelta
from .models import PacketEvent


class MonitorPackets(APIView):   # 👈 Class name changed to follow Django/Python conventions
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            count = int(request.query_params.get("count", 5))
        except Exception:
            count = 5
        data = capture_packets(count=count)
        if isinstance(data, dict) and "error" in data:
            return Response({"captured_packets": [], "error": data["error"]}, status=status.HTTP_200_OK)
        captured = data.get("captured", [])

        # persist events
        def is_private(ip: str):
            if not ip:
                return True
            try:
                parts = [int(x) for x in ip.split(".")]
                if len(parts) != 4:
                    return True
                a, b = parts[0], parts[1]
                return (
                    a == 10 or
                    (a == 172 and 16 <= b <= 31) or
                    (a == 192 and b == 168) or
                    a == 127 or
                    a == 169
                )
            except Exception:
                return True

        for p in captured:
            proto = str(p.get("protocol", ""))
            src_priv = is_private(p.get("src"))
            dst_priv = is_private(p.get("dst"))
            severity = "low"
            if not src_priv and not dst_priv:
                severity = "high"
            elif (not src_priv) or (not dst_priv):
                severity = "medium"
            PacketEvent.objects.create(
                src_ip=p.get("src") or "",
                dst_ip=p.get("dst") or "",
                protocol=proto,
                severity=severity,
            )

        return Response({"captured_packets": captured}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = MonitoringRequestSerializer(data=request.data)
        if serializer.is_valid():
            target = serializer.validated_data["target"]
            packets = capture_packets(count=5)
            result = {
                "target": target,
                "captured_packets": packets,
                "status": "Monitoring Complete",
            }
            return Response(result, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def system_health(request):
    data = {
        "cpu": "23%",
        "memory": "45%",
        "disk": "67%",
        "status": "Healthy"
    }
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def analyze_ip(request):
    ip = request.GET.get("ip")
    if not ip:
        return Response({"error": "ip is required"}, status=status.HTTP_400_BAD_REQUEST)
    data = analyze_ip_address(ip)
    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def stats(request):
    now = timezone.now()
    since_24h = now - timedelta(hours=24)
    since_5m = now - timedelta(minutes=5)

    qs_24h = PacketEvent.objects.filter(created_at__gte=since_24h)
    total = qs_24h.count()
    categories = qs_24h.values_list("protocol", flat=True).distinct().count()
    active = PacketEvent.objects.filter(created_at__gte=since_5m, severity="high").count()

    return Response({
        "total_24h": total,
        "active_alerts": active,
        "categories": categories,
    }, status=status.HTTP_200_OK)
