Parse.initialize("tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z", "F1g9SlNa2FhcneKqj4AdowudvI7zkMXNZUsjtgJm");

//set up soundlouud credentials
SC.initialize({
  client_id: '0f993f2250c9e82a24acc020437d5da9',
  redirect_uri: 'http://localhost:8888/skeet-angular/loginfiles/callback.html'
});




var nameHolderMain = [];
var skeetUserId = [];
var skeetApp = angular.module('skeetApp',  [ 'angular-carousel','ngRoute', 'ngResource']);

skeetApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/',{
      templateUrl: 'views/signup.html',
      controller:'signupCtrl'
    }).when('/discovery',{
      templateUrl: 'views/discovery.html',
      controller:'discoveryCtrl'      
    }).when('/:nameHolder/loggedin',{
      templateUrl: 'views/loggedin.html',
      controller:'loggedinCtrl'
    }).when('/:nameHolder', {
      templateUrl: 'views/userpage.html',
      controller: 'userViewCtrl'
    }).when('/:nameHolder/music/track/:musicItem',{
      templateUrl: 'views/musicpage.html',
      controller:'tracksCtrl'
    }).when('/:nameHolder/music/playlist/:musicItem',{
      templateUrl: 'views/musicpage.html',
      controller:'playlistsCtrl'
    }).when('/:nameHolder/video/:videoItem',{
      templateUrl: 'views/videopage.html',
      controller:'videoCtrl'      
    }).when('/:nameHolder/followers', {
      templateUrl: 'views/followers.html',
      controller: 'followersCtrl'
    });
}]);


skeetApp.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}])



//go Home
skeetApp.directive('goHome', ['$location', '$routeParams',  function(location,  $routeParams){
       return {
        
            link: function($scope, $elm) {
                $scope.$location = location;
                 $elm.on('click', function() {
                      // soundManager.stopAll();

                  $scope.$apply(function(){
                      location.path('/' + $routeParams.nameHolder );

                  })
                  });
               }
             }
}]);



//go Followers
//go Home
skeetApp.directive('goFollowers', ['$location',  function(location){
       return {
        
            link: function($scope, $elm) {
                $scope.$location = location;
                 $elm.on('click', function() {
                     var viewFollowersOf = $('#loggedUser').text().toString();
                  $scope.$apply(function(){
                      location.path('/' + viewFollowersOf + '/followers' );

                  })
                  });
               }
             }
}]);

skeetApp.directive('followBtn', ['$compile', 'skeetAppFactory',  function($compile, skeetAppFactory){
    return {
      link: function($scope, $elm){
        $elm.on('click', function(){

              var objectid = localStorage.getItem("objectid");
              var sessionToken = localStorage.getItem("sessionToken");
              var userToFollow = $('#loggedUser').text().toString();
              var follower = localStorage.getItem("skeetUser");
              var getFollowImage =   localStorage.getItem("profileimage");
              if (follower){

              var followUser = {
                artist: userToFollow,
                follower: follower,
                profileimage: getFollowImage
              }

           skeetAppFactory.storeFollower(followUser, sessionToken).success(function(success){
            console.log(success);

           }).error(function(error){

           });
         } else{
          alert("YOU NEED TO LOG IN DUN!")
         }
        });
      }
    }
}])


//go discovery
skeetApp.directive('goDiscovery', ['$location',  function(location){
       return {
        
            link: function($scope, $elm) {
                $scope.$location = location;
                 $elm.on('click', function() {
                  $scope.$apply(function(){
                      location.path('/discovery');

                  })
                  });
               }
             }
}]);



skeetApp.directive('soundcloudItems', ['$http', function($http) {
  return {
    restrict: 'E',
    scope: {
      // creates a scope variable in your directive
      // called `locations` bound to whatever was passed
      // in via the `locations` attribute in the DOM
      soundcloudname: '='
    },    
    template: '<ul rn-carousel rn-carousel-controls  rn-carousel-duration="300" class="image carouselholder"> <li ng-repeat="data in homeMusicItems" class="square" data-url="{{data.id}}" ng-click="trackOpen()"><div class="squareThumb"><img ng-src="{{data.artwork_url | artworkCheck}}"></div><div class="itemTitle">{{data.title}}</div></li></ul>',

    link: function(scope, element, attrs) {

       var soundcloudId = scope.$parent.music.sourceid

      $http({
        method: 'GET',
        url: 'https://api.soundcloud.com/users/' + soundcloudId +'/tracks.json?client_id=0f993f2250c9e82a24acc020437d5da9'
      }).success(function(data) {
        // With the data succesfully returned, call our callback

        scope.homeMusicItems = data;


      }).error(function() {
        alert("error");
      });      
          // do something
      
    
    }
  };
}]);

/*skeetApp.directive("soundcloudItems", function () {
        return {
            restrict: 'EA',
            scope: false,
            template: '<ul rn-carousel rn-carousel-controls  rn-carousel-duration="300" class="image carouselholder"> <li ng-repeat="data in homeMusicItems" class="square" data-url="{{data.id}}" ng-click="trackOpen()"><div class="squareThumb"><img ng-src="{{data.artwork_url | artworkCheck}}"></div><div class="itemTitle">{{data.title}}</div></li></ul>'
              
        };
    });

/*
skeetApp.directive('soundCloud', function() {
    return {
        restrict: 'E',
        link: function(scope, elm, attrs) {
            scope.$on('handleBroadcast', function() {
                scope.homeMusic = [];
            });                     
        }
    };
});




skeetApp.directive('soundCloudItems', function() {
    return {
        restrict: 'E',
        link: function(scope, elm, attrs) {
            scope.$on('handleBroadcastItems', function() {
                scope.homeMusicItems = [];
            });                     
        }
    };
});*/
