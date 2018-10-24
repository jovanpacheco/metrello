from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.generics import RetrieveAPIView, UpdateAPIView,\
     CreateAPIView, ListAPIView, get_object_or_404
from rest_framework.views import APIView

from .permissions import IsAuthor, IsAuthorOrAdmin
from .serializers import ListSerializer
from .models import List
User = get_user_model()


class AllListViewSet(CreateAPIView, ListAPIView):

    permission_classes = (IsAuthenticated, )
    serializer_class = ListSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return List.objects.all()
        else:
            return List.objects.filter(author=self.request.user)


class ObjectListViewSet(RetrieveAPIView, UpdateAPIView):
    serializer_class = ListSerializer
    lookup_field = 'uuid'

    def get_permissions(self):
        method = self.request.method.lower()

        if method == "get":
            return [IsAuthorOrAdmin()]
        else:
            return [IsAuthor()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return List.objects.all()
        else:
            return List.objects.filter(author=self.request.user)            