from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('accounts/', include('accounts.urls')),
    path('projects/', include('projects.urls')),
    path('skills/', include('skills.urls')),
    path('experience/', include('experience.urls')),
    path('education/', include('education.urls')),
    path('certifications/', include('certifications.urls')),
    path('contact/', include('contact.urls')),
    path('testimonials/', include('testimonials.urls')),
    path('blog/', include('blog.urls')),
]