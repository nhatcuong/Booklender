"use strict"

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var API_URL_PREFIX = baseUrl + '/api';

var apiAddBook = function apiAddBook(caller, title, author, success, error) {
  $.ajax({
    url: API_URL_PREFIX + "/books/",
    type: 'POST',
    dataType: 'json',
    data: {title: title, author: author},
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiAllBooks = function apiAllBooks(caller, success, error) {
  $.ajax({
    url: API_URL_PREFIX + "/books/",
    type: 'GET',
    dataType: 'json',
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiAllBorrowers = function apiAllBorrowers(caller, success, error) {
  $.ajax({
    url: API_URL_PREFIX + "/readers/",
    type: 'GET',
    dataType: 'json',
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiAddBorrower = function apiAddBorrower(caller, name, success, error) {
  $.ajax({
    url: API_URL_PREFIX + "/readers/",
    type: 'POST',
    dataType: 'json',
    data: {name: name},
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiLendBook = function apiLendBook(caller, bookId, borrowerId, success, error) {
  $.ajax({
    url: API_URL_PREFIX + "/lend/",
    type: 'POST',
    dataType: 'json',
    data: {bookId: bookId, readerId: borrowerId},
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiGetBack = function apiGetBack(caller, bookId, success, error) {
  $.ajax({
    url: API_URL_PREFIX + "/getBack/",
    type: 'POST',
    data: {bookId: bookId},
    success: success.bind(caller),
    error: error.bind(caller)
  });
};

var apiGetCurrentBorrowerOfBook = function apiGetCurrentBorrowerOfBook(caller, bookId, success, error) {
  $.ajax({
    url: API_URL_PREFIX + "/currentBorrowerOfBook/",
    type: 'GET',
    dataType: 'json',
    data: {bookId: bookId},
    success: success.bind(caller),
    error: error.bind(caller)
  });
};
