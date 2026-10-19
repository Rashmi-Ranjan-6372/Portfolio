from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import SkillCategory, Skill
from .serializers import SkillCategorySerializer, SkillSerializer


class SkillCategoryListCreateAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request):
        categories = SkillCategory.objects.all()
        serializer = SkillCategorySerializer(categories, many=True)

        return Response({
            "success": True,
            "message": "Skill categories retrieved successfully",
            "data": serializer.data,
        })

    def post(self, request):
        serializer = SkillCategorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Skill category created successfully",
                "data": serializer.data,
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)


class SkillCategoryDetailAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request, pk):
        category = get_object_or_404(SkillCategory, pk=pk)
        serializer = SkillCategorySerializer(category)

        return Response({
            "success": True,
            "message": "Skill category retrieved successfully",
            "data": serializer.data,
        })

    def put(self, request, pk):
        category = get_object_or_404(SkillCategory, pk=pk)
        serializer = SkillCategorySerializer(category, data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Skill category updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        category = get_object_or_404(SkillCategory, pk=pk)
        serializer = SkillCategorySerializer(
            category,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Skill category updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = get_object_or_404(SkillCategory, pk=pk)
        category.delete()

        return Response({
            "success": True,
            "message": "Skill category deleted successfully",
        }, status=status.HTTP_200_OK)


class SkillListCreateAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request):
        skills = Skill.objects.filter(is_active=True).select_related("category")

        category_id = request.query_params.get("category")
        featured = request.query_params.get("featured")

        if category_id:
            skills = skills.filter(category_id=category_id)

        if featured is not None:
            if featured.lower() in ["true", "1"]:
                skills = skills.filter(is_featured=True)
            elif featured.lower() in ["false", "0"]:
                skills = skills.filter(is_featured=False)
            else:
                return Response({
                    "success": False,
                    "message": "featured must be true or false",
                }, status=status.HTTP_400_BAD_REQUEST)

        serializer = SkillSerializer(skills, many=True)

        return Response({
            "success": True,
            "message": "Skills retrieved successfully",
            "data": serializer.data,
        })

    def post(self, request):
        serializer = SkillSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Skill created successfully",
                "data": serializer.data,
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)


class SkillDetailAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request, pk):
        skill = get_object_or_404(Skill, pk=pk, is_active=True)
        serializer = SkillSerializer(skill)

        return Response({
            "success": True,
            "message": "Skill retrieved successfully",
            "data": serializer.data,
        })

    def put(self, request, pk):
        skill = get_object_or_404(Skill, pk=pk)
        serializer = SkillSerializer(skill, data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Skill updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        skill = get_object_or_404(Skill, pk=pk)
        serializer = SkillSerializer(
            skill,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Skill updated successfully",
                "data": serializer.data,
            })

        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        skill = get_object_or_404(Skill, pk=pk)
        skill.is_active = False
        skill.save(update_fields=["is_active", "updated_at"])

        return Response({
            "success": True,
            "message": "Skill deactivated successfully",
        }, status=status.HTTP_200_OK)