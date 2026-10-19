from rest_framework import serializers
from .models import Experience


class ExperienceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Experience
        fields = [
            "id",
            "job_title",
            "company_name",
            "employment_type",
            "location",
            "description",
            "responsibilities",
            "skills_used",
            "start_date",
            "end_date",
            "is_current",
            "company_logo",
            "company_website",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]