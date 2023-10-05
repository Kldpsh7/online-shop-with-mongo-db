const mongodb = require('mongodb');
const getDB = require('../util/database');

class User{
    constructor(name,email,phone,password,id){
        this.name=name;
        this.email=email;
        this.phone=phone;
        this.password=password;
    }

    save(){
        const db = getDB();
        return db.collection('users').insertOne(this)
        .then(res=>console.log(res))
        .catch(err=>console.log(err))
    }

    static findById(userId){
        const db = getDB();
        return db.collection('users').find({_id:new mongodb.ObjectId(userId)}).next()
        .then(user=>{
            console.log(user)
        })
        .catch(err=>{
            console.log(err)
        })
    }
}