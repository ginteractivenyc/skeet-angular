
/*angular.module('parseService', ['ngResource'])
.factory('parseService', function($resource, $location) {
  return $resource('https://api.parse.com/1/users/', {},        
    { get: { method: "GET", isArray: false,   params: {
       where:'',
    }, headers:  {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ'} }});

});*/



skeetApp.factory('skeetAppFactory', [ '$rootScope', '$http', function($rootScope, $http){

  var urlBase = 'https://api.parse.com';
  var skeetAppFactory = {};



//login user
  skeetAppFactory.loginParseUser = function(loginObject){
    return $http({
      method: 'GET',
      url: urlBase + '/1/login/',
      headers:  {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', 'Content-type' : 'application/x-www-form-urlencoded'},
      params: loginObject
    })
  }


//GET 

  skeetAppFactory.getParseUser = function(whereParams){
    return $http({
      method: 'GET',
      url: urlBase + '/1/users/',
      headers:  {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', 'Content-type' : 'application/json'},
      params: whereParams
    })
  }

  skeetAppFactory.getSoundcloudUser = function(whereParams){
    return $http({
      method: 'GET',
      url: urlBase + '/1/classes/endpoint/',
      headers:  {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', 'Content-type' : 'application/json'},
      params: whereParams
    })
  }


   skeetAppFactory.getYoutubeUser = function(objectid){
    return $http({
      method: 'GET',
      url: urlBase + '/1/users/' + objectid,
      headers:  {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', 'Content-type' : 'application/json'}
      
    })
  } 


   skeetAppFactory.getIGUser = function(objectid){
    return $http({
      method: 'GET',
      url: urlBase + '/1/users/' + objectid,
      headers:  {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', 'Content-type' : 'application/json'}
      
    })
  } 



  skeetAppFactory.getFollower = function(getFollowers){
    return $http({
      method: 'GET',
      url: urlBase + '/1/classes/followers/' ,
      headers: {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', "Content-Type": "application/json"},
       params: getFollowers
    })
  }


//POST

 skeetAppFactory.storeUser = function(userObject){
     return $http({
      method: 'POST',
      url: urlBase + '/1/users',      
      data: userObject,
      headers:  {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', 'Content-Type': 'application/json'}
    }) 
 }


  skeetAppFactory.storeProfileImage = function(image){
    return $http({
      method: 'POST',
      url: urlBase + '/1/files/pic.jpg',      
      data: image,
      headers:  {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', 'Content-Type': 'image/jpeg'}

    })
  }



//PUT
    skeetAppFactory.assignProfileImage = function(objectid, profileImage, sessionToken){
    return $http({
      method: 'PUT',
      url: urlBase + '/1/users/' + objectid,
      data: profileImage,
      headers: {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', "Content-Type": "application/json", "X-Parse-Session-Token" : sessionToken}
    })
  }



  skeetAppFactory.storeSoundcloudUser = function(objectid, soundcloudUser, sessionToken){
    return $http({
      method: 'PUT',
      url: urlBase + '/1/users/' + objectid,
      data: soundcloudUser,
      headers: {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', "Content-Type": "application/json", "X-Parse-Session-Token" : sessionToken}
    })
  }




  skeetAppFactory.soundcloudSwitchOn = function(objectid, soundCloudSwitch, sessionToken){
    return $http({
      method: 'PUT',
      url: urlBase + '/1/users/' + objectid,
      data: soundCloudSwitch,
      headers: {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', "Content-Type": "application/json", "X-Parse-Session-Token" : sessionToken}
    })
  }
    skeetAppFactory.youtubeSwitchOn = function(objectid, youTubeSwitch, sessionToken){
    return $http({
      method: 'PUT',
      url: urlBase + '/1/users/' + objectid,
      data: youTubeSwitch,
      headers: {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', "Content-Type": "application/json", "X-Parse-Session-Token" : sessionToken}
    })
  }

    skeetAppFactory.instagramSwitchOn = function(objectid, instagramSwitch, sessionToken){
    return $http({
      method: 'PUT',
      url: urlBase + '/1/users/' + objectid,
      data: instagramSwitch,
      headers: {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', "Content-Type": "application/json", "X-Parse-Session-Token" : sessionToken}
    })
  }




// this service wont work due to google's excessive callback requirements, have to use regular jquery ajax method
  skeetAppFactory.storeYouTubeUser = function(objectid, youtubeUser, sessionToken){
    return $http({
      method: 'PUT',
      url: urlBase + '/1/users/' + objectid,
      data: youtubeUser,
      headers: {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', "Content-Type": "application/json", "X-Parse-Session-Token" : sessionToken}
    })
  }


  skeetAppFactory.storeFollower = function(followUser, sessionToken){
    return $http({
      method: 'POST',
      url: urlBase + '/1/classes/followers/',
      data: followUser,
      headers: {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', "Content-Type": "application/json", "X-Parse-Session-Token" : sessionToken}
    })
  }


  return skeetAppFactory;


}]);








angular.module('newsHomeService',[]).
    factory('newsHomeService', ['$http',function($http){
       return {
           get: function(callback){
                $http.get(
                    'http://bklynstickup.com/home/feed?=xml',
                    {transformResponse:function(data) {
                      // convert the data to JSON and provide
                      // it to the success function below
                        var x2js = new X2JS();
                        var json = x2js.xml_str2json( data );
                        return json;
                        }
                    }
                ).
                success(function(data, status) {
                    // send the converted data back
                    // to the callback function
                    callback(data);
                })
           }
       }
    }]);







