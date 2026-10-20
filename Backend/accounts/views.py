from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from .serializers import UserProfileSerializer

User = get_user_model()

class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.is_staff:
            raise AuthenticationFailed("Admin access only.")

        return data


class AdminLoginAPIView(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer


class AdminLogoutAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {
                    "success": False,
                    "message": "Refresh token is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {
                    "success": True,
                    "message": "Logout successful.",
                },
                status=status.HTTP_200_OK,
            )

        except (TokenError, InvalidToken):
            return Response(
                {
                    "success": False,
                    "message": "Invalid or expired refresh token.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

class PublicProfileAPIView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):
        user = User.objects.filter(is_superuser=True).first()

        if not user:
            return Response(
                {
                    "success": False,
                    "message": "Profile not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = UserProfileSerializer(user)

        return Response({
            "success": True,
            "message": "Profile retrieved successfully",
            "data": serializer.data,
        })


class ProfileUpdateAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, request):
        return request.user

    def patch(self, request):
        serializer = UserProfileSerializer(
            self.get_object(request),
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Profile updated successfully",
                "data": serializer.data,
            })

        return Response(
            {
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )