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
    if(err) return res.json({success: false, err} )
    res.status(200).json({
        success: true,
        userdata: doc
    })
   })
    
   
})



const port = process.env.PORT || 3002

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})