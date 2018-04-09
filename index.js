
var port = process.env.PORT || 8082;
var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser');
var app = express();
var curr_user;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true })); 

app.set('view engine', 'pug');

var firebase = require("firebase");
email = "";
password = "" ;

var config = {
	apiKey: "AIzaSyAUIspMiH6pU_bU-BEo2fSIg7-FggndAW4",
	authDomain: "photodrive-4003a.firebaseapp.com",
	databaseURL: "https://photodrive-4003a.firebaseio.com",
	projectId: "photodrive-4003a",
	storageBucket: "",
	messagingSenderId: "470628763354"
};

// Initialize the default app
var defaultApp = firebase.initializeApp(config);

// console.log(defaultApp.name);  // "[DEFAULT]"

// You can retrieve services via the defaultApp variable...
// var defaultStorage = defaultApp.storage();
// var defaultDatabase = defaultApp.database();

// ... or you can use the equivalent shorthand notation
// defaultStorage = firebase.storage();
// defaultDatabase = firebase.database(); 

// firebase.auth().signOut().then(function() {
// 	  // Sign-out successful.
// 	}).catch(function(error) {
// 	  // An error happened.
// });

app.get('/', function (req, res) {
	res.render('test', {message: "Welcome, Please Log in or Create and Account."});
	// res.send('/test')
});

app.post('/create', function (req, res) {
	res.render('create_account', {message: "create a new account"});
});

app.post('/create/new', function (req, res, next) {
	email = req.body.email;
    password = req.body.password;

    firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(function(user) { 
  		
  		res.redirect('/main');
  		// return res.redirect(__dirname + "/public/PhotoDrive_Home.html");
  		})
        .catch(next);
})


app.get('/main', function (req, res, next) {
  	res.sendFile(__dirname + "/public/PhotoDrive_Home.html");
});

app.post('/main', function (req, res, next) {
	console.log('main post');

    email = req.body.email;
    password = req.body.password;

    firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(function(user) { 
  			res.sendFile(__dirname + "/public/PhotoDrive_Home.html");
  		})
        .catch(next);
});

firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    // User is signed in.
	    var displayName = user.displayName;
	    var email = user.email;
	    var emailVerified = user.emailVerified;
	    var photoURL = user.photoURL;
	    var isAnonymous = user.isAnonymous;
	    var uid = user.uid;
	    var providerData = user.providerData;
	    // ...
	    console.log(email, "Logged in"); 
		curr_user = user

	  } else {

	    // User is signed out.
	    
	  }
});




//Express error handling middleware
app.use((request,response)=>{
   response.type('text/plain');
   response.status(505);
   response.send('Error page');
});


// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);