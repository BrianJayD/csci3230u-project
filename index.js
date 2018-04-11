
var port = process.env.PORT || 8081;
var express = require('express')
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'pug');
var fs = require('fs');

// var gcloud = require('google-cloud');
// var storage = gcloud.storage();

firebase = require("firebase");
var storage = require('@google-cloud/storage');

var config = {
    apiKey: "AIzaSyAUIspMiH6pU_bU-BEo2fSIg7-FggndAW4",
    authDomain: "photodrive-4003a.firebaseapp.com",
    databaseURL: "https://photodrive-4003a.firebaseio.com",
    projectId: "photodrive-4003a",
    storageBucket: "gs://photodrive-4003a.appspot.com/",
    messagingSenderId: "470628763354"
  };

firebase.initializeApp(config);

var rootRef = firebase.database().ref();
// var storage = firebase.storage().ref();

var curr_user = {};

var usersRef = rootRef.child("users");

// console.log(usersRef);

// var admin = require("firebase-admin");

// var serviceAccount = require("./photodrive-key.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   projectId: "photodrive-4003a",
//   databaseURL: "https://photodrive-4003a.firebaseio.com",
//   storageBucket: "gs://photodrive-4003a.appspot.com/"
// });


// var db = admin.firestore();

// var db = admin.database().ref();
// var usersRef = db.child("users");
// Imports the Google Cloud client library


// Your Google Cloud Platform project ID
const projectId = 'photodrive-4003a';

// Creates a client
var gcs = storage({
  projectId: projectId,
  keyFilename: './keyfile.json'
});

var callback = function(err, bucket, apiResponse) {
  // `bucket` is a Bucket object.
  console.log(apiResponse);
};


email = "";
password = "";



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
			// var setDoc = db.collection('users').doc(user.uid).set(data);
			usersRef.child(user.uid).set(data);
			var temp = user.uid+"-album";
			const bucketName = temp.toLowerCase();

			// Creates a new bucket
			gcs
			  .createBucket(bucketName)
			  .then(() => {
			    console.log(`Bucket ${bucketName} created.`);
			  })
			  .catch(err => {
			    console.error('ERROR:', err);
			  });


	  		res.redirect('/main');
	  		// return res.redirect(__dirname + "/public/PhotoDrive_Home.html");
  		})
        .catch(next);
})

// app.post('/main/upload', function (req, res) {
// 	res.redirect('/upload');
// });

app.post('/upload', function (req, res, next) {
  	// res.render('upload', {message: "upload"});
  	var title = req.body.title;
    var caption = req.body.cap;
    var file = req.body.pic;
    console.log(file);
    console.log(curr_user.uid);
    
    var data = {
			  img_title: title,
			  img_cap: caption,
			  img: file
			};
	var temp = curr_user.uid+"-album";
	const bucketName = temp.toLowerCase();
	var bucket = gcs.bucket(temp)
	// console.log(bucket);
	// storage.put(file).then(function(snapshot) {
 //  		console.log('Uploaded a blob or file!');
	// });

	bucket.upload(file, function(err, file) {
	  if (!err) {
	    // "zebra.jpg" is now in your bucket.
	    console.log("success?");
	  } else {
	  	console.log("this");
	  }
	});
	
    // usersRef.child(curr_user.uid).child('album').child(title).set(data);
	res.redirect('/main');


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