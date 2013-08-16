// hoem-index.js

var module = angular.module("homeIndex", []);

module.config(function ($routeProvider) {
    $routeProvider.when("/", {
        controller: "topicsController",
        templateUrl: "/templates/topicsView.html"
    });

    $routeProvider.when("/newMessage", {
        controller: "newTopicController",
        templateUrl: "/templates/newTopicView.html"
    });

    $routeProvider.when("/message/:id", {
        controller: "singleTopicController",
        templateUrl:"/templates/singleTopicView.html"
    });

    $routeProvider.otherwise({ redirectTo: "/" });
});

module.factory("dataService", function ($http,$q) {

    var _topics = [];
    var _isInit = false;

    var _isReady = function() {
        return _isInit;
    };
    var _getTopics = function () {
        var _deferred = $q.defer();
        $http.get("/api/v1/topics?includeReplies=true").then(function(result) {
            // Success
            angular.copy(result.data, _topics);
            _isInit = true;
            _deferred.resolve();
        }, function () {
            // Error
            _deferred.reject();
        });

        return _deferred.promise;
    };
    
    var _addTopic = function (newTopic) {
        var _deferred = $q.defer();
        $http.post("/api/v1/topics", newTopic).then(function (result) {
            // Success
            var newlyCreatedTopic = result.data;
            _topics.splice(0, 0, newlyCreatedTopic);
            _deferred.resolve(newlyCreatedTopic);
        }, function () {
            // Error
            _deferred.reject();
        });

        return _deferred.promise;
    };
    
    var _getTopicById = function (id) {
        var _deferred = $q.defer();

        if (_isReady) {
            var topic = _findTopic(id);
            if (topic) {
                _deferred.resolve(topic);
            } else {
                _deferred.reject();
            }
        } else {
            _getTopics().then(function() {
                // success
                var topic = _findTopic(id);
                if (topic) {
                    _deferred.resolve(topic);
                } else {
                    _deferred.reject();
                }
            }, function () {
                _deferred.reject();
            });
        }

        return _deferred.promise;
    };

    var _saveReply = function (topic, newReply) {
        var _deferred = $q.defer();

        $http.post("/api/v1/topics/" + topic.Id + "/Replies", newReply).then(function(result) {
            if (topic.Replies == null) {
                topic.Replies = [];
            }
            topic.Replies.push(result.data);
            _deferred.resolve(result.data);
        }, function () {
            _deferred.reject();
        });
        return _deferred.promise;
    };

    function _findTopic(id) {
        var found = null;

        $.each(_topics, function(i, item) {
            if (item.Id == id) {
                found = item;
                return false;
            }
        });
        return found;
    }

    return {
        topics: _topics,
        getTopics: _getTopics,
        addTopic: _addTopic,
        isReady: _isReady,
        getTopicById: _getTopicById,
        saveReply: _saveReply
    };
});

function topicsController($scope, dataService) {
    $scope.data = dataService;
    $scope.isBusy = false;

    if (dataService.isReady() === false) {
        $scope.isBusy = true;
        dataService.getTopics().then(function () {
        }, function () { alert("Could not load topics"); })
        .then(function () { $scope.isBusy = false; });
    }
}

function newTopicController($scope, $window, dataService) {
    $scope.newTopic = {};

    $scope.save = function() {
        dataService.addTopic($scope.newTopic).then(function () { $window.location = "#/"; }, function() { alert("Could not save the topic"); });
    };
}

function singleTopicController($scope, dataService, $routeParams, $window) {
    $scope.topic = null;
    $scope.newReply = {};

    dataService.getTopicById($routeParams.id).then(function(topic) {
        // Success
        $scope.topic = topic;
    }, function () {
        // Error
        $window.location = "#/";
    });

    $scope.addReply = function() {
        dataService.saveReply($scope.topic, $scope.newReply).then(function() {
            //success
            $scope.newReply.Body = "";
        }, function () {
            // error
            alert("Could not save the reply.");
        });
    };
}