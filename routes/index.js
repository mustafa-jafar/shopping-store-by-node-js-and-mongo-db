var express = require("express");
var router = express.Router();
const User = require("../models/userschema");
const { check, validationResult } = require("express-validator");
const passPort = require("passport");
const csrf = require("csurf");
const cart = require("../models/card");
const product = require("../models/product");
const Order = require('../models/order')
const stripe = require('stripe')
('sk_test_51HtGoAHjVS9QVhp1stgTE2cwLyfW8kXiydgwIKYTfPr553Vi1BTdQLozbObNnZnT1xmCe8ZBudSld5utiwGxHshy00RkufrXjR');
router.use(csrf());

/* GET home page. */
router.get("/", function (req, res, next) {
 const scucsse = req.flash('scucsse')[0]
  var totalproduct = 0;
  if (req.isAuthenticated()) {
    if (req.user.cart) {
      totalproduct = req.user.cart.totalNumber;
    } else {
      totalproduct = 0;
    }
  }
  product
    .find({}, (err, doc) => {
      if (err) {
        console.log(err);
      }

      var grid = 3;
      var colgrid = [];
      for (var i = 0; i < doc.length; i += grid) {
        colgrid.push(doc.slice(i, i + grid));
      }
      res.render("index", {
        checkUser: req.isAuthenticated(),
        products: colgrid,
        totalproduct: totalproduct,
        scucsse :scucsse,
      });
    })
    .lean();
});

router.get("/store", function (req, res, next) {
  res.render("store", { email: req.params.email });
});
router.get("/login", isNotSingin, function (req, res, next) {
  var validationMassage = req.flash("singinerror");
  res.render("login", { massages: validationMassage, token: req.csrfToken() });
});
router.get("/singup", isNotSingin, (req, res, next) => {
  var validationMassage = req.flash("singuperror");
  res.render("singup", { massages: validationMassage, token: req.csrfToken() });
});

