from django.urls import path
from .views import ChatbotView, chatbot_query   # ✅ use only the views that exist

urlpatterns = [
    path("", ChatbotView.as_view(), name="chatbot-view"),
    path("query/", chatbot_query, name="chatbot-query"),
]
