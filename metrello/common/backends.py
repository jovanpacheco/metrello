from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from rest_framework.authentication import BaseAuthentication, CSRFCheck
from rest_framework import exceptions
from rest_framework_jwt.authentication import JSONWebTokenAuthentication


class EmailAuthBackend(ModelBackend):
    """Allow users to log in with their email address"""

    def authenticate(self, request, username=None, password=None, **kwargs):
        # Some authenticators expect to authenticate by 'username'
        email = username
        if email is None:
            email = kwargs.get('username')

        try:
            user = get_user_model().objects.get(email=email)
            if user.check_password(password):
                user.backend = "%s.%s" % (self.__module__, self.__class__.__name__)
                return user
        except get_user_model().DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return get_user_model().objects.get(pk=user_id)
        except get_user_model().DoesNotExist:
            return None