from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import RetrieveAPIView, UpdateAPIView, CreateAPIView, get_object_or_404
from rest_framework.views import APIView
from .serializers import UserSerializer, CreateUserSerializer,PasswordResetSerializer

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """
        Api de usuario
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_serializer_class(self):
        if self.request.method.lower() == "post":
            return CreateUserSerializer
        return super(UserViewSet, self).get_serializer_class()

    def get_permissions(self):
        if self.request.method.lower() == "post":
            return [AllowAny()]
        return super(UserViewSet, self).get_permissions()


class UserView(RetrieveAPIView, UpdateAPIView):
    """
        Usuario en sesion
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)


    def get_object(self):
        return self.request.user


class PasswordReset(CreateAPIView):
    """
    post:
        Cambio de clave

    """
    serializer_class = PasswordResetSerializer