from django.utils import timezone
from django.core import exceptions
from rest_framework import serializers
from rest_framework.serializers import HyperlinkedModelSerializer
from .models import List, Item


class ListSerializer(serializers.ModelSerializer):

    author = serializers.HiddenField(default=serializers.CurrentUserDefault())
    nro_tareas = serializers.SerializerMethodField()

    def get_nro_tareas(self, obj):
        return obj.item_set.all().count()

    class Meta:
        model = List
        fields = ('uuid', 'name','priority','active','author','get_priority','nro_tareas')


class ItemSerializer(serializers.HyperlinkedModelSerializer):

    uuid_list = serializers.CharField(source='list') 
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())

    def validate_uuid_list(self, uuid):

        try:
            list_obj = List.objects.get(uuid=uuid)
            return list_obj
        except List.DoesNotExist:
            raise serializers.ValidationError('No existe la lista seleccionada')
        
    def create(self, validated_data):
        
        list_obj = validated_data.pop('list')
        item = Item.objects.create(list=list_obj,**validated_data)
        return item

    class Meta:
        model = Item
        fields = ('uuid', 'title','priority','uuid_list','due_date','completed','completed_date',
        'note','active','assigned_to', 'author')

        extra_kwargs = {
            'list': {'lookup_field': 'uuid'},
            'assigned_to' : {'required':False}
        }



class ItemCompletedSerializer(serializers.Serializer):

    def update(self, instance, validated_data):
        instance.completed = True  
        instance.save()
        return instance