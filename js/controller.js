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

}).error(function(error) {
  console.log(error)
});

}

$scope.login = function(){
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
 $window.location='#/' +  $scope.nameHolder + '/loggedin';

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
//initiate parse user
 var currentUser = Parse.User.current();


// check if user exists

var skeetUsers = Parse.Object.extend("User");
var queryUsers = new Parse.Query(skeetUsers);
queryUsers.equalTo("username", $routeParams.nameHolder);
queryUsers.find({
  success: function(results) {
    if (results.length <= 0){
     // alert('User Doesnt Exist');
     $window.location='#/signup';
    }
    // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var object = results[i];

        console.log(object);
        sessionToken.push(object._sessionToken);
         console.log(sessionToken);
        $scope.username = object.attributes.username;
        var userSpace = document.getElementsByClassName('globalHeader')[0];
        var welcomeUser = '<span class="userSpace">' + $scope.username + '</span>';
        userSpace.innerHTML = welcomeUser


        //check if soundcloud exists
        if (object.attributes.soundcloudOn === "on") {
          $('input[name="soundcloud-checkbox"]').bootstrapSwitch('state', 'true');
        }
        //check if youtube exists
        if (object.attributes.youtubeOn  === "on") {
          $('input[name="youtube-checkbox"]').bootstrapSwitch('state', 'true');
        }
        //check if instagram exists
        if (object.attributes.instagramOn  === "on") {
          $('input[name="instagram-checkbox"]').bootstrapSwitch('state', 'true');
        }


      }
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
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
                    var currentUser = Parse.User.current();
                      var objectid = currentUser.id
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
SC.connect(function(){
      SC.get("/me", function(me){
        $scope.soundcloudName = me.username;
        $("#username").text($scope.soundcloudName);
        $("#description").val(me.description);
        var currentUser = Parse.User.current();
       var objectid = skeetUserId;

        var soundcloudUser = {
          soundcloud: $scope.soundcloudName
        }
        skeetAppFactory.storeSoundcloudUser(objectid, soundcloudUser, sessionToken).success(function(data) {
          console.log(data)
            $('input[name="soundcloud-checkbox"]').bootstrapSwitch('state', 'true');
        }).error(function(error) {
          console.log(error)
        });


        //save soundcloud Name to parse
      /*  currentUser.set("soundcloud", $scope.soundcloudName );
        currentUser.set("soundcloudOn", "on");
        currentUser.save(null, {
          success: function(successResult){
            console.log(successResult) 
             $('input[name="soundcloud-checkbox"]').bootstrapSwitch('state', 'true');            
          },
          error: function(errorResult){
            console.log("There was an error")
          }
        });*/

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

  $scope.igLogin = function() {
    var url = "https://api.instagram.com/oauth/authorize/?client_id=7380072fbc2f438994b747e10485357f&redirect_uri=http://localhost:8888/skeet-angular/login.html&response_type=token&callback=retrieveToken"
    location.replace(url)
  console.log(url)

  }


  //toggle soundcloud switch
  $('input[name="soundcloud-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
    if (state === false) {
      currentUser.set("soundcloudOn", "off");
      currentUser.save();

    }

    if (state === true) {
      //currentUser.set("soundcloudOn", "on");
      //currentUser.save();
      var skeetUsers = Parse.Object.extend("User");
      var queryUsers = new Parse.Query(skeetUsers);
      queryUsers.equalTo("username", $routeParams.nameHolder);
      queryUsers.find({
        success: function(results) {
          // Do something with the returned Parse.Object values
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            var soundcloudName = object.attributes.soundcloud;
            if (soundcloudName === undefined) {

              SC.connect(function() {
                SC.get("/me", function(me) {
                  var soundcloudName = me.username;
                  $("#username").text(soundcloudName);
                  console.log(soundcloudName);
                  $("#description").val(me.description);
                  var currentUser = Parse.User.current();

                  //save soundcloud Name to parse
                  currentUser.set("soundcloud", soundcloudName);
                  currentUser.set("soundcloudOn", "on");
                  currentUser.save(null, {
                    success: function(successResult) {
                      console.log(successResult)
                      $('input[name="soundcloud-checkbox"]').bootstrapSwitch('state', 'true');
                    },
                    error: function(errorResult) {
                      console.log("There was an error")
                     // $('input[name="soundcloud-checkbox"]').bootstrapSwitch('state', 'false');            

                    }
                  });

                });
              });


            } else if (soundcloudName.length >= 1) {
              currentUser.set("soundcloudOn", "on");
              currentUser.save();
            }
          }
        }
      });
    }

  });


  //toggle youtube switch
$('input[name="youtube-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
    if (state === false) {
      currentUser.set("youtubeOn", "off");
      currentUser.save();

    }

    if (state === true) {
      //currentUser.set("soundcloudOn", "on");
      //currentUser.save();
      var skeetUsers = Parse.Object.extend("User");
      var queryUsers = new Parse.Query(skeetUsers);
      queryUsers.equalTo("username", $routeParams.nameHolder);
      queryUsers.find({
        success: function(results) {
          // Do something with the returned Parse.Object values
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            var youtubedName = object.attributes.youtube;
            if (youtubedName === undefined) {

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
            
                                
           
           else if (youtubedName.length >= 1) {
              currentUser.set("youtubeOn", "on");
              currentUser.save();
            }
          }
     }
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


}).controller('homeCtrl', function(parseService, $scope, $location, $http, $routeParams){
   // get Music Items
   console.log(nameHolderMain.toString())
  var parseServiceGet = function() {

    parseService.get( {where: {username : $routeParams.nameHolder}}, function success(data) {

       //$scope.homeMusic = data;
        console.log(data.results[0])
        var soundcloudId = data.results[0].soundcloud;
         var soundcloudOn = data.results[0].soundcloudOn;
       
        var youtubeId = data.results[0].youtube;
         var youtubeOn = data.results[0].youtubeOn;
        var instagramId = data.results[0].instagram;       
        var twittername = data.results[0].twittername;       
     
        if (data.results[0].profileimage === undefined){
          $scope.profileImage = 'http://placehold.it/640x360'
        } else{
           $scope.profileImage = data.results[0].profileimage;
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
if (youtubeOn === "on"){

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





//set up youtube
function loginCallback(result)
{
   if(result['status']['signed_in'])
    {
        var request = gapi.client.plus.people.get(
        {
            'userId': 'me'
        }); 
        request.execute(function (resp)
        {
            var email = '';
            if(resp['emails'])
            {
                for(i = 0; i < resp['emails'].length; i++)
                {
                    if(resp['emails'][i]['type'] == 'account')
                    {
                        email = resp['emails'][i]['value'];
                    }
                }
            }
 
            var str = "Name:" + resp['displayName'] + "<br>";
            //str += "Image:" + resp['image']['url'] + "<br>";
            //str += "<img src='" + resp['image']['url'] + "' /><br>";
 
            str += "URL:" + resp['url'] + "<br>";
            str += "Email:" + email + "<br>";
            //document.getElementById("profile").innerHTML = str;
                var youtubeName = resp['displayName'];
                var currentUser = Parse.User.current();

     
//Perform Youtube function

      var currentUser = Parse.User.current();
      var objectid = currentUser.id

      var youtubeUser = {
        youtube: youtubeName
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
}


function onLoadCallback()
{
    gapi.client.setApiKey('AIzaSyBZGeefjprHm8Zq6DkblpvNV0eQ65l2E84');
    gapi.client.load('plus', 'v1',function(){});
}
