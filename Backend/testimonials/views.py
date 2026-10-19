from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import Testimonial
from .serializers import TestimonialSerializer


class TestimonialListCreateAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request):
        testimonials = Testimonial.objects.filter(
            is_active=True
        )

        featured = request.query_params.get("featured")

        if featured is not None:
            if featured.lower() in ["true", "1"]:
                testimonials = testimonials.filter(is_featured=True)
            elif featured.lower() in ["false", "0"]:
                testimonials = testimonials.filter(is_featured=False)
            else:
                return Response({
                    "success": False,
                    "message": "featured must be true or false",
                }, status=status.HTTP_400_BAD_REQUEST)

        serializer = TestimonialSerializer(testimonials, many=True)

        return Response({
            "success": True,
            "message": "Testimonials retrieved successfully",
            "data": serializer.data,
        })

    def post(self, request):
        serializer = TestimonialSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Testimonial created successfully",
                "data": serializer.data,
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)


class TestimonialDetailAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request, pk):
        testimonial = get_object_or_404(
            Testimonial,
            pk=pk,
            is_active=True,
        )
        serializer = TestimonialSerializer(testimonial)

        return Response({
            "success": True,
            "message": "Testimonial retrieved successfully",
            "data": serializer.data,
        })

    def put(self, request, pk):
        testimonial = get_object_or_404(Testimonial, pk=pk)

        serializer = TestimonialSerializer(
            testimonial,
            data=request.data,
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Testimonial updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        testimonial = get_object_or_404(Testimonial, pk=pk)

        serializer = TestimonialSerializer(
            testimonial,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Testimonial updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        testimonial = get_object_or_404(Testimonial, pk=pk)
        testimonial.is_active = False
        testimonial.save(update_fields=["is_active", "updated_at"])

        return Response({
            "success": True,
            "message": "Testimonial deactivated successfully",
        }, status=status.HTTP_200_OK)