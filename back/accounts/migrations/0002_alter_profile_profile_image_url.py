# Generated by Django 5.1.2 on 2024-10-26 00:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='profile_image_url',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]
