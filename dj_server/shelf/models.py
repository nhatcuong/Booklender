from django.db import models
from datetime import datetime


class Book(models.Model):
    ON_SHELF = 'on_shelf'
    LENDED = 'lended'
    BOOK_STATUS = ((ON_SHELF, 'On Shelf'), (LENDED, 'Lended'))

    title = models.CharField(max_length=180)
    author = models.CharField(max_length=180)
    status = models.CharField(max_length=20, choices=BOOK_STATUS, default=ON_SHELF)
    current_lending = models.ForeignKey('Lending', null=True, related_name='+')

    def lend_to_reader(self, reader):
        self.getBackIfLended()
        new_lending = Lending.book_to_reader(self, reader)
        self.status = Book.LENDED
        self.current_lending = new_lending
        self.save()

    def get_back_if_lended(self):
        if self.current_lending is not None:
            self.current_lending.end()
        self.status = Book.ON_SHELF
        self.save()


class Borrower(models.Model):
    name = models.CharField(max_length=100)


class Lending(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    book = models.ForeignKey(Book)
    borrower = models.ForeignKey(Borrower)

    @classmethod
    def book_to_reader(cls, book, reader):
        new_lending = Lending.objects.create(book=book, reader=reader)
        new_lending.start()
        new_lending.save()
        return new_lending

    def start(self):
        self.start_date = datetime.now()
        self.save()

    def end(self):
        self.end_date = datetime.now()
        self.save()
