var app = angular.module("Demo", []);

app.controller("DemoController",
    function($scope, $http) {
        $scope.books = [];

        $http.get("http://127.0.0.1:5000/book/all").then(
            function(response) {
                $scope.books = response.data.books
            },
            function(response) {

            }
        );

        $scope.createABook = function(title, author) {
            $http.post("http://127.0.0.1:5000/book/create",
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
    });