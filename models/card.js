const mongoose = require('mongoose') ;

const addCard = mongoose.Schema({
    _id : {
        required : true ,
        type : String ,
    },
    totalPrice : {
        required : true ,
        type : Number ,
    },
    totalNumber : {
        required : true ,
        type : Number ,
    },
    _selectCard: {
        required: true,
        type: Array,
    },
   
});


module.exports = mongoose.model('cart' ,addCard);