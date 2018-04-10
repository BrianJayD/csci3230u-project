
var port = process.env.PORT || 8082;
var express = require('express')
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'pug');



var firebase = require("firebase");
var config = {
	apiKey: "AIzaSyAUIspMiH6pU_bU-BEo2fSIg7-FggndAW4",
	authDomain: "photodrive-4003a.firebaseapp.com",
	databaseURL: "https://photodrive-4003a.firebaseio.com",
	projectId: "photodrive-4003a",
	messagingSenderId: "470628763354"
};
var defaultApp = firebase.initializeApp(config);

var curr_user;
var functions = require('firebase-functions');
var admin = require("firebase-admin");

var serviceAccount = require("./photodrive-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://photodrive-4003a.firebaseio.com"
});


var db = admin.firestore();

email = "";
password = "" ;


// Initialize the default app

// console.log(defaultApp.name);  // "[DEFAULT]"

// You can retrieve services via the defaultApp variable...
// var defaultStorage = defaultApp.storage();
// var defaultDatabase = defaultApp.database();

// ... or you can use the equivalent shorthand notation
// db = admin.firestore(); 

// Import Admin SDK

// Get a database reference to our blog



app.get('/', function (req, res) {
	res.render('login', {message: "Welcome, Please Log in or Create an Account."});
	// res.send('/test')
});

app.post('/create', function (req, res) {
	res.render('create_account', {message: "create a new account"});
});

app.post('/create/new', function (req, res, next) {
	email = req.body.email;
    password = req.body.password;
    var displayName = req.body.displayName;

    firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(function(user) { 
	  		var data = {
			  uuid: user.uid,
			  display_name: displayName,
			};

			// Add a new document in collection "cities" with ID 'LA'
			var setDoc = db.collection('users').doc(user.uid).set(data);

	  		res.redirect('/main');
	  		// return res.redirect(__dirname + "/public/PhotoDrive_Home.html");
  		})
        .catch(next);
})

// app.post('/main/upload', function (req, res) {
// 	res.redirect('/upload');
// });

app.post('/upload', function (req, res, next) {
  	res.render('upload', {message: "upload"});
});


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
// app.use((request,response)=>{
//    response.type('text/plain');
//    response.status(505);
//    response.send('Error page');
// });


// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);