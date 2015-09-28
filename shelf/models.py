from datetime import date

from shelf import db


def enum(**enums):
    return type('Enum', (), enums)


BookStatus = enum(ON_SHELF="on_shelf", LENDED="lended", LOST="lost")


class Book(db.Model):
    __tablename__ = 'book'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(256))
    author = db.Column(db.String(256))
    status = db.Column(db.String(10), nullable=True)

    def create(self):
        self.status = BookStatus.ON_SHELF
        db.session.add(self)
        db.session.commit()
        return self

    def dict(self):
        return {"title": self.title, "author": self.author, "status": self.status}

    def lendToReader(self, reader):
        self.getBackIfLended()
        newLending = Lending().create(self, reader)
        self.status = BookStatus.LENDED

    def getBackIfLended(self):
        lending = Lending.getCurrentLendingOfBook(self)
        if lending is not None:
            lending.end()
        self.status = BookStatus.ON_SHELF


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
    # borrower = db.relationship("Reader")
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'))
    # book = db.relationship("Book", backref="lendings")

    def create(self, book):
        self.book = book
        self.startDate = date.today()
        db.session.add(self)

    def dict(self):
        return {"book": self.book.title, "borrower": self.borrower.name, "startDate": self.startDate}

    def endLending(self):
        self.endDate = date.today()

    @staticmethod
    def getCurrentLendingOfBook(book):
        lendings = book.lendings
        runningLendings = {l for l in lendings if l.endDate is None}
        assert len(runningLendings) <= 1, "book %r has more than 1 running lendings" % book.id
        if len(runningLendings) > 0:
            return runningLendings[0]
        return None
