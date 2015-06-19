
angular.module('parseService', ['ngResource'])
.factory('parseService', function($resource, $location) {
  return $resource('https://api.parse.com/1/users/', {},        
    { get: { method: "GET", isArray: false,   params: {
       where:'',
    }, headers:  {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ'} }});

});





skeetApp.factory('skeetAppFactory', function($http){
  var urlBase = 'https://api.parse.com';
  var skeetAppFactory = {};



  skeetAppFactory.storeUser = function(skeetUser){
    return $http({
      method: 'POST',
      url: urlBase + '/1/classes/skeetusers',
      data: skeetUser,
      headers:  {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', 'Content-type' : 'application/json'}
    })
  }




  skeetAppFactory.getSoundcloudUser = function(objectid){
    return $http({
      method: 'GET',
      url: urlBase + '/1/users/' + objectid,
      headers:  {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ', 'Content-type' : 'application/json'}
      
    })
  }






  skeetAppFactory.storeTwitterUser = function(twitterUser){
    return $http({
      method: 'POST',
      url: urlBase + '/1/classes/skeetusers',
      data: twitterUser
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



  return skeetAppFactory;
});







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
