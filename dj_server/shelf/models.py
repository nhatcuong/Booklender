from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from enum import Enum


class Book(models.Model):
    ON_SHELF = 'on_shelf'
    LENDED = 'lended'
    BOOK_STATUS = ((ON_SHELF, 'On Shelf'), (LENDED, 'Lended'))

    title = models.CharField(max_length=180)
    author = models.CharField(max_length=180, null=True)
    status = models.CharField(max_length=20, choices=BOOK_STATUS, default=ON_SHELF)
    current_lending = models.ForeignKey('Lending', null=True, related_name='+')
    user = models.ForeignKey(User)

    def lend_to_reader(self, reader):
        self.get_back_if_lended()
        new_lending = Lending.book_to_reader(self, reader)
        self.status = Book.LENDED
        self.current_lending = new_lending
        self.save()

    def get_back_if_lended(self):
        if self.current_lending is not None:
            self.current_lending.end()
            self.current_lending = None
        self.status = Book.ON_SHELF
        self.save()


class BookStatus(Enum):
    on_shelf = 'on_shelf'
    lended = 'lended'


class Reader(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User)


class Lending(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True)
    book = models.ForeignKey(Book)
    borrower = models.ForeignKey(Reader)

    @classmethod
    def book_to_reader(cls, book, reader):
        start_date = datetime.now().replace(second=0, microsecond=0)
        new_lending = Lending.objects.create(book=book,
                                             borrower=reader,
                                             start_date=start_date)
        new_lending.save()
        return new_lending

    def end(self):
        self.end_date = datetime.now().replace(second=0, microsecond=0)
        self.save()
