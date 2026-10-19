from rest_framework import serializers
from .models import SkillCategory, Skill


class SkillCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = SkillCategory
        fields = [
            "id",
            "name",
            "description",
            "display_order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class SkillSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    class Meta:
        model = Skill
        fields = [
            "id",
            "name",
            "category",
            "category_name",
            "proficiency",
            "proficiency_percentage",
            "icon",
            "years_of_experience",
            "is_featured",
            "is_active",
            "display_order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_proficiency_percentage(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Proficiency percentage must be between 0 and 100."
            )
        return value