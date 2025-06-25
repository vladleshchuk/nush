const mysql = require("mysql2")
const express = require("express")
const bodyParser = require("body-parser")
const hbs = require("hbs")
const expressHbs = require("express-handlebars")
const path = require("path")
const app = express()
const urlencodedParser = bodyParser.urlencoded({extended: false})

app.use(express.static('img'))

const zagolovok = "New Ukrainian School"

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "nush",
    password: ""
})

global.zagolovok = zagolovok
global.pool = pool

app.engine("hbs", expressHbs(
    {
        layoutsDir: "views",
        defaultLayout: "index",
        extname: "hbs",
        partialsDir: "views"
    }
))
app.set("view engine", "hbs")

app.get("/", function(req, res){
    res.render("start.hbs", {zagolovok})
})

const PORT = process.env.PORT || 3000
app.listen(PORT, function(){
    console.log("Server")
})





const galuzi = require('./galuzi')
galuzi(app)

const spikery = require('./spikery')
spikery(app)

const zustrichi = require('./zustrichi')
zustrichi(app)