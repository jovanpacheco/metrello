"""metrello URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings

from users.urls import router as router_user, urlpatterns as urlpatterns_user
from todo.urls import urlpatterns as urlpatterns_todo
from .templates_urls import urlpatterns as urlpatterns_templates
from common.views import SwaggerSchemaView
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

urlpatterns = [
    path('admin/', admin.site.urls),    
    path('api/', include(router_user.urls)),
    path('api/', include(urlpatterns_user)),
    path('api/', include(urlpatterns_todo)),    
    path('api/docs', SwaggerSchemaView.as_view()),
    path('auth/obtain_token/', obtain_jwt_token),
    path('auth/refresh_token/', refresh_jwt_token),
    path('auth/verify_jwt_token/', verify_jwt_token),
    
    path('', include(urlpatterns_templates)),   
]
