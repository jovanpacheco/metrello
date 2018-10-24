from django.conf.urls import url
from rest_framework import routers
from .views import AllListViewSet, ObjectListViewSet,\
	AllItemViewSet, ObjectItemViewSet


urlpatterns = [
	## APis for list
    url(r'^(?P<version>[v1.]+)/list/$', AllListViewSet.as_view(), name='all_list'),
	url(r'^(?P<version>[v1.]+)/list/(?P<uuid>[-\w]+)/$',ObjectListViewSet.as_view(),name='uuid_list'),   

	## Apis for item 
	url(r'^(?P<version>[v1.]+)/item/$', AllItemViewSet.as_view(),name='all_item'),
	url(r'^(?P<version>[v1.]+)/item/(?P<uuid>[-\w]+)/$',ObjectItemViewSet.as_view(),name='uuid_item'),
	
]