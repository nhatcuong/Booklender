from flask import request

from shelf import app, db
from service_helper import getData, getError, getSuccess
from shelf.models import Book


# create a book #B
@app.route("/book/create", methods=['GET', 'POST'])
def createBook():
    data = getData(request)
    title = data.get("title")
    author = data.get("author")
    if (title is None or len(title) == 0):
        return getError("book title is required"), 401  # client error
    # to do check pair(title, author) is unique
    book = Book(title = title, author = author)
    book.create()
    # book.create(title, author)
    # db.session.commit()
    return getSuccess("created"), 201

# create a reader #R

# lend a book to a reader #B

# get back a book #B

# get a book informations including current borrower #B

# get a books borrowing history #B

# get all books #B

# get books that a reader's borowing #B

# get all borrowers #R
