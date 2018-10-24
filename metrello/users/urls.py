from django.conf.urls import url
from rest_framework import routers
from .views import UserViewSet, UserView

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    url(r'^user', UserView.as_view()),
]