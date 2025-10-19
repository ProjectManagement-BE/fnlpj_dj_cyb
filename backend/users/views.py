from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password

@api_view(['POST'])
def signup(request):
    username = request.data.get("username")
    password = request.data.get("password")
    role = request.data.get("role", "user")  # default = user
    UserModel = get_user_model()
    if UserModel.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)
    user = UserModel(username=username, password=make_password(password), role=role)
    user.save()
    return Response({"message": "User created successfully", "username": username, "role": role})

@api_view(['POST'])
def signin(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful",
            "username": username,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })
    else:
        return Response({"error": "Invalid credentials"}, status=400)
