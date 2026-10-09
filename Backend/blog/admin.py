from django.contrib import admin
from .models import Blog


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "is_published",
        "published_at",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "is_published",
        "category",
        "created_at",
    )

    search_fields = (
        "title",
        "summary",
        "content",
        "category",
        "tags",
    )

    prepopulated_fields = {
        "slug": ("title",),
    }

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Blog Information",
            {
                "fields": (
                    "title",
                    "slug",
                    "thumbnail",
                    "summary",
                    "content",
                )
            },
        ),
        (
            "Category and Tags",
            {
                "fields": (
                    "category",
                    "tags",
                )
            },
        ),
        (
            "Publishing",
            {
                "fields": (
                    "is_published",
                    "published_at",
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

    ordering = ("-created_at",)
