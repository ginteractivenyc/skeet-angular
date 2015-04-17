var skeetApp = angular.module('skeetApp',  [ 'angular-carousel','ngRoute', 'ngResource', 'musicHomeService', 'videoHomeService', 'instagramHomeService', 'merchHomeService', 'newsHomeService']);

skeetApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
    when('/', {
      templateUrl: 'views/home.html',
      controller: 'homeCtrl'
    }).
    when('/music',{
      templateUrl: 'views/music.html',
      controller:'musicCtrl'
    });
}]);

skeetApp.controller('homeCtrl', function(musicHomeService, videoHomeService, instagramHomeService, merchHomeService,newsHomeService, $scope, $location){
	 // get Music Items

 
  var musicService = function() {

    musicHomeService.get(function success(data) {
        $scope.homeMusic = data;
        videoService();
      },
      function err() {
        alert('there was an error')
      });
  }




  // get Video Items
  var videoService = function() {
    videoHomeService.get(function success(data) {
        $scope.homeVideo = data.feed.entry;
        igService();

      },
      function err() {
        alert('there was an error')

      });
  }

  //get instagram Items
  var igService = function() {
    instagramHomeService.get(function success(data) {
        $scope.homeIg = data.data;
        merchService();
      },
      function err() {
        alert('there was an error')
      });
  }

  // get Merch Items
  var merchService = function() {

    merchHomeService.get(function success(data) {
      $scope.homeMerch = data;
      newsService();
loadCarousel();

    }, function err() {
      alert('there was an error')

    });

  }


    // get News Items

var newsService = function(){

  newsHomeService.get(function success(data) {
    $scope.homeNews = data;
    $scope.newsTitle = $scope.homeNews.rss.channel.item;
   // console.log($scope.newsTitle)
    $scope.homeNewsImg  = [];
    //console.log($scope.homeNews.rss.channel.item)
       // console.log($scope.homeNews.rss.channel.item[0].encoded.__cdata);
       for (var i = 0; i < $scope.homeNews.rss.channel.item.length; i++){
          var __cdata = $scope.homeNews.rss.channel.item[i].encoded.__cdata;

          var tagIndex = __cdata.indexOf('<img'); // Find where the img tag starts
          var srcIndex = __cdata.substring(tagIndex).indexOf('src=') + tagIndex; // Find where the src attribute starts
          var urlStart = srcIndex + 5; // Find where the actual image URL starts; 5 for the length of 'src="'
          var srcEnd = __cdata.substring(urlStart).indexOf('"') + urlStart; // Find where the URL ends
          var src = __cdata.substring(urlStart, srcEnd); // Extract just the URL

$scope.homeNewsImg.push(src);

}

}, function err(){
alert('error');
});
}



musicService();

$scope.musicClick = function(){
  $location.path('/music')
}

}).controller('musicCtrl', function($scope, musicHomeService){

  var musicService = function() {

    musicHomeService.get(function success(data) {
        $scope.homeMusic = data;
        loadCarousel();

      },
      function err() {
        alert('there was an error')
      });
  }
musicService();
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
