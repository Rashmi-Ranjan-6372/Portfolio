from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import Certification
from .serializers import CertificationSerializer


class CertificationListCreateAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request):
        certifications = Certification.objects.all().order_by("-issue_date")
        serializer = CertificationSerializer(certifications, many=True)

        return Response({
            "success": True,
            "message": "Certifications retrieved successfully",
            "data": serializer.data,
        })

    def post(self, request):
        serializer = CertificationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Certification created successfully",
                "data": serializer.data,
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)


class CertificationDetailAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request, pk):
        certification = get_object_or_404(Certification, pk=pk)
        serializer = CertificationSerializer(certification)

        return Response({
            "success": True,
            "message": "Certification retrieved successfully",
            "data": serializer.data,
        })

    def put(self, request, pk):
        certification = get_object_or_404(Certification, pk=pk)
        serializer = CertificationSerializer(
            certification,
            data=request.data,
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Certification updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        certification = get_object_or_404(Certification, pk=pk)
        serializer = CertificationSerializer(
            certification,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Certification updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        certification = get_object_or_404(Certification, pk=pk)
        certification.delete()

        return Response({
            "success": True,
            "message": "Certification deleted successfully",
        }, status=status.HTTP_200_OK)