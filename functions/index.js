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

const { validateSignupData, validateLoginData } = require("./util/validators");

//signup route
app.post("/signup", (req, res) => {
  const newUser = {
    business: req.body.business,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    // name: req.body.name,
    // surname: req.body.surname,
  };

  const { valid, errors } = validateSignupData(newUser);
  if (!valid) return res.status(400).json(errors);

  let token, userId;
  //if user is business insert business info in business table
  // else insert user info in client table
  // always insert user in table users
  db.doc("/users/" + newUser.email)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: "this email is already in use" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId: userId,
      };

      return db.doc("/users/" + newUser.email).set(userCredentials);
    })
    .then(() => {
      let userData = {};
      if (newUser.business === true) {
        userData = {
          userId: userId,
          businessName: req.body.businessName,
        };
        return db.doc("/business/" + userId).set(userData);
      }
      if (newUser.business === false) {
        userData = {
          userId: userId,
          name: req.body.name,
          surname: req.body.surname,
        };
        return db.doc("/clients/" + userId).set(userData);
      }
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "email already in use" });
      }
      // delete user here
      return res
        .status(500)
        .json({ general: "Something went wrong, please try again" });
    });
});

//login
app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(403)
        .json({ general: "Wrong credentials, please try again" });
    });
});

exports.api = functions.region("europe-west1").https.onRequest(app);
