const passport = require("passport");
require("dotenv").config();
const strategy = require("passport-facebook");

const userModel = require("../models/users");
const FacebookStrategy = strategy.Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "name"],
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
      // const { email, username, password } = profile._json;
      // const userData = {
      //   email,
      //   userName: username,
      //   password: password,
      // };
      // new userModel(userData).save();
      // done(null, profile);
    }
  )
);
