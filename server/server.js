const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const mongoose = require('mongoose')
const { User } = require('./models/user')

require('dotenv').config()

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true}, (error, res) => {
    if (error) {
        throw error
    }
    else {
        console.log("Estoy escuchando Base de datos")
    }
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

app.post('/api/users/register', (req, res)=> {
   const user = new User(req.body)
   user.save((err, doc) => {
    if(err) return res.json({success: false, err})
    res.status(200).json({
        success: true,
        userdata: doc
    })
   })
})
    
app.post('/api/users/login', (req, res) => {
    // 1. Encuentra el correo
        User.findOne({'email': req.body.email}, (err,user) => {
            if(!user) return res.json({loginSuccess: false, message: 'Auth fallida, email no encontrado'})

    // 2. Obtén el password y compruébalo
    user.comparePassword(req.body.password, (err, isMatch) => {
        if(!isMatch) return res.json({loginSuccess: false, message: "Password erróneo"})
    })
    // 3. Si todo es correcto, genera un token
    user.generateToken((err, user)=> {
        if(err) return res.status(400).send(err)
            // Si todo bien, debemos guardar este token como un "cookie"
            res.cookie('guitarshop_auth', user.token).status(200).json(
                    {loginSuccess: true}
                )
            })
        })
    })





const port = process.env.PORT || 3002

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})