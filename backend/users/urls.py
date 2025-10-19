from django.urls import path
from .views import signup, signin   # ✅ import only what exists

urlpatterns = [
    path("signup/", signup, name="signup"),
    path("signin/", signin, name="signin"),
]
