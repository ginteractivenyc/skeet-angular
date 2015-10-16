skeetApp.controller('signupCtrl', function($scope, $routeParams, $window, skeetAppFactory){

angular.element('.globalHeader').hide();

$scope.nameHolder = [];

var user = new Parse.User();
var signupSubmit = document.getElementById('signupSubmit');

$scope.submit = function(){
var userName = document.getElementById('inputUsername').value.toLowerCase();
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
          localStorage.setItem("objectid", success.objectId );
          localStorage.setItem("sessionToken", success.sessionToken);   
          localStorage.setItem("skeetUser", userName);        
            skeetUserId.push(success.objectId)
      $('#skeetLogin').fadeOut();

      $window.location = '#/' + $scope.nameHolder + '/home';

    }).error(function(error) {
      console.log(error)
    });

  }

  $scope.login = function() {
   /* var userName = document.getElementById('loginUsername').value;
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
        $window.location = '#/' + $scope.nameHolder + '/home';

        // initiate auth popup
        // return false;    // Do stuff after successful login.
      },
      error: function(user, error) {
        console.log(error)
          // The login failed. Check error to see why.
      }
    });*/
   var userName = document.getElementById('loginUsername').value.toLowerCase();
    var userPass = document.getElementById('loginPassword').value;
    console.log(userName + userPass)

    var skeetUser = {
    username:  userName,
    password: userPass
}
//signup user
    skeetAppFactory.loginParseUser(skeetUser).success(function(success) {
      console.log(success)
      angular.element('#followBtn').attr('data-profileimage', success.profileimage);
      skeetUserId.push(success.objectId)
          localStorage.setItem("objectid", success.objectId );
          localStorage.setItem("sessionToken", success.sessionToken); 
          localStorage.setItem("skeetUser", userName); 
          localStorage.setItem("profileimage", success.profileimage);       
        $('#skeetLogin').fadeOut();
        $('#loginModal').modal('hide')
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
      $window.location = '#/' + userName + '/home';

    }).error(function(error) {
      console.log(error)
    });



  }
}).controller('loggedInCtrl', function($scope, $location, $window, $routeParams, skeetAppFactory){


    var objectid = localStorage.getItem("objectid");

      skeetAppFactory.getIGUser(objectid).success(function(success) {
        console.log(success);
        $scope.loggedIn = success;
      }).error(function(error) {
        console.log(error)
      });


}).controller('userHomeCtrl', function($scope, $location, $window, $routeParams, skeetAppFactory){
  angular.element('.globalHeader').show();
          $('#loggedUser').html($routeParams.nameHolder);

//first check for IG name
    var objectid = localStorage.getItem("objectid");

      skeetAppFactory.getIGUser(objectid).success(function(success) {
        console.log(success);
        var instagramOn = success.instagramOn;
        if (instagramOn === "off") {
           instagramSwitchOn(false, "off");       
        } else if (instagramOn === "on") {
          instagramSwitchOn(true, "on");
        }
      }).error(function(error) {
        console.log(error)
      });

//get Followers

    var getFollowFrom = $('#loggedUser').text().toString();

    skeetAppFactory.getFollower({
      where: {
        artist: getFollowFrom
      }
    }).success(function(success) {

     
      for(var i = 0; i < success.results.length; i++){
         console.log(success.results[i])
      if (success.results[i].follower === localStorage.getItem("skeetUser")){
       
        angular.element('#followBtn').addClass('followed');
        angular.element('#followBtn').html("followed");
        angular.element('#followBtn').unbind();

      }
    }
      var followCount = success.results.length;
      angular.element('#followcount').html(followCount);
    }).error(function(error) {

    });
function storeSoundCloudUser(){
SC.connect(function(){
      SC.get("/me", function(me){
        $scope.soundcloudName = me.username;
        $("#username").text($scope.soundcloudName);
        $("#description").val(me.description);

        var objectid = localStorage.getItem("objectid");
        var sessionToken = localStorage.getItem("sessionToken");
        var soundcloudUser = {
          soundcloud: $scope.soundcloudName
        }
        skeetAppFactory.storeSoundcloudUser(objectid, soundcloudUser, sessionToken).success(function(data) {
          console.log(data)
            $('input[name="soundcloud-checkbox"]').bootstrapSwitch('state', 'true');
            soundcloudSwitchOn(true, "on");


        }).error(function(error) {
          console.log(error)
        });

      });
    });
}

function storeYouTubeUser(){
    gapi.auth.authorize({
        client_id: OAUTH2_CLIENT_ID,
        scope: OAUTH2_SCOPES,
        immediate: false
        }, handleAuthResult);
}




function storeInstagramUser(){
$window.open('https://instagram.com/oauth/authorize/?client_id=7380072fbc2f438994b747e10485357f&redirect_uri=http://localhost:8888/skeet-angular/igredirect.html&response_type=token');
}

//switch functions
  function soundcloudSwitchOn(state, onoff) {
    var objectid = localStorage.getItem("objectid");
    var sessionToken = localStorage.getItem("sessionToken");

    var soundCloudSwitch = {
      soundcloudOn: onoff
    }
    skeetAppFactory.soundcloudSwitchOn(objectid, soundCloudSwitch, sessionToken).success(function(success) {
      console.log("Switch " + success)
      $('.soundcloudSwitch').find('.bootstrap-switch').fadeIn(350)

      $('input[name="soundcloud-checkbox"]').bootstrapSwitch('state', state);

    }).error(function(error) {
      console.log(error);
    });

  }

  function youtubeSwitchOn(state, onoff) {
    var objectid = localStorage.getItem("objectid");
    var sessionToken = localStorage.getItem("sessionToken");

    var youTubeSwitch = {
      youtubeOn: onoff
    }
    skeetAppFactory.youtubeSwitchOn(objectid, youTubeSwitch, sessionToken).success(function(success) {
      console.log("Switch " + success)
      $('.youtubeSwitch').find('.bootstrap-switch').fadeIn(350)
      $('input[name="youtube-checkbox"]').bootstrapSwitch('state', state);

    }).error(function(error) {
      console.log(error);
    });

  }

  function instagramSwitchOn(state, onoff) {
    var objectid = localStorage.getItem("objectid");
    var sessionToken = localStorage.getItem("sessionToken");

    var instagramSwitch = {
      instagramOn: onoff
    }
    skeetAppFactory.instagramSwitchOn(objectid, instagramSwitch, sessionToken).success(function(success) {
      console.log("Switch " + success)

      $('.instagramSwitch').find('.bootstrap-switch').fadeIn(350)

      $('input[name="instagram-checkbox"]').show().bootstrapSwitch('state', state);

    }).error(function(error) {
      console.log(error);
    });

  }




    //Switch Check: Soundcloud
     var objectid = localStorage.getItem("objectid");

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
    var objectid = localStorage.getItem("objectid");
    var sessionToken = localStorage.getItem("sessionToken");
                skeetAppFactory.assignProfileImage(objectid, profileImage, sessionToken).success(function(success){
                  console.log(success);
                }).error(function(){

                });




          }).error(function(error){
            console.log(error)
          });
    });


