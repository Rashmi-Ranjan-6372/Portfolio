from django.db import models


class Experience(models.Model):
    job_title = models.CharField(max_length=150)
    company_name = models.CharField(max_length=200)
    employment_type = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=150, blank=True, null=True)
    description = models.TextField()
    responsibilities = models.TextField(blank=True, null=True)
    skills_used = models.CharField(max_length=300, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    company_logo = models.ImageField(
        upload_to="experience/",
        blank=True,
        null=True,
    )
    company_website = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_date"]
        verbose_name = "Experience"
        verbose_name_plural = "Experience"

    def __str__(self):
        return f"{self.job_title} - {self.company_name}"