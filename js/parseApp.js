var nameHolderMain = [];
var skeetApp = angular.module('skeetApp',  [ 'angular-carousel','ngRoute', 'ngResource', 'parseService']);

skeetApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
    when('/loggedin',{
      templateUrl: 'views/loggedin.html',
      controller:'loggedinCtrl'
    }). 
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
        //console.log(data.results[0])
        
        var soundcloudId = data.results[0].soundcloud;
        var youtubeId = data.results[0].youtube;
        var instagramId = data.results[0].instagram;

//get music 
      $http({
        method: 'GET',
        url: 'https://api.soundcloud.com/users/' + soundcloudId +'/tracks.json?client_id=07b0e9b7e4ac9e8454b61d33eaba766b'
      }).success(function(data) {
        // With the data succesfully returned, call our callback
        //console.log(data)
        $scope.homeMusic = data;
        getVideos();

      }).error(function() {
        alert("error");
      });
//get videos

var getVideos = function(){
        $http({
        method: 'GET',
        url: 'https://gdata.youtube.com/feeds/api/users/' + youtubeId + '/uploads?v=2&alt=json&orderby=published&max-results=5'
      }).success(function(data) {
        // With the data succesfully returned, call our callback
        console.log(data)
        $scope.homeVideo = data.feed.entry;
      getInstagram();


      }).error(function() {
        //alert("error");
      });
}

var getInstagram = function(){
        $http.jsonp('https://api.instagram.com/v1/users/' + instagramId + '/media/recent?count=5&client_id=7380072fbc2f438994b747e10485357f&callback=JSON_CALLBACK').success(function(data) {
        // With the data succesfully returned, call our callback
        console.log(data)
        $scope.homeIg = data.data;
      }).error(function() {
       // alert("error");
      });    

}



      },
      function err() {
        alert('there was an error')
      });
  }
parseServiceGet();



}).controller('loggedinCtrl', function($scope){
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            }
            
            reader.readAsDataURL(input.files[0]);
        }
    }

    
    $("#imgInp").change(function(){
        readURL(this);
    });

$scope.addMusic = function(){
  $('#addMusicBox').fadeIn();
}

$scope.addVideo = function(){
  $('#addVideoBox').fadeIn();
}

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