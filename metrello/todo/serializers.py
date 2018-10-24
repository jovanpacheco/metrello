from django.utils import timezone
from django.core import exceptions
from rest_framework import serializers
from rest_framework.serializers import HyperlinkedModelSerializer
from .models import List


class ListSerializer(serializers.ModelSerializer):

    author = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = List
        fields = ('uuid', 'name','priority','active','author')     