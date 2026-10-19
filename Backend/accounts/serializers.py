from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "profile_image",
            "bio",
            "phone",
            "location",
            "github_url",
            "linkedin_url",
            "resume",
        ]
        read_only_fields = ["id", "username"]