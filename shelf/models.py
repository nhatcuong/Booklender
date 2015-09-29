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
    currentLendingId = db.Column(db.Integer)

    lendings = db.relationship('Lending', lazy='dynamic')

    def create(self):
        self.status = BookStatus.ON_SHELF
        db.session.add(self)
        return self

    def dict(self):
        return {"title": self.title, "author": self.author, "status": self.status}

    def lendToReader(self, reader):
        self.getBackIfLended()
        newLending = Lending().create(self, reader)
        self.status = BookStatus.LENDED
        self.currentLendingId = newLending.id
        db.session.add_all([self, reader])

    def getBackIfLended(self):
        lending = Lending.getCurrentLendingOfBook(self)
        if lending is not None:
            lending.end()
        self.status = BookStatus.ON_SHELF


class Reader(db.Model):
    __tablename__ = 'reader'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(20), unique=True)

    def create(self):
        db.session.add(self)
        return self

    def dict(self):
        return {"name": self.name}


class Lending(db.Model):
    __tablename__ = 'lending'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    startDate = db.Column(db.Date)
    endDate = db.Column(db.Date)
    bookId = db.Column(db.Integer, db.ForeignKey('book.id'))
    borrowerId = db.Column(db.Integer, db.ForeignKey('reader.id'))

    def create(self, book, reader):
        self.bookId = book.id
        self.borrowerId = reader.id
        self.startDate = date.today()
        db.session.add(self)
        return self

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
