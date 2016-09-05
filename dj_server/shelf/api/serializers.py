from rest_framework import serializers
from shelf.models import Book, Reader


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('id', 'title', 'author', 'status', 'current_lending_id')


class ReaderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reader
        fields = ('id', 'name')
