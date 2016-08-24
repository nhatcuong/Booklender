"use strict";

var URLPREFIX = "http://127.0.0.1:8000/api";

var apiAddBook = function apiAddBook(caller, title, author, success, error) {
  $.ajax({
    url: URLPREFIX + "/books/",
    type: 'POST',
    dataType: 'json',
    data: {title: title, author: author},
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiAllBooks = function apiAllBooks(caller, success, error) {
  $.ajax({
    url: URLPREFIX + "/books/",
    type: 'GET',
    dataType: 'json',
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiAllBorrowers = function apiAllBorrowers(caller, success, error) {
  $.ajax({
    url: URLPREFIX + "/readers/",
    type: 'GET',
    dataType: 'json',
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiAddBorrower = function apiAddBorrower(caller, name, success, error) {
  $.ajax({
    url: URLPREFIX + "/readers/",
    type: 'POST',
    dataType: 'json',
    data: {name: name},
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiLendBook = function apiLendBook(caller, bookId, borrowerId, success, error) {
  $.ajax({
    url: URLPREFIX + "/lend/",
    type: 'POST',
    dataType: 'json',
    data: {bookId: bookId, readerId: borrowerId},
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiGetBack = function apiGetBack(caller, bookId, success, error) {
  $.ajax({
    url: URLPREFIX + "/getBack/",
    type: 'POST',
    data: {bookId: bookId},
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiGetCurrentBorrowerOfBook = function apiGetCurrentBorrowerOfBook(caller, bookId, success, error) {
  $.ajax({
    url: URLPREFIX + "/currentBorrowerOfBook/",
    type: 'GET',
    dataType: 'json',
    data: {bookId: bookId},
    success: success.bind(caller),
    error: error.bind(caller)
  });
};