router.post(
  "/singup",
  [
    check("userName").notEmpty().withMessage("please enter your name"),
    check("userBorn").notEmpty().withMessage("please enter your born date"),
    check("userEmail").notEmpty().withMessage("please enter your emil"),
    check("userEmail").isEmail().withMessage("please enter your emil"),
    check("userPassword").notEmpty().withMessage("please enter your password"),
    check("userPassword")
      .isLength({ min: 5 })
      .withMessage("your password is short"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var massageError = [];
      for (var i = 0; i < errors.errors.length; i++) {
        massageError.push(errors.errors[i].msg);
      }
      req.flash("singuperror", massageError);
      res.redirect("singup");
      return;
    }
    next();
  },
  passPort.authenticate("local-singup", {
    session: false,
    successRedirect: "login",
    failureRedirect: "singup",
    failureMessage: true,
    
  }),
);
router.get("/profile", isSingin, (req, res, next) => {
  if (req.user.cart) {
    totalproduct = req.user.cart.totalNumber;
  } else {
    totalproduct = 0;
  }
Order.find({user : req.user._id},(err , result)=>{
  if(err){
    console.log(err);
    
  }
  console.log(result);
  console.log(req.user.cart);
  
  res.render("profile", {
    checkUser: true,
    checkProfile: req.isAuthenticated(),
    totalproduct: totalproduct,
    order : result,

  })
}).lean();
 
});
router.get("/contact", (req, res, next) => {
  res.render("contact");
});
router.post(
  "/login",
  [
    check("email").notEmpty().withMessage("please enter your emil"),
    check("email").isEmail().withMessage("please enter valid emil"),
    check("password").notEmpty().withMessage("please enter your password"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var massageError = [];
      for (var i = 0; i < errors.errors.length; i++) {
        massageError.push(errors.errors[i].msg);
      }
      req.flash("singinerror", massageError);
      res.redirect("login");
      return;
    }
    next();
  },
  passPort.authenticate("local-singin", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/logout", (req, res, next) => {
  req.logOut();
  res.redirect("/");
});
router.get("/cart/:name/:id/:price", isSingin, (req, res, next) => {
 /*cart.deleteMany((err, doc)=>{
    if(err){

    }
    console.log(doc);
    
  })

*/
  const cartId = req.user.id;

  const newProductPrice = parseInt(req.params.price, 10);

  const newProduct = {
    _id: req.params.id,
    name: req.params.name,
    price:parseInt(newProductPrice , 10) ,
    quntaty: 1,
  };
  // search cart
  cart.findById(cartId, (error, Cart) => {
    if (error) {
      console.log(error);
    }
    // dont have cart
    if (!Cart) {
      const newcart = new cart({
        _id: cartId,
        totalPrice: newProductPrice,
        totalNumber: 1,
        _selectCard: [newProduct] ,
      });
      newcart.save((err, doc) => {
        if (err) {
          console.log(err);
        }
        console.log(doc);
      });
    }
    // الزول دا اختار منتج مسبقا
    if (Cart) {
        var indexOfproduct = -1;
        for (var i = 0; i<Cart._selectCard.length; i++) {
          if (req.params.id === Cart._selectCard[i]._id) {
            indexOfproduct = i;
            break;
          }
        }
        if (indexOfproduct>= 0) {
          Cart._selectCard[indexOfproduct].price =
            Cart._selectCard[indexOfproduct].price +
           newProductPrice;
          Cart._selectCard[indexOfproduct].quntaty =
            Cart._selectCard[indexOfproduct].quntaty + 1;
          Cart.totalNumber =
            Cart.totalNumber + 1;
          Cart.totalPrice =
            Cart.totalPrice + newProductPrice;
          cart.updateOne({ _id: cartId }, { $set: Cart }, (err, doc) => {
            if (err) {
              console.log(err);
            }
            console.log(Cart);
            
          });
          console.log(Cart);
        }
      else{
        cart._selectCard = Cart._selectCard.push(newProduct) ,
        Cart.totalNumber = Cart.totalNumber + 1;
        Cart.totalPrice = Cart.totalPrice + newProductPrice;
        cart.updateOne({ _id: cartId }, { $set: Cart }, (err, doc) => {
          if (err) {
            console.log(err);
          }
          console.log(Cart);
          
          
        });
      }
     
      }
  });

  res.redirect("/");
});
router.get('/shoping', (req,res,next)=>{

  // chech user log in
  if(!req.isAuthenticated()){
    res.redirect('/login')
    return;
  }
  //check user have cart 
  if(!req.user.cart){
    res.redirect('/')
    return;
  }
  if(req.user.cart.totalNumber = 0 ){
    res.redirect('/')
    return ;
  }
  const usercart = req.user.cart ;
  const totalPrice = req.user.cart.totalPrice ;
  res.render('shoping' ,{usercart :usercart , totalPrice:totalPrice ,checkUser :true ,totalproduct:req.user.cart.totalNumber})
});
router.get("/addproduct/:index", (req, res, next) => {
  const index = req.params.index;
  const selectproduct = req.user.cart ;
  const cartPrice = selectproduct._selectCard[index].price/selectproduct._selectCard[index].quntaty
  selectproduct._selectCard[index].quntaty = selectproduct._selectCard[index].quntaty+1;
  selectproduct._selectCard[index].price = selectproduct._selectCard[index].price +cartPrice ;
  selectproduct.totalNumber = selectproduct.totalNumber+ 1;
  selectproduct.totalPrice = selectproduct.totalPrice + cartPrice
  cart.updateOne({_id : selectproduct._id},{$set:selectproduct} ,(err ,doc)=>{
    if(err){
      console.log(err);
    }
    console.log(doc);
    
  })
  
 
 res.redirect('/shoping')
});
router.get("/cutproduct/:index", (req, res, next) => {
  const index = req.params.index;
  const selectproduct = req.user.cart ;
  const cartPrice = selectproduct._selectCard[index].price/selectproduct._selectCard[index].quntaty
  selectproduct._selectCard[index].quntaty = selectproduct._selectCard[index].quntaty-1;
  selectproduct._selectCard[index].price = selectproduct._selectCard[index].price -cartPrice ;
  selectproduct.totalNumber = selectproduct.totalNumber- 1;
  selectproduct.totalPrice = selectproduct.totalPrice - cartPrice
  cart.updateOne({_id : selectproduct._id},{$set:selectproduct} ,(err ,doc)=>{
    if(err){
      console.log(err);
    }
    console.log(doc);
    
  })
  
 
 res.redirect('/shoping')
});
router.get("/deleteproduct/:index", (req, res, next) => {

  const index = req.params.index;
  const selectproduct = req.user.cart ;
  if(selectproduct._selectCard.length<=1){
    cart.deleteOne({_id : selectproduct._id}, (err ,doc)=>{
      if(err){
        console.log(err);
      }
      console.log(doc);
     
    })
    res.redirect("/shoping")
  }else{
    const cartPrice = selectproduct._selectCard[index].price/selectproduct._selectCard[index].quntaty
  
    selectproduct.totalNumber = selectproduct.totalNumber- selectproduct._selectCard[index].quntaty;
    selectproduct.totalPrice = selectproduct.totalPrice - selectproduct._selectCard[index].price
  selectproduct._selectCard.splice(index , 1)
    
    cart.updateOne({_id : selectproduct._id},{$set :selectproduct} ,(err ,doc)=>{
      if(err){
        console.log(err);
      }
     
      
      
    })
   
  }
 
 res.redirect('/shoping')
});
router.get('/checkout', (req , res , next)=>{
  const totalPrice = req.user.cart.totalPrice ;
  const errorMassge = req.flash('error')[0]
  res.render('checkout', {checkuser: req.isAuthenticated() ,
     checkprofile :req.isAuthenticated()
      ,token: req.csrfToken() ,
      totalPrice:totalPrice ,
    error : errorMassge
    })
    
    Order.deleteMany((err, doc)=>{
      if(err){
  
      }
      console.log(doc);
      
    }) 
});
router.post('/checkout' ,(req , res ,next)=>{
/*
  stripe.charges.create({
    amount : req.user.cart.totalPrice*100 ,
    currency: 'usd',
    source: "tok_mastercard",
    description: 'One-time setup fee',
  },
  function(err , charge) {
    if (err) {
      
      req.flash('error' , err.raw.message)
     res.redirect('/checkout');
      
    }
   
*/

const lastCart = req.user.cart ;
console.log(lastCart);

    
    const order = new Order({
      user : req.user._id ,
      cart : lastCart,
      name : req.body.name ,
      adress : req.body.adr ,
      orderprice : req.user.cart.totalPrice,
      /*
      paymentid : charge.id ,
      */
     paymentid : req.user._id

    });
    order.save((err , result )=>{
      if(err){
        console.log(err);
      }
      console.log('result'+result);
      

      cart.deleteOne({_id : req.user.cart._id },(err ,doc)=>{
        if(err){
        console.log(err);
      }
      res.redirect('/')
    })
      
      req.flash('scucsse' , 'sucassful to bought proudct')
     
    })
    
   
  

  
})





function isSingin(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
    return;
  }
  next();
}

function isNotSingin(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
    return;
  }
  next();
}

module.exports = router;
