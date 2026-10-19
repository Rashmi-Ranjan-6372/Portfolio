
from rest_framework import serializers
from django.utils import timezone
from django.utils.text import slugify

from .models import Blog


class BlogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Blog
        fields = [
            "id",
            "title",
            "slug",
            "thumbnail",
            "summary",
            "content",
            "category",
            "tags",
            "is_published",
            "published_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "published_at",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        title = validated_data["title"]
        base_slug = slugify(title)
        slug = base_slug
        counter = 1

        while Blog.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        validated_data["slug"] = slug

        if validated_data.get("is_published", False):
            validated_data["published_at"] = timezone.now()

        return Blog.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)

        if instance.is_published and not instance.published_at:
            instance.published_at = timezone.now()

        instance.save()

        return instance
