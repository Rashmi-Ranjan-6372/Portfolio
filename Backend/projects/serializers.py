from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "description",
            "technologies",
            "category",
            "thumbnail",
            "github_url",
            "live_demo_url",
            "status",
            "is_featured",
            "display_order",
            "start_date",
            "end_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "created_at",
            "updated_at",
        ]