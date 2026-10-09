from django.contrib import admin
from .models import SkillCategory, Skill


@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "description",
        "display_order",
        "created_at",
    )
    search_fields = ("name", "description")
    readonly_fields = ("created_at", "updated_at")
    list_editable = ("display_order",)
    ordering = ("display_order", "name")

    fieldsets = (
        (
            "Category Information",
            {
                "fields": ("name", "description"),
            },
        ),
        (
            "Display Settings",
            {
                "fields": ("display_order",),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
            },
        ),
    )


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "proficiency",
        "proficiency_percentage",
        "years_of_experience",
        "is_featured",
        "is_active",
        "display_order",
    )
    list_filter = (
        "category",
        "proficiency",
        "is_featured",
        "is_active",
    )
    search_fields = ("name", "category__name")
    readonly_fields = ("created_at", "updated_at")
    list_editable = (
        "proficiency",
        "proficiency_percentage",
        "is_featured",
        "is_active",
        "display_order",
    )
    ordering = ("display_order", "name")
    list_select_related = ("category",)

    fieldsets = (
        (
            "Skill Information",
            {
                "fields": ("name", "category", "icon"),
            },
        ),
        (
            "Proficiency Details",
            {
                "fields": (
                    "proficiency",
                    "proficiency_percentage",
                    "years_of_experience",
                ),
            },
        ),
        (
            "Display Settings",
            {
                "fields": (
                    "is_featured",
                    "is_active",
                    "display_order",
                ),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
            },
        ),
    )
