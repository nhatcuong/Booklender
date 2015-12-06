from flask import request, jsonify

from shelf import app, db
from services_helper import getData, getError, getSuccess
from shelf.models import Book, Reader, Lending, BookStatus


# create a book #B
@app.route("/book/create", methods=['GET', 'POST'])
def createBook():
    data = getData(request)
    if data is None:
        return getError("book title is required"), 401  # client error
    title = data.get("title")
    author = data.get("author")
    if (title is None or len(title) == 0):
        return getError("book title is required"), 401  # client error
    # todo check pair(title, author) is unique
    book = Book(title=title, author=author).create()
    db.session.commit()
    return jsonify({"newBook": book.dict()}), 201


# obtain all books #B
@app.route("/book/all", methods=['GET', 'POST'])
def getAllBooks():
    allBooks = Book.query.all()
    return jsonify({"books": [book.dict() for book in allBooks]}), 200


# R
@app.route("/reader/all", methods=['GET', 'POST'])
def getAllReaders():
    allReaders = Reader.query.all()
    return jsonify({"readers": [reader.dict() for reader in allReaders]}), 200


# create a reader #R
@app.route("/reader/create", methods=['GET', 'POST'])
def createReader():
    data = getData(request)
    if data is None:
        return getError("name is required"), 401  # client error
    name = data.get('name');
    if (name is None or len(name) == 0):
        return getError("name is required"), 401
    reader = Reader(name=name).create()
    db.session.commit()
    return jsonify({"newReader": reader.dict()}), 201


# lend a book to a reader #B
@app.route("/action/lend", methods=['GET', 'POST'])
def actionLend():
    data = getData(request)
    if data is None:
        return getError("book id and reader id are required"), 401  # client error
    try:
        bookId = int(data.get('bookId'))
        readerId = int(data.get('readerId'))
    except (ValueError, TypeError):
        return getError("invalid input, must have bookId and readerId in int " + data)

    book = Book.query.get(bookId)
    reader = Reader.query.get(readerId)
    if book is None:
        return getError("book does not exist for id " + bookId), 404  # not found
    if reader is None:
        return getError("reader does not exist for id " + readerId), 404

    currentLending = book.obtainCurrentLending()
    if (currentLending is not None):
        return getError("book already lended to someone"), 401

    book.lendToReader(reader)
    db.session.commit()
    return getSuccess("lended to reader " + reader.name), 200


# get back current book
@app.route("/action/getBookBack/<int:bookId>", methods=['GET', 'POST'])
def actionGetBack(bookId):
    if bookId <= 0:
        return getError("book Id must be positive int")
    book = Book.query.get(bookId)
    if book.status != BookStatus.LENDED:
        return getError("book is not currently lended " + bookId)
    book.getBackIfLended()
    db.session.commit()
    return jsonify({"book": book.dict()})


@app.route("/reader/currentBorrowerOfBook", methods=['GET', 'POST'])
def getCurrentBookBorrower():
    data = getData(request)
    try:
        bookId = int(data.get("bookId"))
    except (ValueError, TypeError):
        return getError("invalid input, bookId must be an int"), 401
    book = Book.query.get(bookId)
    if book is None:
        return getError("no book found for id " + bookId)
    if book.currentLendingId is None:
        return getError("book is not currently lended"), 401
    lending = Lending.query.get(book.currentLendingId)
    return jsonify({"reader": Reader.query.get(lending.borrowerId).dict()}), 200


@app.route("/purge", methods=['GET', 'POST'])
def purge():
    Book.query.delete()
    Reader.query.delete()
    Lending.query.delete()
    db.session.commit()
    return getSuccess("done")

# get a books borrowing history #B

# get all books #B

# get books that a reader's borowing #B

# get all borrowers #R
