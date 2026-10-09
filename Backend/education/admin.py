from django.contrib import admin
from .models import Education


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = (
        "degree",
        "institution",
        "field_of_study",
        "start_date",
        "end_date",
        "is_current",
        "grade",
    )

    list_filter = (
        "is_current",
        "institution",
        "start_date",
    )

    search_fields = (
        "degree",
        "institution",
        "field_of_study",
        "institution_location",
        "grade",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Education Information",
            {
                "fields": (
                    "degree",
                    "institution",
                    "field_of_study",
                    "description",
                )
            },
        ),
        (
            "Academic Details",
            {
                "fields": (
                    "grade",
                    "institution_location",
                    "certificate_image",
                )
            },
        ),
        (
            "Duration",
            {
                "fields": (
                    "start_date",
                    "end_date",
                    "is_current",
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

    ordering = ("-start_date",)
