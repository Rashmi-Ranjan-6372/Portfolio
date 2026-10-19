from django.shortcuts import render

# Create your views here.
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import Experience
from .serializers import ExperienceSerializer


class ExperienceListCreateAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request):
        experiences = Experience.objects.all().order_by("-start_date")
        serializer = ExperienceSerializer(experiences, many=True)

        return Response({
            "success": True,
            "message": "Experience records retrieved successfully",
            "data": serializer.data,
        })

    def post(self, request):
        serializer = ExperienceSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Experience created successfully",
                "data": serializer.data,
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)


class ExperienceDetailAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request, pk):
        experience = get_object_or_404(Experience, pk=pk)
        serializer = ExperienceSerializer(experience)

        return Response({
            "success": True,
            "message": "Experience retrieved successfully",
            "data": serializer.data,
        })

    def put(self, request, pk):
        experience = get_object_or_404(Experience, pk=pk)

        serializer = ExperienceSerializer(
            experience,
            data=request.data,
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Experience updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        experience = get_object_or_404(Experience, pk=pk)

        serializer = ExperienceSerializer(
            experience,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Experience updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        experience = get_object_or_404(Experience, pk=pk)
        experience.delete()

        return Response({
            "success": True,
            "message": "Experience deleted successfully",
        }, status=status.HTTP_200_OK)