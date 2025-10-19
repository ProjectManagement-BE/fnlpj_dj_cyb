from django.urls import path
from .views import DarkWebView, darkweb_lookup

urlpatterns = [
    path("", DarkWebView.as_view(), name="darkweb"),
    path("lookup/", darkweb_lookup, name="darkweb-lookup"),
]
