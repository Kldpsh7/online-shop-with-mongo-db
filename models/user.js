const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    cart:{
        items:[
            {
                productId:{
                    type:Schema.Types.ObjectId, 
                    ref:'Product', 
                    required:true
                },
                quantity:{
                    type:Number,
                    required:true
                }
            }
        ]
    }
},
{  timestamps: true, toJSON: { virtuals: true } }
);

userSchema.methods.addToCart = function(product){
    const cartProduct = this.cart.items.findIndex(cp=>{
        return cp.productId.toString()===product._id.toString()
    });
    if(cartProduct>-1){
        this.cart.items[cartProduct].quantity+=1;
    }
    else{
        this.cart.items = [...this.cart.items,{productId: product._id,quantity:1}];
    }
    return this.save();
}

userSchema.methods.removeFromCart = function(prodId){
    const updatedCartItems = this.cart.items.filter(item=>{
        return item.productId.toString()!==prodId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

module.exports = mongoose.model('User',userSchema);

// const mongodb = require('mongodb');

// class User{
//     constructor(name,email,phone,cart,id){
//         this.name=name;
//         this.email=email;
//         this.phone=phone;
//         this.cart=cart;
//         this._id=id;
//     }

//     save(){
//         const db = getDb();
//         return db.collection('users').insertOne(this)
//         .then(res=>console.log(res))
//         .catch(err=>console.log(err))
//     }

//     addToCart(product){
//         const cartProduct = this.cart.items.findIndex(cp=>{
//             return cp.productId.toString()===product._id.toString()
//         });
//         const db = getDb();
//         let updatedCart = this.cart
//         if(cartProduct>-1){
//             updatedCart.items[cartProduct].quantity+=1;
//         }
//         else{
//             updatedCart = {items:[...updatedCart.items,{productId: new mongodb.ObjectId(product._id),quantity:1}]};
//         }
//         return db.collection('users').updateOne(
//             {_id:new mongodb.ObjectId(this._id)},
//             { $set : {cart:updatedCart}}
//             );
//     }

//     getCart(){
//         const db = getDb();
//         const productIds = this.cart.items.map(i=>{
//             return i.productId;
//         });
//         return db.collection('products').find({_id:{$in:productIds}}).toArray()
//         .then(products=>{
//             return products.map(p=>{
//                 return {...p,
//                     quantity:this.cart.items.find(i=>{
//                     return i.productId.toString()===p._id.toString();
//                     }).quantity
//                 }
//             })
//         })
//         .catch(err=>console.log(err))
//     }

//     deleteCartItem(prodId){
//         const cartProduct = this.cart.items.findIndex(cp=>{
//             return cp.productId.toString()===prodId.toString()
//         });
//         const db = getDb();
//         let updatedCart = this.cart
//         updatedCart.items.splice(cartProduct,1);
//         return db.collection('users').updateOne(
//             {_id:new mongodb.ObjectId(this._id)},
//             { $set : {cart:updatedCart}}
//             );
//     }

//     addOrder(){
//         const db = getDb();
//         return this.getCart().then(products=>{
//             const order = {
//                 items:products,
//                 user:{
//                     _id:new mongodb.ObjectId(this._id),
//                     name:this.name
//                 }
//             }
//             return db.collection('orders').insertOne(order)
//         })
//         .then(result=>{
//             this.cart= {items:[]};
//             return db.collection('users').updateOne(
//                 {_id:new mongodb.ObjectId(this._id)},
//                 { $set : {cart:{items:[]}}}
//                 );
//         })
//         .catch(err=>console.log(err));
//     }

//     getOrders(){
//         const db = getDb();
//         return db.collection('orders').find({'user._id':new mongodb.ObjectId(this._id)}).toArray();
//     }

//     static findById(userId){
//         const db = getDb();
//         return db.collection('users').find({_id:new mongodb.ObjectId(userId)}).next()
//         .then()
//         .catch(err=>{
//             console.log(err)
//         })
//     }
// }

// module.exports = User;