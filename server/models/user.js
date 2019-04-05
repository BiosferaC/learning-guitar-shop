const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_I = 10

const userSchema = mongoose.Schema({ 
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 100
    },        
    cart: {
        type: Array,
        default: []
    },         
    history:{
        type: Array,
        default:[]
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    }

})

//MIDDLEWARE

userSchema.pre('save', function(next){
    const user = this
    if(user.isModified(this.password)){
        bcrypt.genSalt(SALT_I, function(err, salt) {
            if(err) return next(err)
        bcrypt.hashSync(this.password, 10)
        next()
        })
    }
    this.password = bcrypt.hashSync(this.password, 10)
    next()
})
/*userSchema.pre('save', function(next){
    var user = this
    if(user.isModified('password')){
        bcrypt.genSalt(SALT_I, function(err, salt){
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()           
            })
        })
    } else {
        next()
    }
})*/

// (nombre modelo en singular, schema, la colección de la BD)
const User = mongoose.model('User', userSchema, "users")
    
    module.exports = { User }