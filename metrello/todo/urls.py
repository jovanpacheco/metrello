from django.conf.urls import url
from rest_framework import routers
from .views import *


urlpatterns = [
    url(r'^(?P<version>[v1.]+)/list/$', AllListViewSet.as_view(), name='all_list'),
]