$(document).ready(function(){
Parse.initialize("tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z", "F1g9SlNa2FhcneKqj4AdowudvI7zkMXNZUsjtgJm");
// initialize client with app credentials
SC.initialize({
  client_id: '07b0e9b7e4ac9e8454b61d33eaba766b',
  redirect_uri: 'http://localhost:8888/skeet-angular/loginfiles/callback.html'
});
});

var loginSubmit = document.getElementById('loginSubmit');

loginSubmit.addEventListener('click', function(){
var userName = document.getElementById('inputUsername').value;
var userPass= document.getElementById('inputPassword').value;
var userEmail= document.getElementById('inputEmail').value;
var user = new Parse.User();
user.set("username", userName);
user.set("password", userPass);
user.set("email", userEmail);
 console.log(userName + userEmail)
user.signUp(null, {
  success: function(user) {
   // alert()// Hooray! Let them use the app now.
   $('#skeetLogin').fadeOut();
// initiate auth popup

    return false;
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    alert("Error: " + error.code + " " + error.message);
  }
});

});

$('#connectSoundCloud').click(function(){
SC.connect(function(){
      SC.get("/me", function(me){
        $("#username").text(me.username);
         console.log(me.username);
        $("#description").val(me.description);
      });
    });
});
