from django.urls import path
from .views import (
    ContactMessageListCreateAPIView,
    ContactMessageDetailAPIView,
)

urlpatterns = [
    path("", ContactMessageListCreateAPIView.as_view(), name="contact-list-create"),
    path("<int:pk>/", ContactMessageDetailAPIView.as_view(), name="contact-detail"),
]