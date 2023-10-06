const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User{
    constructor(name,email,phone,cart,id){
        this.name=name;
        this.email=email;
        this.phone=phone;
        this.cart=cart;
        this._id=id;
    }

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this)
        .then(res=>console.log(res))
        .catch(err=>console.log(err))
    }

    addToCart(product){
        const cartProduct = this.cart.items.findIndex(cp=>{
            return cp.productId.toString()===product._id.toString()
        });
        const db = getDb();
        let updatedCart = this.cart
        if(cartProduct>-1){
            updatedCart.items[cartProduct].quantity+=1;
        }
        else{
            updatedCart = {items:[...updatedCart.items,{productId: new mongodb.ObjectId(product._id),quantity:1}]};
        }
        return db.collection('users').updateOne(
            {_id:new mongodb.ObjectId(this._id)},
            { $set : {cart:updatedCart}}
            );
    }

    getCart(){
        const db = getDb();
        const productIds = this.cart.items.map(i=>{
            return i.productId;
        });
        return db.collection('products').find({_id:{$in:productIds}}).toArray()
        .then(products=>{
            return products.map(p=>{
                return {...p,
                    quantity:this.cart.items.find(i=>{
                    return i.productId.toString()===p._id.toString();
                    }).quantity
                }
            })
        })
        .catch(err=>console.log(err))
    }

    deleteCartItem(prodId){
        const cartProduct = this.cart.items.findIndex(cp=>{
            return cp.productId.toString()===prodId.toString()
        });
        const db = getDb();
        let updatedCart = this.cart
        updatedCart.items.splice(cartProduct,1);
        return db.collection('users').updateOne(
            {_id:new mongodb.ObjectId(this._id)},
            { $set : {cart:updatedCart}}
            );
    }

    static findById(userId){
        const db = getDb();
        return db.collection('users').find({_id:new mongodb.ObjectId(userId)}).next()
        .then()
        .catch(err=>{
            console.log(err)
        })
    }
}

module.exports = User;