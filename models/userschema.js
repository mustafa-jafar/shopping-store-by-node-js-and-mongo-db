const mongoose = require('mongoose');
const bycrpt = require('bcrypt');
 const UserSchema = mongoose.Schema({
    userName :{
        type : String ,
        required :true
    },
    userBorn :{
         type : String ,
         required : true
     },
     userEmail :{
         type : String ,
         required :true
     },
     userPassword :{
        type : String ,
        required :true
    },
 });



 UserSchema.methods.hashpassword = function(userPassword){
     return bycrpt.hashSync(userPassword , bycrpt.genSaltSync(5) , null)
 }
 UserSchema.methods.comparepassword = function(userPassword){
    return bycrpt.compareSync(userPassword  , this.userPassword)
}
 module.exports = mongoose.model('User' , UserSchema);