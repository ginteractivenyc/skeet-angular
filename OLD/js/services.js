
angular.module('parseService', ['ngResource'])
.factory('parseService', function($resource, $location) {
  return $resource('https://api.parse.com/1/users/', {},        
    { get: { method: "GET", isArray: false,   params: {
       where:'',
    }, headers:  {'X-Parse-Application-Id':'tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z', 'X-Parse-REST-API-Key':'tY4eHyUnom4FZC9xAypgXsquEauGFQErvqx2YZZQ'} }});

});


//home Music
angular.module('musicHomeService', ['ngResource'])
.factory('musicHomeService', function($resource) {
  return $resource('https://api.soundcloud.com/users/2306715/tracks.json?client_id=07b0e9b7e4ac9e8454b61d33eaba766b', {},        
  	{ get: { method: "GET", isArray: true }});

});

//home Video
angular.module('videoHomeService', ['ngResource'])
.factory('videoHomeService', function($resource) {
  return $resource('https://gdata.youtube.com/feeds/api/users/bklynstickup/uploads?v=2&alt=json&orderby=published&max-results=5', {},        
  	{ get: { method: "GET" }});

});


/*angular.module('instagramHomeService', ['ngResource']).service('instagramHomeService', function($http) {
  return {
    async: function() {
      return $http.jsonp('https://api.instagram.com/v1/users/22132301/media/recent?count=5&client_id=7380072fbc2f438994b747e10485357f&callback=JSON_CALLBACK'); 
    }
  };
});*/

//home Instagram
/*angular.module('instagramHomeService', ['ngResource'])
.factory('instagramHomeService', function($resource) {
  return $resource('https://api.instagram.com/v1/users/22132301/media/recent?count=5&client_id=7380072fbc2f438994b747e10485357f', {}, {
      getJSONP: {
        method: 'JSONP',
        isArray: false ,
        params: {
          callback: 'JSON_CALLBACK'
        }
      }
  });
});*/
// home IG
angular.module('instagramHomeService', ['ngResource']).factory("instagramHomeService", function($resource) {
  return $resource("https://api.instagram.com/v1/users/22132301/media/recent?count=5&client_id=7380072fbc2f438994b747e10485357f",
    { callback: "JSON_CALLBACK" },
    { get: { method: "JSONP", isArray: false }});
});

//home Merch
angular.module('merchHomeService', ['ngResource'])
.factory('merchHomeService', function($resource) {
  return $resource('http://api.bigcartel.com/bklynstickup/products.json', {},        
  	{ get: { method: "GET", isArray: true }});

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
