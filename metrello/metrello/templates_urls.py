from django.urls import path
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView
from django.conf import settings

urlpatterns = [
    path('favicon.ico', RedirectView.as_view(url=settings.STATIC_URL + 'favicon.ico')),
    path('login', TemplateView.as_view(template_name='login.html'), name="login"),
    path('dashboard/', TemplateView.as_view(template_name='dashboard.html'), name="dashboard"),
    path('perfil/', TemplateView.as_view(template_name='perfil.html'), name="perfil"),
    path('', TemplateView.as_view(template_name='index.html'), name="inicio"),
]
