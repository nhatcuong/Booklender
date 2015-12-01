
var app = angular.module("BookLender", []);

var URLPREFIX = "http://127.0.0.1:5000";

app.controller("BooksReadersController",
    function($scope, $http) {
        $scope.books = [];
        $scope.readers = [];
        $scope.currentReaderId =0;
        $scope.currentBookId =0;
        $scope.currentBook = {};
        $scope.currentReader = {};

        $scope.initBooks = function() {
            $http.get(URLPREFIX + "/book/all").then(
                function(response) {
                    $scope.books = response.data.books
                },
                function(response) {

                }
            );
        };

        $scope.initReaders = function() {
            $http.get(URLPREFIX + "/reader/all").then(
                function(response) {
                    $scope.readers = response.data.readers;
                },
                function(response) {

                }
            );
        };

        $scope.createABook = function(title, author) {
            $http.post(URLPREFIX + "/book/create",
                {"title" : title, "author": author}
            ).then(
                function(response) {
                    if (response.status == 201) {
                        $scope.books.push(response.data.newBook);
                        $scope.currentBookId = response.data.newBook.id.toString();
                        //$scope.$evalAsync(function() {
                        //});
                        $scope.title = "";
                        $scope.author = "";
                        alert("added");
                    }
                    else {
                        alert(response.error);
                    }
                },
                function(response) {
                    alert("fail");
                }
            );
        }

        $scope.createAReader = function(name) {
            $http.post(URLPREFIX + "/reader/create",
                {"name": name}
            ).then(
                function(response) {
                    $scope.readers.push(response.data.newReader);
                    alert("added");
                },
                function(response) {
                    alert(response.data.error);
                }
            )
        }

        $scope.lendBookToReader = function() {
            $http.post(URLPREFIX + "/action/lend",
                {"bookId": $scope.currentBookId, "readerId": $scope.currentReaderId}
            ).then(
                function(response) {
                    $scope.currentBook.status = "lended";
                    $scope.currentBook.borrowerId = $scope.currentReaderId;
                    alert("lended");
                },
                function(response) {

                }
            )
        }

        $scope.updateCurrentReaderForCurrentBook = function() {
            $http.post(URLPREFIX + "/reader/currentBorrowerOfBook",
                {"bookId": $scope.currentBookId}
            ).then(
                function(response) {
                    $scope.currentReaderId = response.data.reader.id.toString();
                    $scope.currentBook.borrowerId = $scope.currentReaderId;
                },
                function(response) {
                }
            )
        }

        $scope.onBookSelectionChange = function() {
            $scope.updateCurrentReaderForCurrentBook();
            $scope.updateCurrentBook();
        }

        $scope.updateCurrentBook = function() {
            var books = $scope.books.filter(function(book) {return book.id.toString() === $scope.currentBookId});
            if (!books || books.length < 1) {
                $scope.currentBook = {};
            }
            else {
                $scope.currentBook = books[0];
            }
        }

        $scope.updateCurrentReader = function() {
            var readers = $scope.readers.filter(function(reader) {return reader.id.toString() === $scope.currentReaderId});
            if (!readers || readers.length < 1) {
                $scope.currentReader = {};
            }
            else {
                $scope.currentReader = readers[0];
            }
        }

        $scope.onReaderSelectionChange = function() {
            $scope.updateCurrentReader();
            //alert($scope.currentReaderId);
        }

        $scope.canLendBook = function() {
            if ($scope.currentBookId && $scope.currentReaderId){
                return $scope.currentBook.status != "lended";
            }
            return false;
        }

        $scope.isBookLendedToCurrentReader = function() {
            if ($scope.currentBook && $scope.currentReader){
                return $scope.currentBook.borrowerId == $scope.currentReaderId;
            }
            return false;
        }

        $scope.getBookStatusInString = function(book) {
            switch (book.status) {
                case "lended":
                    return "lended";
                case "on_shelf":
                    return "on shelf";
                return "on shelf";
            }
        }

        $scope.initBooks();
        $scope.initReaders();


    });