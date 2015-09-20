from shelf import db
from datetime import date

def enum(**enums):
    return type('Enum', (), enums)

BookStatus = enum(ON_SHELF="on_shelf", LENDED="lended", LOST="lost")

class Book(db.Model):
    __tablename__ = 'book'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(128))
    author = db.Column(db.String(64))
    status = db.Column(db.String(10))

    def create(self, title, author):
        self.title = title
        self.author = author
        self.status = BookStatus.ON_SHELF
        db.session.add(self)

    def dict(self):
        return {"title": self.title, "author": self.author, "status": self.status}

class Reader(db.Model):
    __tablename__ = 'reader'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(20), unique=True)

    def create(self, name):
        self.name = name
        db.session.add(self)

    def dict(self):
        return {"name": self.name}


class Lending(db.Model):
    __tablename__ = 'lending'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    startDate = db.Column(db.Date)
    endDate = db.Column(db.Date)
    book = db.relationship("Book")
    borrower = db.relationship("Reader")

    def create(self, book, borrower):
        self.book = book
        self.borrower = borrower
        self.startDate = date.today()
        db.session.add(self)

    def dict(self):
        return {"book": self.book.title, "borrower": self.borrower.name, "startDate": self.startDate}