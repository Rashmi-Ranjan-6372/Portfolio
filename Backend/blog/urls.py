from django.urls import path
from .views import (
    BlogListCreateAPIView,
    BlogDetailAPIView,
    BlogPublishAPIView,
)

urlpatterns = [
    path("", BlogListCreateAPIView.as_view(), name="blog-list-create"),
    path("<slug:slug>/", BlogDetailAPIView.as_view(), name="blog-detail"),
    path("<slug:slug>/publish/", BlogPublishAPIView.as_view(), name="blog-publish",),
]