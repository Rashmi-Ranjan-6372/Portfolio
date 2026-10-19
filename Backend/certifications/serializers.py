from rest_framework import serializers
from .models import Certification


class CertificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Certification
        fields = [
            "id",
            "title",
            "issuing_organization",
            "description",
            "certificate_image",
            "certificate_url",
            "credentials_id",
            "issue_date",
            "expiry_date",
            "date_not_expired",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]