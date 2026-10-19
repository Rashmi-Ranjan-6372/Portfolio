from rest_framework import serializers
from .models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):

    class Meta:
        model = Testimonial
        fields = [
            "id",
            "name",
            "designation",
            "company_name",
            "message",
            "profile_image",
            "company_website",
            "rating",
            "is_featured",
            "is_active",
            "display_order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Rating must be between 1 and 5."
            )
        return value