from django.db import models


class SkillCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "name"]
        verbose_name = "Skill Category"
        verbose_name_plural = "Skill Categories"

    def __str__(self):
        return self.name


class Skill(models.Model):
    PROFICIENCY_CHOICES = [
        ("BEGINNER", "Beginner"),
        ("INTERMEDIATE", "Intermediate"),
        ("ADVANCED", "Advanced"),
        ("EXPERT", "Expert"),
    ]

    name = models.CharField(max_length=100)
    category = models.ForeignKey(
        SkillCategory,
        on_delete=models.CASCADE,
        related_name="skills",
    )
    proficiency = models.CharField(
        max_length=20,
        choices=PROFICIENCY_CHOICES,
        default="INTERMEDIATE",
    )
    proficiency_percentage = models.PositiveSmallIntegerField(default=50)
    icon = models.CharField(max_length=100, blank=True, null=True)
    years_of_experience = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        blank=True,
        null=True,
    )
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "name"]
        verbose_name = "Skill"
        verbose_name_plural = "Skills"
        constraints = [
            models.UniqueConstraint(
                fields=["name", "category"],
                name="unique_skill_name_per_category",
            )
        ]

    def __str__(self):
        return f"{self.name} - {self.category.name}"

    def save(self, *args, **kwargs):
        self.proficiency_percentage = min(
            max(self.proficiency_percentage, 0), 100
        )
        super().save(*args, **kwargs)
