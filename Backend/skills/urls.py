from django.urls import path
from .views import (
    SkillCategoryListCreateAPIView,
    SkillCategoryDetailAPIView,
    SkillListCreateAPIView,
    SkillDetailAPIView,
)

urlpatterns = [
    path("categories/", SkillCategoryListCreateAPIView.as_view(), name="skill-category-list-create"),
    path("categories/<int:pk>/", SkillCategoryDetailAPIView.as_view(), name="skill-category-detail"),
    path("", SkillListCreateAPIView.as_view(), name="skill-list-create"),
    path("<int:pk>/", SkillDetailAPIView.as_view(), name="skill-detail"),
]