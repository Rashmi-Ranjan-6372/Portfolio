from django.urls import path
from .views import (
    ExperienceListCreateAPIView,
    ExperienceDetailAPIView,
)

urlpatterns = [
    path("", ExperienceListCreateAPIView.as_view(), name="experience-list-create"),
    path("<int:pk>/", ExperienceDetailAPIView.as_view(), name="experience-detail"),
]