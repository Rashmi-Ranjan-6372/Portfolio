from django.urls import path
from .views import PublicProfileAPIView, ProfileUpdateAPIView

urlpatterns = [
    path("profile/", PublicProfileAPIView.as_view(), name="profile"),
    path("profile/update/", ProfileUpdateAPIView.as_view(), name="profile-update"),
]