from django.contrib import admin
from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "designation",
        "company_name",
        "rating",
        "is_featured",
        "is_active",
        "display_order",
        "created_at",
    )

    list_filter = (
        "rating",
        "is_featured",
        "is_active",
        "created_at",
    )

    search_fields = (
        "name",
        "designation",
        "company_name",
        "message",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    list_editable = (
        "rating",
        "is_featured",
        "is_active",
        "display_order",
    )

    ordering = ("display_order", "-created_at")

    fieldsets = (
        ("Person Information", {
            "fields": (
                "name",
                "designation",
                "company_name",
                "profile_image",
                "company_website",
            ),
        }),
        ("Testimonial Details", {
            "fields": (
                "message",
                "rating",
            ),
        }),
        ("Display Settings", {
            "fields": (
                "is_featured",
                "is_active",
                "display_order",
            ),
        }),
        ("Timestamps", {
            "fields": (
                "created_at",
                "updated_at",
            ),
        }),
    )
