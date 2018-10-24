from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.generics import RetrieveAPIView, UpdateAPIView,\
     CreateAPIView, ListAPIView, DestroyAPIView, get_object_or_404
from rest_framework.views import APIView

from .permissions import IsAuthor, IsAuthorOrAdmin
from .serializers import ListSerializer, ItemSerializer, ItemCompletedSerializer
from .models import List, Item


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


class ItemMixin(object):

    serializer_class = ItemSerializer
    lookup_field = 'uuid'
    lookup_url_kwarg = 'uuid'

    def get_queryset(self):
        if self.request.user.is_staff:
            return Item.objects.all()
        else:
            return Item.objects.filter(author=self.request.user)


class AllItemViewSet(ItemMixin, CreateAPIView, ListAPIView):

    permission_classes = (IsAuthenticated,)



class ObjectItemViewSet(ItemMixin, RetrieveAPIView, UpdateAPIView, DestroyAPIView):

    def get_permissions(self):
        method = self.request.method.lower()

        if method == "get":
            return [IsAuthorOrAdmin()]
        else:
            return [IsAuthor()]


class CompletedItemViewSet(ItemMixin, UpdateAPIView):

    serializer_class = ItemCompletedSerializer


class AllItemForListViewSet(ItemMixin, ListAPIView):


    def get_queryset(self):
        """
        El administrador puede ver todo
        Cualquier usuario ve sus tareas o las que les 
        fueron asignadas
        """
        if self.request.user.is_staff:
            lista = get_object_or_404(List,
                                      uuid=self.kwargs[self.lookup_url_kwarg])
            return lista.item_set.all()
        else:
            return Item.objects.filter(Q(author=self.request.user) |
                                       Q(assigned_to=self.request.user))