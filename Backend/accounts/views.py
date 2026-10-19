from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser

from .serializers import UserProfileSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class PublicProfileAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = User.objects.filter(is_superuser=True).first()

        if not user:
            return Response(
                {
                    "success": False,
                    "message": "Portfolio profile not found",
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