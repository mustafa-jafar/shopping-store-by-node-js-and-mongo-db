const mongoose = require('mongoose');
const schema = mongoose.Schema ;
const orderschema = mongoose.Schema({
    user : {
        type : schema.Types.ObjectId ,
        ref : 'User',
        required : true
    },
    cart :{
        type : {} ,
        required : true 
    },
    name :{
        type : String ,
        required : true 
    },
    adress :{
        type : String ,
        required : true 
    },
    paymentid :{
        type : String ,
        required : true 
    },
    orderprice :{
        type : String ,
        required : true 
    },


});



module.exports = mongoose.model('Order' , orderschema);