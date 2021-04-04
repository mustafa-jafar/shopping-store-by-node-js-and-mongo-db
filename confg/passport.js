const passPort = require("passport");
const localStrategy = require("passport-local").Strategy;
const user = require("../models/userschema");
const Cart = require('../models/card');

passPort.serializeUser((User, done) => {
  return done(null, User.id);
});
passPort.deserializeUser((id, done) => {
  user.findById(id , (err, user) => {
      // shearch cart in sission
      Cart.findById(id , (err , cart)=>{
        // cart is not found 
        
        
        if(!cart){
          return done (err , user)
        }
          // cart is found 
        user.cart= cart ;

        return done (err , user)
        
      })
   //ree
  });
});

passPort.use(
  "local-singin",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      user.findOne({ userEmail: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(
            null,
            false,
            req.flash("singinerror", "this user is not found")
          );
        }
        if (!user.comparepassword(password)) {
          return done(null, false, req.flash("singinerror", "worng password"));
        }
        return done(null, user);
      });
    }
  )
);

passPort.use(
  "local-singup",
  new localStrategy(
    {
  
      usernameField: "userEmail",
      passwordField: "userPassword",
      passReqToCallback: true,
    },
    (req, userEmail, userPassword, done) => {
      user.findOne({ userEmail: userEmail }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(
            null,
            false,
            req.flash("singuperror", "this email is alreade exsits")
          );
        }
        const userschema = new user({
          userEmail: req.body.userEmail ,
          userPassword: new user().hashpassword(req.body.userPassword),
          userBorn: req.body.userBorn,
          userName: req.body.userName,
        });
        userschema.save((err , user)=>{
            if(err){
                return done(err)
            }
            return done(user)
        })
      });
    }
  )
);
