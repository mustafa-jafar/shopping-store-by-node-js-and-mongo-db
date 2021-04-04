var express = require('express');
var router = express.Router();
const User = require("../models/userschema");
const { check, validationResult } = require("express-validator");
const passPort = require("passport");
const csrf = require("csurf");
const cart = require("../models/card");
const product = require("../models/product");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('store');
});


module.exports = router;
