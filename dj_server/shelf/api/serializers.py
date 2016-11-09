from rest_framework import serializers
from shelf.models import Book, Reader, Lending


class ReaderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reader
        fields = ('id', 'name')


class LendingSerializer(serializers.ModelSerializer):
    borrower = ReaderSerializer()
    start_date = serializers.SerializerMethodField()

    class Meta:
        model = Lending
        fields = ('id', 'start_date', 'borrower')

    def get_start_date(self, lending):
        return lending.start_date.replace(second=0, microsecond=0,
                                          hour=0, minute=0)


class BookSerializer(serializers.ModelSerializer):
    current_lending = LendingSerializer(required=False)
    status = serializers.CharField(required=False)

    class Meta:
        model = Book
        fields = ('id', 'title', 'author', 'status', 'current_lending')
