
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import Project
from .serializers import ProjectSerializer


class ProjectListCreateAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request):
        projects = Project.objects.all()

        category = request.query_params.get("category")
        project_status = request.query_params.get("status")
        featured = request.query_params.get("featured")

        if category:
            projects = projects.filter(category__iexact=category)

        if project_status:
            projects = projects.filter(status=project_status.upper())

        if featured is not None:
            if featured.lower() in ["true", "1"]:
                projects = projects.filter(is_featured=True)
            elif featured.lower() in ["false", "0"]:
                projects = projects.filter(is_featured=False)
            else:
                return Response({
                    "success": False,
                    "message": "featured must be true or false",
                }, status=status.HTTP_400_BAD_REQUEST)

        serializer = ProjectSerializer(projects, many=True)

        return Response({
            "success": True,
            "message": "Projects retrieved successfully",
            "data": serializer.data,
        })

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Project created successfully",
                "data": serializer.data,
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)


class ProjectDetailAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request, slug):
        project = get_object_or_404(Project, slug=slug)
        serializer = ProjectSerializer(project)

        return Response({
            "success": True,
            "message": "Project retrieved successfully",
            "data": serializer.data,
        })

    def put(self, request, slug):
        project = get_object_or_404(Project, slug=slug)

        serializer = ProjectSerializer(
            project,
            data=request.data,
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Project updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, slug):
        project = get_object_or_404(Project, slug=slug)

        serializer = ProjectSerializer(
            project,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Project updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, slug):
        project = get_object_or_404(Project, slug=slug)
        project.delete()

        return Response({
            "success": True,
            "message": "Project deleted successfully",
        }, status=status.HTTP_200_OK)
