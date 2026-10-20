
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    PublicProfileAPIView,
    ProfileUpdateAPIView,
    AdminLoginAPIView,
    AdminLogoutAPIView,
)

urlpatterns = [
    path("login/", AdminLoginAPIView.as_view(), name="admin-login"),
    path("logout/", AdminLogoutAPIView.as_view(), name="admin-logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("profile/", PublicProfileAPIView.as_view(), name="profile"),
    path("profile/update/", ProfileUpdateAPIView.as_view(), name="profile-update"),
]
