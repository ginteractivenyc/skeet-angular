var nameHolderMain = [];
var skeetApp = angular.module('skeetApp',  [ 'angular-carousel','ngRoute', 'ngResource', 'parseService']);

skeetApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider. 
    when('/:nameHolder', {
      templateUrl: 'views/parse.html',
      controller: 'homeCtrl'
  }).
    when('/music',{
      templateUrl: 'views/music.html',
      controller:'musicCtrl'
    });
}]);

skeetApp.controller('indexCtrl', function($scope, $location){
  $scope.viewUser = function($event){
    //var nameHolder = angular.element($event.currentTarget).attr('data-user');
    //nameHolderMain.push(nameHolder);
     //$location.path(nameHolder);
  }
}).controller('homeCtrl', function(parseService, $scope, $location, $http, $routeParams){
	 // get Music Items
   nameHolderMain = $routeParams.nameHolder.toString();
   console.log(nameHolderMain.toString())
  var parseServiceGet = function() {

    parseService.get( {where: {username : nameHolderMain}}, function success(data) {

        //$scope.homeMusic = data;
        console.log(data.results[0])
        
        var soundcloudId = data.results[0].soundcloud;
 
      $http({
        method: 'GET',
        url: 'http://api.soundcloud.com/resolve.json?url=http://soundcloud.com/' + soundcloudId + '/tracks&client_id=07b0e9b7e4ac9e8454b61d33eaba766b'
      }).success(function(data) {
        // With the data succesfully returned, call our callback
        console.log(data)
        $scope.homeMusic = data;
      }).error(function() {
        alert("error");
      });


      },
      function err() {
        alert('there was an error')
      });
  }
parseServiceGet();



});
skeetApp.filter('artworkCheck', function () {

    return function (value) {
        return (!value) ? '' : value.replace('-large', '-t500x500');
    };
});
function loadCarousel(){
setTimeout(function(){
$('.rn-carousel-controls').each(function(){
  $(this).appendTo($(this).parent().parent());
})
}, 150);
}