const express = require('express')
const app = express()
const cors = require('cors')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const TokenValidate = require('./TokenValidation')


app.use(cors())
app.use(express.json())

let dbcon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'competitive'
})


app.post('/api/login', (req, res)=>{

    let username = req.body.username
    let password = req.body.password

    console.log(username)
    console.log(password)

    dbcon.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password] ,(err, user)=>{
        if(err) throw err

        if(user.length > 0){
            let token = jwt.sign({username: username}, 'secret', {expiresIn: '2hrs'})
            res.json({success: true, token: token})
        }else{
            res.json({success: false})
        }
    })
})

app.post("/api/register", (req, res)=>{

    let username = req.body.username
    let password = req.body.password
    let confirm_password = req.body.confirm_password

    if(password == confirm_password){
        dbcon.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user)=>{

            if(err) throw err

            if(user.length > 0){
                res.json({has_already: true})
            }else{
                dbcon.query("INSERT INTO users(username, password) VALUES (?, ?)", [username, password],  (err, inserted)=>{
                    if(err) throw err

                    let token = jwt.sign({username: username}, 'secret', {expiresIn: '2hrs'})
                    res.json({registered: true, token: token})
                })
            }
        })
    }
})

app.get("/api/user", TokenValidate ,(req, res)=>{
    let user = req.user
    

    res.json(user)
})


app.listen(3001, ()=>{
    console.log("Server is running on port 3001")
})