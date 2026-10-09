from django.contrib import admin
from .models import Experience


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = (
        "job_title",
        "company_name",
        "employment_type",
        "location",
        "start_date",
        "end_date",
        "is_current",
    )

    list_filter = (
        "is_current",
        "employment_type",
        "start_date",
    )

    search_fields = (
        "job_title",
        "company_name",
        "location",
        "description",
        "skills_used",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Job Information",
            {
                "fields": (
                    "job_title",
                    "company_name",
                    "employment_type",
                    "location",
                    "company_logo",
                    "company_website",
                )
            },
        ),
        (
            "Experience Details",
            {
                "fields": (
                    "description",
                    "responsibilities",
                    "skills_used",
                )
            },
        ),
        (
            "Employment Duration",
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
