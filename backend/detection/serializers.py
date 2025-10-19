from rest_framework import serializers

class DetectionRequestSerializer(serializers.Serializer):
    url = serializers.URLField(required=True)   # input must be a URL
