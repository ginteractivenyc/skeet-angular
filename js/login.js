$(document).ready(function(){
Parse.initialize("tzlVexuKShRsUHAGSV30qJYz28953tIOPSs0dl3z", "F1g9SlNa2FhcneKqj4AdowudvI7zkMXNZUsjtgJm");

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
    return false;
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    alert("Error: " + error.code + " " + error.message);
  }
});

});