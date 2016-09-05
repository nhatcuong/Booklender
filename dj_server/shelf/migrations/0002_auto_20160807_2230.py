# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-07 22:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shelf', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Borrower',
            new_name='Reader',
        ),
        migrations.AlterField(
            model_name='book',
            name='author',
            field=models.CharField(max_length=180, null=True),
        ),
    ]