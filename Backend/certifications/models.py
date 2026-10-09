from django.db import models

# Create your models here.
class Certification(models.Model):
    title = models.CharField(max_length=100)
    issuing_organization = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    certificate_image = models.ImageField(upload_to="certifications/", blank=True, null=True)
    certificate_url = models.URLField(blank=True, null=True)
    credentials_id = models.CharField(max_length=100, blank=True, null=True)
    issue_date = models.DateField()
    expiry_date = models.DateField(blank=True, null=True)
    date_not_expired = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-issue_date"]

    def __str__(self):
        return f"{self.title} - {self.issuing_organization}"