//ig login
$scope.igLogin = function(){
$window.open('https://instagram.com/oauth/authorize/?client_id=7380072fbc2f438994b747e10485357f&redirect_uri=http://localhost:8888/skeet-angular/igredirect.html&response_type=token');
}

//soundcloud login

$scope.scLogin = function(){
storeSoundCloudUser();
}

//yt login
$scope.ytLogin = function(){
  gapi.auth.authorize({
        client_id: OAUTH2_CLIENT_ID,
        scope: OAUTH2_SCOPES,
        immediate: false
        }, handleAuthResult);
}



  //toggle soundcloud switch
  $('input[name="soundcloud-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
        var objectid = localStorage.getItem("objectid");
        var sessionToken = localStorage.getItem("sessionToken");   
    if (state === false) {
         soundcloudSwitchOn(false, "off");

    }

    if (state === true) {

      skeetAppFactory.getSoundcloudUser(objectid).success(function(success) {
        console.log(success);
        var soundcloudName = success.soundcloud;
       
        if (soundcloudName.length >= 1) {
          soundcloudSwitchOn(true, "on");
        }
      }).error(function(error) {
        console.log(error)
      });

      }

  });


  //toggle youtube switch
  $('input[name="youtube-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
        var objectid = localStorage.getItem("objectid");
        var sessionToken = localStorage.getItem("sessionToken");   
    if (state === false) {
         youtubeSwitchOn(false, "off");
       
    }

    if (state === true) {
     
      skeetAppFactory.getYoutubeUser(objectid).success(function(success) {
        console.log(success);
        var youtubeName = success.youtube;
         if (youtubeName.length >= 1) {
          youtubeSwitchOn(true, "on");
        }
      }).error(function(error) {
        console.log(error)
      });

      }

  });



  //toggle instagram switch
  $('input[name="instagram-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
        var objectid = localStorage.getItem("objectid");
        var sessionToken = localStorage.getItem("sessionToken");   
    if (state === false) {
         instagramSwitchOn(false, "off");

    }

    if (state === true) {


      skeetAppFactory.getIGUser(objectid).success(function(success) {
        console.log(success);
        var instagramName = success.instagram;
        if (instagramName.length >= 1) {
          instagramSwitchOn(true, "on");
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
   angular.element('.globalHeader, #discoverynav').show();
  $('#loggedUser').html($routeParams.nameHolder);
angular.element('.followersCount, .discoveryglyph').show();
angular.element('#followBtn').show();
angular.element('#followBtn').removeClass('followed');

  
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
         var instagramOn = success.results[0].instagramOn;


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
        url: 'https://api.soundcloud.com/users/' + soundcloudId +'/tracks.json?client_id=0f993f2250c9e82a24acc020437d5da9'
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
          console.log(data)
          // With the data succesfully returned, call our callback
          $scope.homeVideo = data.items;
         //getInstagram();
          $('.rn-carousel-controls').each(function(){
              $(this).insertAfter($(this).parent('ul.carouselholder'));
          });

        }).error(function() {
          //alert("error");
        });

      }

      if (instagramOn === "on") {

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
  
//get Followers

    var getFollowFrom = $('#loggedUser').text().toString();

    skeetAppFactory.getFollower({
      where: {
        artist: getFollowFrom
      }
    }).success(function(success) {

     
      for(var i = 0; i < success.results.length; i++){
         console.log(success.results[i])
      if (success.results[i].follower === localStorage.getItem("skeetUser")){
       
        angular.element('#followBtn').addClass('followed');
        angular.element('#followBtn').html("followed");
        angular.element('#followBtn').unbind();

      }
    }
      var followCount = success.results.length;
      angular.element('#followcount').html(followCount);
    }).error(function(error) {

    });



  };


  $scope.trackOpen = function($event) {
    var trackId = angular.element(event.currentTarget).attr('data-url');
    $location.path($routeParams.nameHolder + '/music/track/' + trackId);
  }

  $scope.videoOpen = function($event) {
    var videoId = angular.element(event.currentTarget).attr('data-url');
    $location.path($routeParams.nameHolder + '/video/' + videoId);
  }


   parseServiceGet();

}).controller('tracksCtrl', function($scope, $routeParams, $sce, skeetAppFactory, $http, $location) {

            $scope.tracksiframe = "true";
            $scope.playlistsiframe = "false";
              $scope.pausebutton = "true";
             $scope.stopSound = function($event) {
              $scope.resumebutton = "false";
              $scope.pausebutton = "false";
              soundManager.stopAll();
            }
            $scope.pauseSound = function($event) {

              soundManager.pauseAll();
              $scope.resumebutton = "true";
              $scope.pausebutton = "false";
            }
            $scope.resumeSound = function($event) {
              soundManager.resumeAll();
              $scope.resumebutton = "false";
              $scope.pausebutton = "true";
            }


//load playlist tracks

        $http({
          method: 'GET',
          url: 'https://api.soundcloud.com/tracks/' + $routeParams.musicItem  + '.json?client_id=0f993f2250c9e82a24acc020437d5da9'
        }).success(function(data) {
          console.log(data)
          var artworkurl = data.artwork_url;
          $scope.artworkUrl =  artworkurl.replace('large', 't300x300');
          $scope.artistName = data.user.username;
          $scope.trackTitle = data.title;

          
          $scope.playlistTracks = data.tracks;         
           $scope.firstTrack = data.id;
          $scope.waveForm = data.waveform_url;


          SC.get("/tracks/" + $scope.firstTrack, function(track){
            var waveform = new Waveform({
              container: document.getElementById("trackwave"),
              innerColor: "#333"
            });

            waveform.dataFromSoundCloudTrack(track);
            var streamOptions = waveform.optionsForSyncedStream();

            SC.stream(track.uri, streamOptions, function(stream){
              window.exampleStream = stream;
                window.exampleStream.play();


            });
        });



            // play playlist track
            $scope.playTrack = function($event){
                 angular.element(event.currentTarget).siblings().removeClass('activeTrack');
                 angular.element(event.currentTarget).addClass('activeTrack');              
              $scope.resumebutton = "false";
              $scope.pausebutton = "true";
              document.getElementById("playlistwave").innerHTML = "";
              $scope.playlisttrack = angular.element(event.currentTarget).attr('data-url');
              soundManager.stopAll()

          SC.get("/tracks/" + $scope.playlisttrack, function(track){
            var waveform = new Waveform({
              container: document.getElementById("playlistwave"),
              innerColor: "#333"
            });

            waveform.dataFromSoundCloudTrack(track);
            var streamOptions = waveform.optionsForSyncedStream();
            
            SC.stream(track.uri, streamOptions, function(stream){
              window.exampleStream = stream;
                window.exampleStream.play()
                
          
              }); 
              });             
            }


        }).error(function() {
          alert("error");
        });




  $('.skeetOuterWrapper').addClass('playing');
  $('.marginOne').addClass('marginTwo');


      skeetAppFactory.getParseUser({
        where: {
          username: $routeParams.nameHolder
        }
      }).success(function(success) {
        console.log(success)
        var soundcloudId = success.results[0].soundcloud;



        $http({
          method: 'GET',
          url: 'https://api.soundcloud.com/users/' + soundcloudId + '/tracks.json?client_id=0f993f2250c9e82a24acc020437d5da9'
        }).success(function(data) {
          // With the data succesfully returned, call our callback
          //console.log(data)
          $scope.musicTracks = data;

        }).error(function() {
          alert("error");
        });

        $http({
          method: 'GET',
          url: 'https://api.soundcloud.com/users/' + soundcloudId + '/playlists.json?client_id=0f993f2250c9e82a24acc020437d5da9'
        }).success(function(data) {
          // With the data succesfully returned, call our callback
          //console.log(data)
          $scope.musicPlaylists = data;

        }).error(function() {
          alert("error");
        });

                // play a playlist item from tracks row
            $scope.playlistPlay = function($event) {
                  soundManager.stopAll();
                  $scope.resumebutton = "false";
                  $scope.pausebutton = "true";
                          
              document.getElementById('playlistwave').innerHTML = '';
             
              var playlistId = angular.element(event.currentTarget).attr('data-url');
              $location.path($routeParams.nameHolder + '/music/playlist/' + playlistId, false);
              $scope.tracksiframe = "false";
              $scope.playlistsiframe = "true";

              $http({
                method: 'GET',
                url: 'https://api.soundcloud.com/playlists/' + playlistId + '.json?client_id=0f993f2250c9e82a24acc020437d5da9'
              }).success(function(data) {
                console.log(data)
                var artworkurl = data.artwork_url;
                $scope.artworkUrl = artworkurl.replace('large', 't300x300');
                $scope.artistName = data.user.username;
                $scope.trackTitle = data.title;

                $scope.playlistTracks = data.tracks;
                $scope.firstTrack = data.tracks[0].id;
                $scope.waveForm = data.tracks[0].waveform_url;

          SC.get("/tracks/" + $scope.firstTrack, function(track){
            var waveform = new Waveform({
              container: document.getElementById("playlistwave"),
              innerColor: "#333"
            });

            waveform.dataFromSoundCloudTrack(track);
            var streamOptions = waveform.optionsForSyncedStream();
            SC.stream(track.uri, streamOptions, function(stream){
              window.exampleStream = stream;
                  window.exampleStream.play()

                  setTimeout(function() {
                    $('.trackList li:first-child').addClass('activeTrack');
              $scope.resumeSound = function($event) {

                window.exampleStream.resume();
                $scope.resumebutton = "false";
                $scope.pausebutton = "true";
              }
                  }, 20)


                });
            });


              }).error(function() {
                alert("error");
              });
            }





            // plays track from TRACKS row
            $scope.trackPlay = function($event) {
                  soundManager.stopAll();
                  $scope.resumebutton = "false";
                  $scope.pausebutton = "true";
                          
              document.getElementById('trackwave').innerHTML = '';
             
              var trackId = angular.element(event.currentTarget).attr('data-url');
              $location.path($routeParams.nameHolder + '/music/track/' + trackId, false);
              $scope.tracksiframe = "true";
              $scope.playlistsiframe = "false";

              $http({
                method: 'GET',
                url: 'https://api.soundcloud.com/tracks/' + trackId + '.json?client_id=0f993f2250c9e82a24acc020437d5da9'
              }).success(function(data) {
                console.log(data)
                var artworkurl = data.artwork_url;
                $scope.artworkUrl = artworkurl.replace('large', 't300x300');
                $scope.artistName = data.user.username;
                $scope.trackTitle = data.title;

                $scope.playlistTracks = data;
                $scope.firstTrack = data.id;
                $scope.waveForm = data.waveform_url;

          SC.get("/tracks/" + $scope.firstTrack, function(track){
            var waveform = new Waveform({
              container: document.getElementById("trackwave"),
              innerColor: "#333"
            });

            waveform.dataFromSoundCloudTrack(track);
            var streamOptions = waveform.optionsForSyncedStream();
            SC.stream(track.uri, streamOptions, function(stream){
              window.exampleStream = stream;
                  window.exampleStream.play()

                  setTimeout(function() {
                    $('.trackList li:first-child').addClass('activeTrack');
              $scope.resumeSound = function($event) {

                window.exampleStream.resume();
                $scope.resumebutton = "false";
                $scope.pausebutton = "true";
              }
                  }, 20)


                });
            });


              }).error(function() {
                alert("error");
              });
            }


      }).error(function(error) {

      });

}).controller('playlistsCtrl', function($scope, $routeParams, $sce, skeetAppFactory, $http, $location) {

            $scope.tracksiframe = "false";
            $scope.playlistsiframe = "true";
              $scope.pausebutton = "true";
             $scope.stopSound = function($event) {
              $scope.resumebutton = "false";
              $scope.pausebutton = "false";
              soundManager.stopAll();
            }
            $scope.pauseSound = function($event) {

              soundManager.pauseAll();
              $scope.resumebutton = "true";
              $scope.pausebutton = "false";
            }
            $scope.resumeSound = function($event) {
              soundManager.resumeAll();
              $scope.resumebutton = "false";
              $scope.pausebutton = "true";
            }


//load playlist tracks

        $http({
          method: 'GET',
          url: 'https://api.soundcloud.com/playlists/' + $routeParams.musicItem  + '.json?client_id=0f993f2250c9e82a24acc020437d5da9'
        }).success(function(data) {
          console.log(data)
          var artworkurl = data.artwork_url;
          $scope.artworkUrl =  artworkurl.replace('large', 't300x300');
          $scope.artistName = data.user.username;
          $scope.trackTitle = data.title;

          
          $scope.playlistTracks = data.tracks;         
           $scope.firstTrack = data.tracks[0].id;
          $scope.waveForm = data.tracks[0].waveform_url;


          SC.get("/tracks/" + $scope.firstTrack, function(track){
            var waveform = new Waveform({
              container: document.getElementById("playlistwave"),
              innerColor: "#333"
            });

            waveform.dataFromSoundCloudTrack(track);
            var streamOptions = waveform.optionsForSyncedStream();

            SC.stream(track.uri, streamOptions, function(stream){
              window.exampleStream = stream;
                window.exampleStream.play()

             setTimeout(function(){
              $('.trackList li:first-child').addClass('activeTrack');
              $('.playbtn').find('span').addClass('activeControl');
             }, 20)

            });
        });
            // play playlist track
            $scope.playTrack = function($event){
                 angular.element(event.currentTarget).siblings().removeClass('activeTrack');
                 angular.element(event.currentTarget).addClass('activeTrack');              
              $scope.resumebutton = "false";
              $scope.pausebutton = "true";
              document.getElementById("playlistwave").innerHTML = "";
              $scope.playlisttrack = angular.element(event.currentTarget).attr('data-url');
              soundManager.stopAll()

          SC.get("/tracks/" + $scope.playlisttrack, function(track){
            var waveform = new Waveform({
              container: document.getElementById("playlistwave"),
              innerColor: "#333"
            });

            waveform.dataFromSoundCloudTrack(track);
            var streamOptions = waveform.optionsForSyncedStream();
            
            SC.stream(track.uri, streamOptions, function(stream){
              window.exampleStream = stream;
                window.exampleStream.play()
                
          
              }); 
              });             
            }


        }).error(function() {
          alert("error");
        });




  $('.skeetOuterWrapper').addClass('playing');
  $('.marginOne').addClass('marginTwo');


      skeetAppFactory.getParseUser({
        where: {
          username: $routeParams.nameHolder
        }
      }).success(function(success) {
        console.log(success)
        var soundcloudId = success.results[0].soundcloud;



        $http({
          method: 'GET',
          url: 'https://api.soundcloud.com/users/' + soundcloudId + '/tracks.json?client_id=0f993f2250c9e82a24acc020437d5da9'
        }).success(function(data) {
          // With the data succesfully returned, call our callback
          //console.log(data)
          $scope.musicTracks = data;

        }).error(function() {
          alert("error");
        });

        $http({
          method: 'GET',
          url: 'https://api.soundcloud.com/users/' + soundcloudId + '/playlists.json?client_id=0f993f2250c9e82a24acc020437d5da9'
        }).success(function(data) {
          // With the data succesfully returned, call our callback
          //console.log(data)
          $scope.musicPlaylists = data;

        }).error(function() {
          alert("error");
        });

                // play a playlist item from tracks row
            $scope.playlistPlay = function($event) {
                  soundManager.stopAll();
                  $scope.resumebutton = "false";
                  $scope.pausebutton = "true";
                          
              document.getElementById('playlistwave').innerHTML = '';
             
              var playlistId = angular.element(event.currentTarget).attr('data-url');
              $location.path($routeParams.nameHolder + '/music/playlist/' + playlistId, false);
              $scope.tracksiframe = "false";
              $scope.playlistsiframe = "true";

              $http({
                method: 'GET',
                url: 'https://api.soundcloud.com/playlists/' + playlistId + '.json?client_id=0f993f2250c9e82a24acc020437d5da9'
              }).success(function(data) {
                console.log(data)
                var artworkurl = data.artwork_url;
                $scope.artworkUrl = artworkurl.replace('large', 't300x300');
                $scope.artistName = data.user.username;
                $scope.trackTitle = data.title;

                $scope.playlistTracks = data.tracks;
                $scope.firstTrack = data.tracks[0].id;
                $scope.waveForm = data.tracks[0].waveform_url;

          SC.get("/tracks/" + $scope.firstTrack, function(track){
            var waveform = new Waveform({
              container: document.getElementById("playlistwave"),
              innerColor: "#333"
            });

            waveform.dataFromSoundCloudTrack(track);
            var streamOptions = waveform.optionsForSyncedStream();
            SC.stream(track.uri, streamOptions, function(stream){
              window.exampleStream = stream;
                  window.exampleStream.play()

                  setTimeout(function() {
                    $('.trackList li:first-child').addClass('activeTrack');
              $scope.resumeSound = function($event) {

                window.exampleStream.resume();
                $scope.resumebutton = "false";
                $scope.pausebutton = "true";
              }
                  }, 20)


                });
            });


              }).error(function() {
                alert("error");
              });
            }


            // plays track from TRACKS row
            $scope.trackPlay = function($event) {
                  soundManager.stopAll();
                  $scope.resumebutton = "false";
                  $scope.pausebutton = "true";
                          
              document.getElementById('trackwave').innerHTML = '';
             
              var trackId = angular.element(event.currentTarget).attr('data-url');
              $location.path($routeParams.nameHolder + '/music/track/' + trackId, false);
              $scope.tracksiframe = "true";
              $scope.playlistsiframe = "false";

              $http({
                method: 'GET',
                url: 'https://api.soundcloud.com/tracks/' + trackId + '.json?client_id=0f993f2250c9e82a24acc020437d5da9'
              }).success(function(data) {
                console.log(data)
                var artworkurl = data.artwork_url;
                $scope.artworkUrl = artworkurl.replace('large', 't300x300');
                $scope.artistName = data.user.username;
                $scope.trackTitle = data.title;

                $scope.playlistTracks = data;
                $scope.firstTrack = data.id;
                $scope.waveForm = data.waveform_url;

          SC.get("/tracks/" + $scope.firstTrack, function(track){
            var waveform = new Waveform({
              container: document.getElementById("trackwave"),
              innerColor: "#333"
            });

            waveform.dataFromSoundCloudTrack(track);
            var streamOptions = waveform.optionsForSyncedStream();
            SC.stream(track.uri, streamOptions, function(stream){
              window.exampleStream = stream;
                  window.exampleStream.play()

                  setTimeout(function() {
                    $('.trackList li:first-child').addClass('activeTrack');
              $scope.resumeSound = function($event) {

                window.exampleStream.resume();
                $scope.resumebutton = "false";
                $scope.pausebutton = "true";
              }
                  }, 20)


                });
            });


              }).error(function() {
                alert("error");
              });
            }


      }).error(function(error) {

      });

}).controller('videoCtrl', function($scope, $routeParams, $sce, skeetAppFactory, $http, $location) {
 // $('#skeetHeader h2').html($scope.userName);
    $scope.videoiframe = "true";
  $('.skeetOuterWrapper').addClass('playing');

  var baseUrl = 'https://www.youtube.com/embed/' +  $routeParams.videoItem  + '?autoplay=1';

  $scope.videoUrl = $sce.trustAsResourceUrl(baseUrl);
  
      skeetAppFactory.getParseUser({
        where: {
          username: $routeParams.nameHolder
        }
      }).success(function(success) {
        console.log(success)
        var youtubeId = success.results[0].youtube;
      var youtubechannelId = success.results[0].youtubechannel;

//get All Videos
        $http({
          method: 'GET',
          url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=' + youtubeId.toString() + '&key=AIzaSyBZGeefjprHm8Zq6DkblpvNV0eQ65l2E84'
        }).success(function(data) {
          console.log(data)
          // With the data succesfully returned, call our callback
          $scope.homeVideo = data.items;
         
          $('.rn-carousel-controls').each(function(){
              $(this).insertAfter($(this).parent('ul.carouselholder'));
          });

        }).error(function() {
          //alert("error");
        });

    //get Top rated
        $http({
          method: 'GET',
          url: 'https://www.googleapis.com/youtube/v3/search?order=rating&part=snippet&maxResults=50&channelId=' + youtubechannelId.toString() + '&key=AIzaSyBZGeefjprHm8Zq6DkblpvNV0eQ65l2E84'
        }).success(function(data) {
          console.log("TOPRATED")
          console.log(data)
          // With the data succesfully returned, call our callback
          $scope.topRated = data.items;
         
          $('.rn-carousel-controls').each(function(){
              $(this).insertAfter($(this).parent('ul.carouselholder'));
          });

        }).error(function() {
          //alert("error");
        });


    //get Most Viewed
        $http({
          method: 'GET',
          url: 'https://www.googleapis.com/youtube/v3/search?order=viewCount&part=snippet&maxResults=50&channelId=' + youtubechannelId.toString() + '&key=AIzaSyBZGeefjprHm8Zq6DkblpvNV0eQ65l2E84'
        }).success(function(data) {
          console.log(data)
          // With the data succesfully returned, call our callback
          $scope.mostViewed = data.items;
         
          $('.rn-carousel-controls').each(function(){
              $(this).insertAfter($(this).parent('ul.carouselholder'));
          });

        }).error(function() {
          //alert("error");
        });


    $scope.videoOpen = function($event) {
      var videoId = angular.element(event.currentTarget).attr('data-url');
      $location.path($routeParams.nameHolder + '/video/' + videoId);
    }


      }).error(function(error) {

      });

}).controller('usernameCtrl', function($scope,$location, $routeParams){
  setTimeout(function() {
        $scope.$watch(function() {
          return $location.path();
        }, function(value) {
          console.log(value);
          //$scope.userName = $routeParams.nameHolder;

        });

  }, 100);

  $scope.goHome = function(){
    $location.path('/' + $routeParams.nameHolder)
    soundManager.stopAll();
  }
}).controller('discoveryCtrl', function($scope,$location, $routeParams,skeetAppFactory){

angular.element('.globalHeader, #discoverynav').show();
  //get All Followers
skeetAppFactory.getFollower().success(function(success){
  console.log(success.results.length)
  $scope.allFollowersCount = success.results.length;
}).error(function(error){

});
 $('#loggedUser').html("Discovery");
angular.element('.followersCount, .discoveryglyph').hide();
angular.element('#followBtn').hide();
    skeetAppFactory.getParseUser().success(function(success){
      //console.log(success)
        $scope.allusers = success.results;



        //console.log( $scope.allusers)
for(var i =0;  i < $scope.allusers.length; i++){
      var getFollowFrom = $scope.allusers[i].username;

    skeetAppFactory.getFollower({
      where: {
        artist: getFollowFrom
      }
    }).success(function(success) {
      console.log(success)
      for(var i = 0; i < success.results.length; i++){
          //console.log(success.results[i])

          var discoveryBuckets = document.getElementsByClassName('discoveryBuckets')[0];
          var outerWidth = discoveryBuckets.offsetWidth;
          var percentage = success.results.length/ $scope.allFollowersCount * 100 ;
         console.log(percentage)
      angular.element('.artistname:contains(' + success.results[0].artist + ')').parent().find('.powerbar').css('width', percentage + '%')

      }


    }).error(function(error) {

    });
}

    /*setTimeout(function() {
      var list = document.getElementsByClassName('discoveryBuckets');

      for (var i = 0; i < list.length; i++) {
        var src = list[i].getAttribute('data-background');
        list[i].style.backgroundImage = "url('" + src + "')";
      }
    }, 1000)*/
   

    $scope.openUser = function(){
      var thisUser = angular.element(event.currentTarget).attr('data-username');
        $location.path('/' + thisUser);
    }

}).error(function(){

});

}).controller('followersCtrl', function($scope,$location, $routeParams,skeetAppFactory){

//get Followers
angular.element('.globalHeader, .discoveryglyph').show();
angular.element('.followersCount').hide();
angular.element('#followBtn').hide();
angular.element("#loggedUser").html($routeParams.nameHolder);
angular.element('#loggedUser').append("<span style='font-weight:100; font-size:20px;'>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Followers</span>");


    var getFollowFrom = $routeParams.nameHolder;

    skeetAppFactory.getFollower({
      where: {
        artist: getFollowFrom
      }
    }).success(function(success) {
      $scope.followers = success.results;


    }).error(function(error) {

    });

    $scope.openUser = function(){
      var thisUser = angular.element(event.currentTarget).attr('data-username');
        $location.path('/' + thisUser);
    }

});


/*skeetApp.directive('userName', ['$routeParams', function ($routeParams, $location) {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
          setTimeout(function(){
          $(element).html($routeParams.nameHolder)
      

          }, 100)

      }
    }
  }]);*/


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
    var youtubechannelid = response.items[0].id;
    console.log(youtubechannelid)
    var objectid = localStorage.getItem("objectid");
    var sessionToken = localStorage.getItem("sessionToken");

    var youtubeUser = {
      youtube: youtubeid,
      youtubechannel: youtubechannelid
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

        var objectid = localStorage.getItem("objectid");
        var sessionToken = localStorage.getItem("sessionToken");

        var youTubeSwitch = {
          youtubeOn: 'on'
        }


        $.ajax({
          method: 'PUT',
          url:'https://api.parse.com/1/users/' + objectid,
          data: JSON.stringify(youTubeSwitch),
          headers: {
            'X-Parse-Application-Id': 'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z',
            'X-Parse-REST-API-Key': 'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ',
            "Content-Type": "application/json",
            "X-Parse-Session-Token": sessionToken
          },
          success: function() {
            $('input[name="youtube-checkbox"]').bootstrapSwitch('state', true);

          },
          error: function() {

          }
        });

      }
    });

  });
}


