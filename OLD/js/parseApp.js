Parse.initialize("tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z", "F1g9SlNa2FhcneKqj4AdowudvI7zkMXNZUsjtgJm");

SC.initialize({
  client_id: '0f993f2250c9e82a24acc020437d5da9',
  redirect_uri: 'http://localhost:8888/skeet-angular/loginfiles/callback.html'
});


var nameHolderMain = [];
var skeetApp = angular.module('skeetApp',  [ 'angular-carousel','ngRoute', 'ngResource', 'parseService']);

skeetApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
    when('/signup',{
      templateUrl: 'views/signup.html',
      controller:'signupCtrl'
    }).  
    when('/loggedin',{
      templateUrl: 'views/loggedin.html',
      controller:'loggedinCtrl'
    }). 
    when('/:nameHolder', {
      templateUrl: 'views/userpage.html',
      controller: 'homeCtrl'
  }).
    when('/music',{
      templateUrl: 'views/music.html',
      controller:'musicCtrl'
    });

}]);

skeetApp.controller('signupCtrl', function($scope, $window){

$('.globalHeader').hide();
var user = new Parse.User();
var loginSubmit = document.getElementById('loginSubmit');

loginSubmit.addEventListener('click', function(){
var userName = document.getElementById('inputUsername').value;
var userPass = document.getElementById('inputPassword').value;
var userEmail = document.getElementById('inputEmail').value;

user.set("username", userName);
user.set("password", userPass);
user.set("email", userEmail);
user.signUp(null, {
  success: function(user, $location) {
   // alert()// Hooray! Let them use the app now.
   $('#skeetLogin').fadeOut();
 $window.location='#/loggedin';
// initiate auth popup

    return false;
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    alert("Error: " + error.code + " " + error.message);
  }
});

});

}).controller('loggedinCtrl', function($scope){

  $('.dropdown-menu').find('li').click(function (e) {
    e.stopPropagation();
  });
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
        var currentUser = Parse.User.current();

        var sendThis =  $('#blah').attr('src');
       var parseFile = new Parse.File("mypic.jpg", {
            base64: sendThis
        });
        //save soundcloud Name to parse
        currentUser.set("profileimage",parseFile );
        currentUser.save();

            }
            
            reader.readAsDataURL(input.files[0]);
        }
    }

    
    $("#imgInp").change(function(){
        readURL(this);
    });

$scope.addMusic = function($event){
  var thisElement = angular.element(event.currentTarget);
  $('#addMusicBox').fadeIn();
}

$scope.addVideo = function(){
  $('#addVideoBox').fadeIn();
}


$scope.addPhoto = function(){
  $('#addPhotoBox').fadeIn();
}


//soundcloud login

$scope.scLogin = function(){
SC.connect(function(){
      SC.get("/me", function(me){
        var soundcloudName = me.username;
        $("#username").text(soundcloudName);
         console.log(soundcloudName);
        $("#description").val(me.description);
        var currentUser = Parse.User.current();

        //save soundcloud Name to parse
        currentUser.set("soundcloud",soundcloudName );
        currentUser.save();

      });
    });
}


//youtube login

$scope.ytLogin = function() {

login();

function login() 
{

  var myParams = {
    'clientid' : '468337602361-g8r9h81rem7usdpfsbi0l0k3h4p3du51.apps.googleusercontent.com',
    'cookiepolicy' : 'single_host_origin',
    'callback' : 'loginCallback',
    'approvalprompt':'force',
    'scope' : 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
  };
  gapi.auth.signIn(myParams);
}


}


//instagram login


$scope.igLogin = function(){

  var url = "https://api.instagram.com/oauth/authorize/?client_id=7380072fbc2f438994b747e10485357f&redirect_uri=http://localhost:8888/skeet-angular/login.html&response_type=token&callback=retrieveToken"
  location.replace(url)




var retrieveToken = setTimeout(function(){
var myVar = self.location.toString();

if(myVar === "http://localhost:8888/skeet-angular/login.html"){

}else{

console.log(myVar)
var __cdata = myVar;
var tagIndex = __cdata.indexOf('access_token'); // Find where the img tag starts
var srcIndex = __cdata.substring(tagIndex).indexOf('=') + tagIndex; // Find where the src attribute starts
var urlStart = srcIndex + 1; // Find where the actual image URL starts; 5 for the length of 'src="'
var src = __cdata.substring(urlStart); // Extract just the URL
console.log(src)

$.ajax({
  type: "get",
  url: 'https://api.instagram.com/v1/users/self/media/recent?access_token=' + src,
  dataType: 'jsonp',
  success: function(data){
console.log(data.data[0].user.username);
var instagramName = data.data[0].user.id;
            var currentUser = Parse.User.current();

               currentUser.set("instagram", instagramName);
                currentUser.save(); 

  },
  error: function(){

  }
})



}
//alert(src)
}, 2500);





}



}).controller('indexCtrl', function($scope, $location){
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
        $scope.profileImage = data.results[0].profileimage.url;
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
        url: 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=' + youtubeId + '&key=AIzaSyBZGeefjprHm8Zq6DkblpvNV0eQ65l2E84'
      }).success(function(data) {
        // With the data succesfully returned, call our callback
        var userId = data.items[0].contentDetails.relatedPlaylists.uploads
          setTimeout(function() {
            $http({
              method: 'GET',
              url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=' + userId  + '&key=AIzaSyBZGeefjprHm8Zq6DkblpvNV0eQ65l2E84'
            }).success(function(data) {
              // With the data succesfully returned, call our callback

              console.log(data.items)
              $scope.homeVideo = data.items


              getInstagram();


            }).error(function() {
              //alert("error");
            });


          }, 20);
          
       // $scope.homeVideo = data.feed.entry;
      //getInstagram();


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