# -*- coding: utf-8 -*-
import uuid as uuid_lib
from django.db import models
from django.conf import settings
from django.template.defaultfilters import slugify
from django.utils.translation import ugettext_lazy as _
from common.models import BaseModel
import datetime


PRIORITY_CHOICE = (
    (1,'Alta'),
    (2,'Media'),
    (3,'Normal'),
    (4,'Baja'),
)

class List(BaseModel):
    author = models.ForeignKey(settings.AUTH_USER_MODEL,
    					       related_name='created_by+',
    					       on_delete=models.CASCADE)
    name = models.CharField(max_length=60)
    slug = models.SlugField(max_length=100)
    priority = models.PositiveIntegerField(choices=PRIORITY_CHOICE)
    active = models.BooleanField(default=True)
    uuid = models.UUIDField(db_index=True,
        					default=uuid_lib.uuid4,
					        editable=settings.DEBUG)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(List, self).save(*args, **kwargs)

    @property
    def get_priority(self):
        if self.priority == 1:
            return 'Alta'
        elif self.priority == 2:
            return 'Media'
        elif self.priority == 3:
            return 'Normal'
        elif self.priority == 4:
            return 'Baja'

    def __str__(self):
        return self.name

    def count_by_author(self,author):
        return List.objects.filter(active=True,author=self.author).count()

    def incomplete_tasks(self):
        return Item.objects.filter(list=self, completed=False)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = _("Lists")
        unique_together = ("author", "slug")


class Item(BaseModel):

    author = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='created_by+',
    						   on_delete=models.CASCADE)	
    title = models.CharField(max_length=140)
    list = models.ForeignKey(List,
    						 on_delete=models.CASCADE)
    note = models.TextField()
    priority = models.PositiveIntegerField(choices=PRIORITY_CHOICE)  
      
    due_date = models.DateField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    completed_date = models.DateField(blank=True, null=True)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True,
                                    related_name='todo_assigned_to',
                                    on_delete=models.CASCADE)

    active = models.BooleanField(default=True)
    uuid = models.UUIDField(db_index=True,
        					default=uuid_lib.uuid4,
                            editable=settings.DEBUG)

    def overdue_status(self):
        "Returns whether the item's due date has passed or not."
        if self.due_date and datetime.date.today() > self.due_date:
            return 1

    @property
    def get_priority(self):
        if self.priority == 1:
            return 'Alta'
        elif self.priority == 2:
            return 'Media'
        elif self.priority == 3:
            return 'Normal'
        elif self.priority == 4:
            return 'Baja'
            
    def __str__(self):
        return self.title

    # Auto-set the item creation / completed date
    def save(self, *args, **kwargs):
        # If Item is being marked complete, set the completed_date
        if self.completed:
            self.completed_date = datetime.datetime.now()
        super(Item, self).save(*args, **kwargs)

    class Meta:
        ordering = ["priority"]

