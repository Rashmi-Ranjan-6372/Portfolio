from django.utils import timezone
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import Blog
from .serializers import BlogSerializer


class BlogListCreateAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request):
        blogs = Blog.objects.filter(
            is_published=True
        ).order_by("-published_at", "-created_at")

        category = request.query_params.get("category")

        if category:
            blogs = blogs.filter(category__iexact=category)

        serializer = BlogSerializer(blogs, many=True)

        return Response({
            "success": True,
            "message": "Blog list retrieved successfully",
            "data": serializer.data,
        })

    def post(self, request):
        serializer = BlogSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Blog created successfully",
                "data": serializer.data,
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)


class BlogDetailAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request, slug):
        blog = get_object_or_404(
            Blog,
            slug=slug,
            is_published=True,
        )

        serializer = BlogSerializer(blog)

        return Response({
            "success": True,
            "message": "Blog details retrieved successfully",
            "data": serializer.data,
        })

    def put(self, request, slug):
        blog = get_object_or_404(Blog, slug=slug)
        serializer = BlogSerializer(
            blog,
            data=request.data,
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Blog updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, slug):
        blog = get_object_or_404(Blog, slug=slug)
        serializer = BlogSerializer(
            blog,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Blog updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, slug):
        blog = get_object_or_404(Blog, slug=slug)
        blog.delete()

        return Response({
            "success": True,
            "message": "Blog deleted successfully",
        }, status=status.HTTP_200_OK)


class BlogPublishAPIView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, slug):
        blog = get_object_or_404(Blog, slug=slug)

        blog.is_published = True

        if not blog.published_at:
            blog.published_at = timezone.now()

        blog.save(update_fields=[
            "is_published",
            "published_at",
            "updated_at",
        ])

        serializer = BlogSerializer(blog)

        return Response({
            "success": True,
            "message": "Blog published successfully",
            "data": serializer.data,
        })