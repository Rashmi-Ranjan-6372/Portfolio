from django.urls import path
from .views import (
    EducationListCreateAPIView,
    EducationDetailAPIView,
)

urlpatterns = [
    path("", EducationListCreateAPIView.as_view(), name="education-list-create"),
    path("<int:pk>/", EducationDetailAPIView.as_view(), name="education-detail"),
]