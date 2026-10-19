from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import Education
from .serializers import EducationSerializer


class EducationListCreateAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request):
        education = Education.objects.all().order_by("-start_date")
        serializer = EducationSerializer(education, many=True)

        return Response({
            "success": True,
            "message": "Education records retrieved successfully",
            "data": serializer.data,
        })

    def post(self, request):
        serializer = EducationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Education record created successfully",
                "data": serializer.data,
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)


class EducationDetailAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request, pk):
        education = get_object_or_404(Education, pk=pk)
        serializer = EducationSerializer(education)

        return Response({
            "success": True,
            "message": "Education record retrieved successfully",
            "data": serializer.data,
        })

    def put(self, request, pk):
        education = get_object_or_404(Education, pk=pk)
        serializer = EducationSerializer(
            education,
            data=request.data,
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Education record updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)