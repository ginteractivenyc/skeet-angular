var skeetApp = angular.module('skeetApp',  [ 'angular-carousel','ngRoute', 'ngResource', 'musicHomeService', 'videoHomeService', 'instagramHomeService', 'merchHomeService', 'newsHomeService']);

skeetApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
    when('/', {
      templateUrl: 'views/home.html',
      controller: 'homeCtrl'
    });
}]);

skeetApp.controller('homeCtrl', function(musicHomeService, videoHomeService, instagramHomeService, merchHomeService,newsHomeService, $scope){
	 // get Music Items
	  musicHomeService.get(function(data) {
	    $scope.homeMusic = data;



});  

	  // get Video Items
  videoHomeService.get(function(data) {
    $scope.homeVideo = data.feed.entry;
    //console.log($scope.homeVideo);
});

//get instagram Items
    // get Video Items
  instagramHomeService.get(function(data) {
    $scope.homeIg = data.data;
});

    // get Merch Items
  merchHomeService.get(function(data) {
    $scope.homeMerch = data;
       // console.log($scope.homeMerch);

    //console.log($scope.homeVideo);
});


    // get News Items
  newsHomeService.get(function(data) {
    $scope.homeNews = data;
    $scope.newsTitle = $scope.homeNews.rss.channel.item;
    console.log($scope.newsTitle)
    $scope.homeNewsImg  = [];
    console.log($scope.homeNews.rss.channel.item)
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
console.log($scope.homeNewsImg)
});

});  

skeetApp.filter('artworkCheck', function () {

    return function (value) {
        return (!value) ? '' : value.replace('-large', '-t500x500');
    };
});

setTimeout(function(){
$('.rn-carousel-controls').each(function(){
  $(this).appendTo($(this).parent().parent());
})
},130)