# Generated by Django 5.1.2 on 2024-10-26 00:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_alter_profile_profile_image_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='profile_image_url',
            field=models.URLField(null=True),
        ),
    ]
