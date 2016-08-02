"use strict";

var URLPREFIX = "http://127.0.0.1:5000";

var apiAddBook = function(caller, title, author, success, error) {
  $.ajax({
    url: URLPREFIX + "/book/create",
    type: 'POST',
    dataType: 'json',
    data: { title: title, author: author },
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiAllBooks = function(caller, success, error) {
  $.ajax({
    url: URLPREFIX + "/book/all",
    type: 'GET',
    dataType: 'json',
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiAllBorrowers = function(caller, success, error) {
  $.ajax({
    url: URLPREFIX + "/reader/all",
    type: 'GET',
    dataType: 'json',
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiAddBorrower = function(caller, name, success, error) {
  $.ajax({
    url: URLPREFIX + "/reader/create",
    type: 'POST',
    dataType: 'json',
    data: { name: name },
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiLendBook = function(caller, bookId, borrowerId, success, error) {
  $.ajax({
    url: URLPREFIX + "/action/lend",
    type: 'POST',
    dataType: 'json',
    data: {bookId: bookId, readerId: borrowerId},
    success: success.bind(caller),
    error: error.bind(caller)
  })
}

//# sourceMappingURL=api_react.js.map
//# sourceMappingURL=api_react.js.map