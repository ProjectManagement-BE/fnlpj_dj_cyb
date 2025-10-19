from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import search_darkweb   # ✅ only import darkweb-related utils
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# Function-based view (for simple JSON lookup)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def darkweb_lookup(request):
    query = request.GET.get("q", "threat")
    results = search_darkweb(query)
    return JsonResponse({"query": query, "results": results})


# Class-based APIView (for structured API response)
class DarkWebView(APIView):
    def get(self, request):
        query = request.GET.get("q", "threat")
        results = search_darkweb(query)
        data = {
            "status": "completed",
            "query": query,
            "results": results
        }
        return Response(data, status=status.HTTP_200_OK)
