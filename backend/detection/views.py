from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import DetectionRequestSerializer
from .ml_model import predict_url
from .utils import check_url_with_virustotal
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated



class ThreatDetectionView(APIView):
    def post(self, request):
        serializer = DetectionRequestSerializer(data=request.data)
        if serializer.is_valid():
            url = serializer.validated_data['url']
            
            # 🔹 ML model prediction
            ml_result = predict_url(url)
            
            # 🔹 VirusTotal lookup
            vt_result = check_url_with_virustotal(url)

            return Response(
                {
                    "url": url,
                    "ml_prediction": ml_result,
                    "threat": (ml_result == "Phishing"),
                    "virustotal": vt_result,
                },
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .utils import analyze_url

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def detect_url(request):
    data = request.data
    url = data.get("url")
    result = analyze_url(url)
    return Response(result)
def detect_threat(request):
    url = request.data.get("url")
    return Response({
        "url": url,
        "ml_prediction": "Safe",
        "threat": False,
        "virustotal": {"harmless": 0, "malicious": 0, "suspicious": 0, "undetected": 0}
    })