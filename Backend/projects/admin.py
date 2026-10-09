from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "status",
        "is_featured",
        "display_order",
        "start_date",
        "end_date",
        "created_at",
    )

    list_filter = (
        "status",
        "category",
        "is_featured",
        "created_at",
    )

    search_fields = (
        "title",
        "short_description",
        "description",
        "technologies",
        "category",
    )

    prepopulated_fields = {
        "slug": ("title",),
    }

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    list_editable = (
        "status",
        "is_featured",
        "display_order",
    )

    fieldsets = (
        (
            "Project Information",
            {
                "fields": (
                    "title",
                    "slug",
                    "short_description",
                    "description",
                    "category",
                    "technologies",
                )
            },
        ),
        (
            "Project Media and Links",
            {
                "fields": (
                    "thumbnail",
                    "github_url",
                    "live_demo_url",
                )
            },
        ),
        (
            "Project Status and Display",
            {
                "fields": (
                    "status",
                    "is_featured",
                    "display_order",
                )
            },
        ),
        (
            "Project Timeline",
            {
                "fields": (
                    "start_date",
                    "end_date",
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

    ordering = ("display_order", "-created_at")
