from django.urls import path
from .views import (
    TestimonialListCreateAPIView,
    TestimonialDetailAPIView,
)

urlpatterns = [
    path("", TestimonialListCreateAPIView.as_view(), name="testimonial-list-create",),
    path("<int:pk>/", TestimonialDetailAPIView.as_view(), name="testimonial-detail",),
]