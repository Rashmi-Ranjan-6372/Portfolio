from django.db import models


class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    designation = models.CharField(max_length=150, blank=True, null=True)
    company_name = models.CharField(max_length=150, blank=True, null=True)
    message = models.TextField()
    profile_image = models.ImageField(
        upload_to="testimonials/",
        blank=True,
        null=True,
    )
    company_website = models.URLField(blank=True, null=True)
    rating = models.PositiveSmallIntegerField(default=5)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "-created_at"]
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"

    def __str__(self):
        return f"{self.name} - {self.designation or 'Testimonial'}"

    def save(self, *args, **kwargs):
        self.rating = min(max(self.rating, 1), 5)
        super().save(*args, **kwargs)
