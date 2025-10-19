from rest_framework import serializers

class MonitoringRequestSerializer(serializers.Serializer):
    target = serializers.CharField()  # e.g., "192.168.1.1" or "http://example.com"
