from random import random
from django.contrib.auth import get_user_model, password_validation, authenticate
from django.utils import timezone
from django.core import exceptions
from django.contrib.auth.forms import SetPasswordForm

from rest_framework import serializers
from rest_framework.serializers import HyperlinkedModelSerializer
from rest_framework.fields import SerializerMethodField
from rest_framework.validators import UniqueValidator
from rest_framework_jwt.settings import api_settings
from django.utils.text import slugify

User = get_user_model()


class UserSerializer(HyperlinkedModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name','email')


class CreateUserSerializer(serializers.Serializer):
    token = SerializerMethodField()
    date_joined = serializers.DateTimeField(
        read_only=True, default=timezone.now)
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())])
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    user_fields = ["email", "first_name", "last_name"]

    def get_token(self, container):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(container)
        token = jwt_encode_handler(payload)
        return token

    def validate(self, attrs):
        # here data has all the fields which have validated values
        # so we can create a User instance out of it
        user_data = {your_key: attrs[your_key]
                     for your_key in self.user_fields}

        user = User(**user_data)
        # get the password from the data
        password = attrs.get('password')
        errors = dict()
        try:
            # validate the password and catch the exception
            password_validation.validate_password(password=password, user=user)

        # the exception raised here is different than
        # serializers.ValidationError
        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)
        return super(CreateUserSerializer, self).validate(attrs)

    def create(self, validated_data):

        user_data = {your_key: validated_data[
            your_key] for your_key in self.user_fields}

        user = User(**user_data)
        user.username = slugify(
            "{}-{}".format(user.first_name, user.last_name))

        if User.objects.filter(username=user.username).exists():
            user.username = slugify(
                "{}-{}{}".format(user.first_name, user.last_name, int(random() * 1000)))

        user.set_password(validated_data['password'])
        user.save()
        user = authenticate(username=user.username,
                            password=validated_data['password'])
        return user

    def update(self, instance, validated_data):
        pass


class PasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField()
    password1 = serializers.CharField()

    def validate(self, attrs):
        password = attrs.get('password')
        password1 = attrs.get('password1')
        errors = dict()

        if password is None:
            errors['password'] = _('password is required.')

        if password1 is None:
            errors['password1'] = _('password1 is required.')

        form_data = {
            'new_password1': password,
            'new_password2': password1,
        }
        user = self.context['request'].user
        if user:
            form = SetPasswordForm(user, data=form_data)

            if form.errors:
                errors.update(form.errors)
            attrs['form'] = form

        if errors:
            raise serializers.ValidationError(errors)

        return super(PasswordResetSerializer, self).validate(attrs)

    def create(self, validated_data):
        form = validated_data.get('form')
        form.save()
        return validated_data

