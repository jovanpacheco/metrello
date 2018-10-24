from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.generics import RetrieveAPIView, UpdateAPIView,\
     CreateAPIView, ListAPIView, DestroyAPIView, get_object_or_404
from rest_framework.views import APIView

from .permissions import IsAuthor, IsAuthorOrAdmin
from .serializers import ListSerializer, ItemSerializer
from .models import List, Item
User = get_user_model()


class AllListViewSet(CreateAPIView, ListAPIView):

    permission_classes = (IsAuthenticated, )
    serializer_class = ListSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return List.objects.all()
        else:
            return List.objects.filter(author=self.request.user)


class ObjectListViewSet(RetrieveAPIView, UpdateAPIView, DestroyAPIView):
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


class AllItemViewSet(CreateAPIView, ListAPIView):

    permission_classes = (IsAuthenticated, )
    serializer_class = ItemSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Item.objects.all()
        else:
            return Item.objects.filter(author=self.request.user)


class ObjectItemViewSet(RetrieveAPIView, UpdateAPIView, DestroyAPIView):
    serializer_class = ItemSerializer
    lookup_field = 'uuid'

    def get_permissions(self):
        method = self.request.method.lower()

        if method == "get":
            return [IsAuthorOrAdmin()]
        else:
            return [IsAuthor()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Item.objects.all()
        else:
            return Item.objects.filter(author=self.request.user)