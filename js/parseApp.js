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
    }).  
    when('/:nameHolder/loggedin',{
      templateUrl: 'views/loggedin.html',
      controller:'loggedinCtrl'
    }). 
    when('/:nameHolder', {
      templateUrl: 'views/userpage.html',
      controller: 'userViewCtrl'
  }).when('/:nameHolder/music/track/:musicItem',{
      templateUrl: 'views/musicpage.html',
      controller:'tracksCtrl'
    }).when('/:nameHolder/music/playlist/:musicItem',{
      templateUrl: 'views/musicpage.html',
      controller:'playlistsCtrl'
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





