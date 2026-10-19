from rest_framework import serializers
from .models import Education


class EducationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Education
        fields = [
            "id",
            "degree",
            "institution",
            "field_of_study",
            "description",
            "start_date",
            "end_date",
            "is_current",
            "grade",
            "institution_location",
            "certificate_image",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]