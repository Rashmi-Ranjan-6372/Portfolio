from django.contrib import admin
from .models import Certification


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "issuing_organization",
        "issue_date",
        "expiry_date",
        "date_not_expired",
        "created_at",
    )

    list_filter = (
        "issuing_organization",
        "date_not_expired",
        "issue_date",
    )

    search_fields = (
        "title",
        "issuing_organization",
        "credentials_id",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Certification Information",
            {
                "fields": (
                    "title",
                    "issuing_organization",
                    "description",
                )
            },
        ),
        (
            "Certificate Details",
            {
                "fields": (
                    "certificate_image",
                    "certificate_url",
                    "credentials_id",
                )
            },
        ),
        (
            "Validity Information",
            {
                "fields": (
                    "issue_date",
                    "expiry_date",
                    "date_not_expired",
                )
            },
        ),
        (
            "Timestamps",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    ordering = ("-issue_date",)
