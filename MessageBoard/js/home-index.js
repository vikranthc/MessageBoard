// hoem-index.js
function homeIndexController($scope, $http) {
    $scope.data = [];
    $scope.isBusy = true;

    $http.get("/api/v1/topics?includeReplies=true")
        .then(
            function (result) {
                //successfull
                angular.copy(result.data, $scope.data);
            },
            function () {
                // error
                alert("Could not load topics");
            })
        .then(function () { $scope.isBusy = false; });
}