
var app = angular.module("BookLender", []);

var URLPREFIX = "http://127.0.0.1:5000";

app.controller("BooksReadersController",
    function($scope, $http) {
        $scope.books = [];
        $scope.readers = [];
        $scope.currentReaderId =0;
        $scope.currentBookId =0;

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
                },
                function(response) {
                }
            )
        }

        $scope.onBookSelectionChange = function() {
            $scope.updateCurrentReaderForCurrentBook();
        }

        $scope.onReaderSelectionChange = function() {
            //alert($scope.currentReaderId);
        }

        $scope.canLendBook = function() { //TODO more conditions here
            return $scope.currentBookId && $scope.currentReaderId;
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