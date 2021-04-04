const mongoose = require('mongoose');
const product = require('../models/product') ;
mongoose.connect('mongodb://localhost/shoping' , {useUnifiedTopology : true , useNewUrlParser: true } ,(err)=>{
  if(err){
    console.log(err);
  }
  console.log('connect to db')
});
 /* product.deleteMany((err, doc)=>{
    if(err){

    }
    console.log(doc);
    
  })
*/

const products = [
    new product({
        title : 'flower',
        Price : 420 ,
        images : './images/flower.jpg',
        information : 'it so good to be fine'
    }),
    new product({
        title : 'dom',
        Price : 280 ,
        images : './images/dom.jpg',
        information : 'it so good to be fine'
    }),
    new product({
        title : 'furet',
        Price : 350 ,
        images : './images/furet.jpg',
        information : 'it so good to be fine'
    }),
    new product({
        title : 'road',
        Price : 270 ,
        images : './images/road.jpg',
        information : 'it so good to be fine'
    }),
    new product({
        title : 'tea',
        Price : 510 ,
        images : './images/tea.jpg',
        information : 'it so good to be fine'
    }),
    new product({
        title : 'bnana',
        Price : 800 ,
        images : './images/flower.jpg',
        information : 'it so good to be fine'
    }),



    
]

var don = 0 ;
for (let i = 0 ;i<products.length ; i++) {
    products[i].save((err , doc )=>{
        if (err) {
            console.log(err); 
        }
        
        don++
        if(don === products.length){
            mongoose.disconnect();
        }
        
        console.log(doc);
    })
    
}

