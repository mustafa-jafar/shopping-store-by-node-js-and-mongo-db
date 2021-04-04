const mongoose = require('mongoose') ;

const productschema = mongoose.Schema({
    title : {
        required : true ,
        type : String ,
    },
    Price : {
        required : true ,
        type : Number ,
    },
    images : {
        required : true ,
        type : String ,
    },
    information : {
        required : true ,
        type : String
        
    },
});


module.exports = mongoose.model('product' , productschema );