skeetApp.controller('signupCtrl', function($scope, $routeParams, $window, skeetAppFactory){

$scope.nameHolder = [];

var user = new Parse.User();
var signupSubmit = document.getElementById('signupSubmit');

$scope.submit = function(){
var userName = document.getElementById('inputUsername').value;
var userPass = document.getElementById('inputPassword').value;
var userEmail = document.getElementById('inputEmail').value;
   $scope.nameHolder.push(userName)
nameHolderMain.push(userName)

var skeetUser = {
    username:  $scope.nameHolder.toString(),
    password: userPass,
    email:userEmail
}
//signup user
    skeetAppFactory.storeUser(skeetUser).success(function(success) {
      console.log(success)
      skeetUserId.push(success.objectId)
      $('#skeetLogin').fadeOut();
      $window.location = '#/' + $scope.nameHolder + '/loggedin';
          memcachejs.set("objectid", success.objectId );
          memcachejs.set("sessionToken", success.sessionToken);
    }).error(function(error) {
      console.log(error)
    });

  }

  $scope.login = function() {
    var userName = document.getElementById('loginUsername').value;
    var userPass = document.getElementById('loginPassword').value;
    Parse.User.logIn(userName, userPass, {
      success: function(user) {
        console.log(user);
        skeetUserId.push(user.id)
        $scope.nameHolder.push(userName)

        // alert()// Hooray! Let them use the app now.
        $('#skeetLogin').fadeOut();
        $('#loginModal').modal('hide')
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        $window.location = '#/' + $scope.nameHolder + '/loggedin';

        // initiate auth popup
        // return false;    // Do stuff after successful login.
      },
      error: function(user, error) {
        console.log(error)
          // The login failed. Check error to see why.
      }
    });

  }
}).controller('loggedinCtrl', function($scope, $location, $window, $routeParams, skeetAppFactory){
console.log(nameHolderMain)


function storeSoundCloudUser(){
SC.connect(function(){
      SC.get("/me", function(me){
        $scope.soundcloudName = me.username;
        $("#username").text($scope.soundcloudName);
        $("#description").val(me.description);

        var objectid = memcachejs.get("objectid");
        var sessionToken = memcachejs.get("sessionToken");
        var soundcloudUser = {
          soundcloud: $scope.soundcloudName
        }
        skeetAppFactory.storeSoundcloudUser(objectid, soundcloudUser, sessionToken).success(function(data) {
          console.log(data)
            $('input[name="soundcloud-checkbox"]').bootstrapSwitch('state', 'true');
        }).error(function(error) {
          console.log(error)
        });

      });
    });
}


//switch functions
  function soundcloudSwitchOn(state, onoff) {
    var objectid = memcachejs.get("objectid");
    var sessionToken = memcachejs.get("sessionToken");

    var soundCloudSwitch = {
      soundcloudOn: onoff
    }
    skeetAppFactory.soundcloudSwitchOn(objectid, soundCloudSwitch, sessionToken).success(function(success) {
      console.log("Switch " + success)
      $('input[name="soundcloud-checkbox"]').bootstrapSwitch('state', state);

    }).error(function(error) {
      console.log(error);
    });

  }

  function youtubeSwitchOn(state, onoff) {
    var objectid = memcachejs.get("objectid");
    var sessionToken = memcachejs.get("sessionToken");

    var youTubeSwitch = {
      youtubeOn: onoff
    }
    skeetAppFactory.youtubeSwitchOn(objectid, youTubeSwitch, sessionToken).success(function(success) {
      console.log("Switch " + success)
      $('input[name="youtube-checkbox"]').bootstrapSwitch('state', state);

    }).error(function(error) {
      console.log(error);
    });

  }


    //Switch Check: Soundcloud
     var objectid = memcachejs.get("objectid");

      skeetAppFactory.getSoundcloudUser(objectid).success(function(success) {
        console.log(success);
        var soundcloudOnOff = success.soundcloudOn;
        if (soundcloudOnOff === "on") {
          soundcloudSwitchOn(true, "on");

        } else if (soundcloudOnOff === "off") {
          soundcloudSwitchOn(false, "off");
        }
      }).error(function(error) {
        console.log(error)
      });

    //Switch Check: Youtube

        skeetAppFactory.getYoutubeUser(objectid).success(function(success) {
        console.log(success);
        var youtubeOnOff = success.youtubeOn;
        if (youtubeOnOff === "on") {
          youtubeSwitchOn(true, "on");

        } else if (youtubeOnOff === "off") {
          youtubeSwitchOn(false, "off");
        }
      }).error(function(error) {
        console.log(error)
      }); 



$(".switcher").bootstrapSwitch({
  size: 'mini',
  state: false,
  onColor: 'moduleon'
});

  $('.dropdown-menu').find('li').click(function (e) {
    e.stopPropagation();
  });

    
    $('#imgInp').bind("change", function(e) {
      var files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      file = files[0];


          skeetAppFactory.storeProfileImage(file).success(function(success){
            console.log(success)
              $('#profilePlaceholder').attr('src', success.url);
                //store file in user class

                var profileImage = {
                  profileimage: success.url
                }
    var objectid = memcachejs.get("objectid");
    var sessionToken = memcachejs.get("sessionToken");
                skeetAppFactory.assignProfileImage(objectid, profileImage, sessionToken).success(function(success){
                  console.log(success);
                }).error(function(){

                });




          }).error(function(error){
            console.log(error)
          });
    });

//soundcloud login

$scope.scLogin = function(){
storeSoundCloudUser();
}

$scope.ytLogin = function(){
  gapi.auth.authorize({
        client_id: OAUTH2_CLIENT_ID,
        scope: OAUTH2_SCOPES,
        immediate: false
        }, handleAuthResult);
}



  //toggle soundcloud switch
  $('input[name="soundcloud-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
        var objectid = memcachejs.get("objectid");
        var sessionToken = memcachejs.get("sessionToken");   
    if (state === false) {
         soundcloudSwitchOn(false, "off");

    }

    if (state === true) {

      skeetAppFactory.getSoundcloudUser(objectid).success(function(success) {
        console.log(success);
        var soundcloudName = success.soundcloud;
        if (soundcloudName === undefined) {
          storeSoundcloudUser();
        } else if (soundcloudName.length >= 1) {
          soundcloudSwitchOn(true, "on");
        }
      }).error(function(error) {
        console.log(error)
      });

      }

  });


  //toggle youtube switch
  $('input[name="youtube-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
        var objectid = memcachejs.get("objectid");
        var sessionToken = memcachejs.get("sessionToken");   
    if (state === false) {
         youtubeSwitchOn(false, "off");

    }

    if (state === true) {

      skeetAppFactory.getYoutubeUser(objectid).success(function(success) {
        console.log(success);
        var youtubeName = success.youtube;
        if (youtubeName === undefined) {
          storeYouTubeUser();
        } else if (youtubeName.length >= 1) {
          youtubeSwitchOn(true, "on");
        }
      }).error(function(error) {
        console.log(error)
      });

      }

  });





