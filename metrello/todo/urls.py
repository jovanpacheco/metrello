from django.conf.urls import url
from rest_framework import routers
from .views import AllListViewSet, ObjectListViewSet


urlpatterns = [
    url(r'^(?P<version>[v1.]+)/list/$', AllListViewSet.as_view(), name='all_list'),
	url(r'^(?P<version>[v1.]+)/list/(?P<uuid>[-\w]+)/$',ObjectListViewSet.as_view(),name='uuid_list'),    
]