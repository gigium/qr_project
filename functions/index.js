const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const express = require("express");
const app = express();

// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyCN0Xc-Eqd4ETqPw8j42gYjLqo6A5Hv3DE",
	authDomain: "qr-project-c1a0c.firebaseapp.com",
	databaseURL: "https://qr-project-c1a0c.firebaseio.com",
	projectId: "qr-project-c1a0c",
	storageBucket: "qr-project-c1a0c.appspot.com",
	messagingSenderId: "683839806132",
	appId: "1:683839806132:web:ed8762c91f0822474555e1",
};
const firebase = require("firebase");

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

const { validateSignupData } = require("./util/validators");

//signup route
app.post("/signup", (req, res) => {
	const newUser = {
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		name: req.body.name,
		surname: req.body.surname,
	};

	const { valid, errors } = validateSignupData(newUser);
	if (!valid) return res.status(400).json(errors);

	let token, userId;

	firebase
		.auth()
		.createUserWithEmailAndPassword(newUser.email, newUser.password)
		.then((data) => {
			return res
				.status(201)
				.json({ message: `user ${data.user.uid} signed up successfully` });
		})
		.then((data) => {
			userId = data.user.uid;
			return data.user.getIdToken();
		})
		.then((idToken) => {
			token = idToken;
			const userCredentials = {
				name: newUser.name,
				surname: newUser.surname,
				email: newUser.email,
				createdAt: new Date().toISOString(),
			};
			return db.doc("/users/" + userId).set(userCredentials);
		})
		.then(() => {
			return res.status(201).json({ token });
		})
		.catch((err) => {
			console.error(err);
			if (err.code === "auth/email-already-in-use") {
				return res.status(400).json({ email: "email already in use" });
			}
			return res
				.status(500)
				.json({ general: "Something went wrong, please try again" });
		});
});

exports.api = functions.region("europe-west1").https.onRequest(app);
