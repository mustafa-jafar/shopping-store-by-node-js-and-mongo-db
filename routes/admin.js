var express = require('express');
var router = express.Router();
const User = require("../models/userschema");
const { check, validationResult } = require("express-validator");
const passPort = require("passport");
const csrf = require("csurf");
const cart = require("../models/card");
const product = require("../models/product");


/* GET admin page. */
router.get('/', function(req, res, next) {
  res.render('admin');
});
router.get('/dashbord', (req , res, next)=>{
    res.render('dashbord');
  });

module.exports = router;
