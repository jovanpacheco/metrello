# Generated by Django 2.1 on 2018-10-24 19:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('condicion', models.BooleanField(default=True)),
                ('title', models.CharField(max_length=140)),
                ('due_date', models.DateField(blank=True, null=True)),
                ('completed', models.BooleanField(default=False)),
                ('completed_date', models.DateField(blank=True, null=True)),
                ('note', models.TextField()),
                ('priority', models.PositiveIntegerField(choices=[(1, 'high'), (2, 'medium'), (3, 'normal'), (4, 'low')])),
                ('active', models.BooleanField(default=True)),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False)),
                ('assigned_to', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='todo_assigned_to', to=settings.AUTH_USER_MODEL)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_by+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['priority'],
            },
        ),
        migrations.CreateModel(
            name='List',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('condicion', models.BooleanField(default=True)),
                ('name', models.CharField(max_length=60)),
                ('slug', models.SlugField(max_length=100)),
                ('priority', models.PositiveIntegerField(choices=[(1, 'high'), (2, 'medium'), (3, 'normal'), (4, 'low')])),
                ('active', models.BooleanField(default=True)),
                ('uuid', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_by+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Lists',
                'ordering': ['name'],
            },
        ),
        migrations.AddField(
            model_name='item',
            name='list',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='todo.List'),
        ),
        migrations.AlterUniqueTogether(
            name='list',
            unique_together={('author', 'slug')},
        ),
    ]