$scope.twLogin = function(){
    $('#twModal').modal('toggle');
}

var twitterUser = $('#twitterInput').val();

$scope.twSubmit = function(){
skeetAppFactory.storeTwitterUser(twitterUser).success(function(success){
console.log('success')
}).error(function(error){
console.log(error)
});


}


}).controller('indexCtrl', function($scope, $location){
  $scope.viewUser = function($event){
    //var nameHolder = angular.element($event.currentTarget).attr('data-user');
    //nameHolderMain.push(nameHolder);
     //$location.path(nameHolder);
  }


}).controller('userViewCtrl', function( $scope, $location, $http, $routeParams, skeetAppFactory){
   // get Music Items
   console.log(nameHolderMain.toString())
  var parseServiceGet = function() {

      skeetAppFactory.getParseUser({
        where: {
          username: $routeParams.nameHolder
        }
      }).success(function(success) {

       //$scope.homeMusic = data;
        console.log(success.results[0])
        var soundcloudId = success.results[0].soundcloud;
         var soundcloudOn = success.results[0].soundcloudOn;
       
        var youtubeId = success.results[0].youtube;
         var youtubeOn = success.results[0].youtubeOn;
        var instagramId = success.results[0].instagram;       
        var twittername = success.results[0].twittername;       
     
        if (success.results[0].profileimage === undefined){
          $scope.profileImage = 'http://placehold.it/640x360'
        } else{
           $scope.profileImage = success.results[0].profileimage;
        }


      if (twittername === undefined) {

      } else {

        twttr.widgets.load();

        twttr.widgets.createTimeline('253171957271498752',
          document.getElementById('timeline'), {
            width: '450',
            height: '700',
            screenName: twittername
          }).then(function(el) {
          console.log("Embedded a timeline.")
        });


      }

//get music 
if (soundcloudOn === "on"){

      $http({
        method: 'GET',
        url: 'https://api.soundcloud.com/users/' + soundcloudId +'/tracks.json?client_id=07b0e9b7e4ac9e8454b61d33eaba766b'
      }).success(function(data) {
        // With the data succesfully returned, call our callback
        //console.log(data)
        $scope.homeMusic = data;


      }).error(function() {
        alert("error");
      });
    }
      //get videos
      if (youtubeOn === "on") {
        $http({
          method: 'GET',
          url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=' + youtubeId.toString() + '&key=AIzaSyBZGeefjprHm8Zq6DkblpvNV0eQ65l2E84'
        }).success(function(data) {
          // With the data succesfully returned, call our callback
          $scope.homeVideo = data.items;
          getInstagram();
          $('.rn-carousel-controls').each(function(){
              $(this).insertAfter($(this).parent('ul.carouselholder'));
          });

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

      }).error(function(error){
          console.log(error)
      });
  };

          $scope.trackOpen  = function($event){
          var trackId = angular.element(event.currentTarget).attr('data-url');
                $location.path( $routeParams.nameHolder + '/music/track/' + trackId );

          
        }
   parseServiceGet();

}).controller('tracksCtrl', function($scope, $routeParams, $sce, skeetAppFactory, $http, $location) {
  $scope.tracksiframe = "true"
  var baseUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + $routeParams.musicItem + '&auto_play=true';
  $('.skeetOuterWrapper').addClass('playing');

  $scope.musicTrack = $sce.trustAsResourceUrl(baseUrl);
      skeetAppFactory.getParseUser({
        where: {
          username: $routeParams.nameHolder
        }
      }).success(function(success) {
        console.log(success)
        var soundcloudId = success.results[0].soundcloud;

        //$('#' + yourcookie).hide();
        /*var baseUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + $routeParams.musicItem + '&auto_play=true';
        $scope.musicTrack = $sce.trustAsResourceUrl(baseUrl);
          $scope.tracksiframe = 'true';*/

        $http({
          method: 'GET',
          url: 'https://api.soundcloud.com/users/' + soundcloudId + '/tracks.json?client_id=07b0e9b7e4ac9e8454b61d33eaba766b'
        }).success(function(data) {
          // With the data succesfully returned, call our callback
          //console.log(data)
          $scope.musicTracks = data;

        }).error(function() {
          alert("error");
        });

        $http({
          method: 'GET',
          url: 'https://api.soundcloud.com/users/' + soundcloudId + '/playlists.json?client_id=07b0e9b7e4ac9e8454b61d33eaba766b'
        }).success(function(data) {
          // With the data succesfully returned, call our callback
          //console.log(data)
          $scope.musicPlaylists = data;
          $('.rn-carousel-controls').each(function(){
              $(this).insertAfter($(this).parent('ul.carouselholder'));
          });
        }).error(function() {
          alert("error");
        });

        $scope.playlistPlay = function($event){
          var playlistId = angular.element(event.currentTarget).attr('data-url');
                $location.path( $routeParams.nameHolder + '/music/playlist/' + playlistId, false );
                 $scope.tracksiframe = "false"
                  $scope.playlistsiframe = "true" 
            var baseUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/' + playlistId + '&auto_play=true';

        $scope.musicPlaylist = $sce.trustAsResourceUrl(baseUrl);      
        }


        $scope.trackPlay = function($event){
          var trackId = angular.element(event.currentTarget).attr('data-url');
                $location.path( $routeParams.nameHolder + '/music/track/' + trackId, false );
                 $scope.tracksiframe = "true"
                  $scope.playlistsiframe = "false" 
            var baseUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + trackId + '&auto_play=true';

        $scope.musicTrack = $sce.trustAsResourceUrl(baseUrl);      
        }




      }).error(function(error) {

      });

}).controller('playlistsCtrl', function($scope, $routeParams, $sce, skeetAppFactory, $http, $location) {
  $scope.tracksiframe = "false"
    $scope.playlistsiframe = "true"
  $('.skeetOuterWrapper').addClass('playing');

  var baseUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/' + $routeParams.musicItem + '&auto_play=true';

  $scope.musicPlaylist = $sce.trustAsResourceUrl(baseUrl);
      skeetAppFactory.getParseUser({
        where: {
          username: $routeParams.nameHolder
        }
      }).success(function(success) {
        console.log(success)
        var soundcloudId = success.results[0].soundcloud;

        //$('#' + yourcookie).hide();
        /*var baseUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + $routeParams.musicItem + '&auto_play=true';
        $scope.musicTrack = $sce.trustAsResourceUrl(baseUrl);
          $scope.tracksiframe = 'true';*/

        $http({
          method: 'GET',
          url: 'https://api.soundcloud.com/users/' + soundcloudId + '/tracks.json?client_id=07b0e9b7e4ac9e8454b61d33eaba766b'
        }).success(function(data) {
          // With the data succesfully returned, call our callback
          //console.log(data)
          $scope.musicTracks = data;

        }).error(function() {
          alert("error");
        });

        $http({
          method: 'GET',
          url: 'https://api.soundcloud.com/users/' + soundcloudId + '/playlists.json?client_id=07b0e9b7e4ac9e8454b61d33eaba766b'
        }).success(function(data) {
          // With the data succesfully returned, call our callback
          //console.log(data)
          $scope.musicPlaylists = data;

        }).error(function() {
          alert("error");
        });

        $scope.playlistPlay = function($event){
          var playlistId = angular.element(event.currentTarget).attr('data-url');
                $location.path( $routeParams.nameHolder + '/music/playlist/' + playlistId, false );
                 $scope.tracksiframe = "false"
                  $scope.playlistsiframe = "true" 
            var baseUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/' + playlistId + '&auto_play=true';

        $scope.musicPlaylist = $sce.trustAsResourceUrl(baseUrl);      
        }


        $scope.trackPlay = function($event){
          var trackId = angular.element(event.currentTarget).attr('data-url');
                $location.path( $routeParams.nameHolder + '/music/track/' + trackId, false );
                 $scope.tracksiframe = "true"
                  $scope.playlistsiframe = "false" 
            var baseUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + trackId + '&auto_play=true';

        $scope.musicTrack = $sce.trustAsResourceUrl(baseUrl);      
        }


      }).error(function(error) {

      });

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







var OAUTH2_CLIENT_ID = '8348234210-udub6k1o1l1aa0od6h7hgm5ehifcs51f.apps.googleusercontent.com';
var OAUTH2_SCOPES = [
  'https://www.googleapis.com/auth/youtube'
];

// Upon loading, the Google APIs JS client automatically invokes this callback.
googleApiClientReady = function() {
  gapi.auth.init();
}





// Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
// If the currently logged-in Google Account has previously authorized
// the client specified as the OAUTH2_CLIENT_ID, then the authorization
// succeeds with no user intervention. Otherwise, it fails and the
// user interface that prompts for authorization needs to display.

// Handle the result of a gapi.auth.authorize() call.
function handleAuthResult(authResult) {
console.log(authResult)
loadAPIClientInterfaces()
    // Make the #login-link clickable. Attempt a non-immediate OAuth 2.0
    // client flow. The current function is called when that flow completes.

}

// Load the client interfaces for the YouTube Analytics and Data APIs, which
// are required to use the Google APIs JS client. More info is available at
// http://code.google.com/p/google-api-javascript-client/wiki/GettingStarted#Loading_the_Client
function loadAPIClientInterfaces() {
  gapi.client.load('youtube', 'v3', function() {
    handleAPILoaded();
  });
}


// After the API loads, call a function to get the uploads playlist ID.
function handleAPILoaded() {
  requestUserUploadsPlaylistId();
}

// Call the Data API to retrieve the playlist ID that uniquely identifies the
// list of videos uploaded to the currently authenticated user's channel.
function requestUserUploadsPlaylistId() {
  // See https://developers.google.com/youtube/v3/docs/channels/list
  var request = gapi.client.youtube.channels.list({
    mine: true,
    part: 'contentDetails'
  });
  request.execute(function(response) {
    console.log(response.items[0].contentDetails.relatedPlaylists.uploads)
    var youtubeid = response.items[0].contentDetails.relatedPlaylists.uploads;

      var objectid =memcachejs.get("objectid");
      var sessionToken =memcachejs.get("sessionToken");

      var youtubeUser = {
        youtube: youtubeid
      }

    var urlBase = 'https://api.parse.com';
              
              $.ajax({
                type: 'PUT',
                url: urlBase + '/1/users/' + objectid,
                data: JSON.stringify(youtubeUser),
                headers: {
                  'X-Parse-Application-Id': 'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z',
                  'X-Parse-REST-API-Key': 'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ',
                  "Content-Type": "application/json",
                  "X-Parse-Session-Token": sessionToken
                },
                success: function(resultData) {
                        console.log(resultData)
                    $('input[name="youtube-checkbox"]').bootstrapSwitch('state', 'true');   
                }
              });





  });
}


