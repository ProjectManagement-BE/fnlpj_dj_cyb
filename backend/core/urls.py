from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),

    # App routes
    path("api/detect/", include("detection.urls")),
    path("api/monitor/", include("monitoring.urls")),
    path("api/darkweb/", include("darkweb.urls")),
    path("api/chatbot/", include("chatbot.urls")),
    path("api/users/", include("users.urls")),

    # JWT Authentication
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
