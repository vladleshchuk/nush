const mysql = require("mysql2")
const express = require("express")
const bodyParser = require("body-parser")
const hbs = require("hbs")
const expressHbs = require("express-handlebars")
const path = require("path")
const { gunzip } = require("zlib")
const app = express()
const urlencodedParser = bodyParser.urlencoded({extended: false})

zagolovok = global.zagolovok
pool = global.pool

module.exports = function(app){

    app.get("/galuzi", function(req, res){
        pool.query("SELECT\n" +
            "galuzi.id_galuzi, \n" +
            "galuzi.nazva_galuzi, \n" +
            "galuzi.opys\n" +
            "FROM\n" +
            "galuzi\n", function(err, data) {
                if (err) return console.log(err)
                    res.render("galuzi.hbs", {
                galuzi: data,
                zagolovok: zagolovok
                })
            })
    })
    
    app.get("/create", function(req, res){
        res.render("create.hbs", {
            zagolovok: zagolovok
        })
    })
    
    app.post("/create", urlencodedParser, function (req, res) {
        if (!req.body) return res.sendStatus(400);
        const nazva_galuzi = req.body.nazva_galuzi;
        const opys = req.body.opys;
        pool.query("INSERT INTO galuzi (nazva_galuzi, opys) VALUES (?, ?)",
        [nazva_galuzi, opys], function (err, data) {
            if (err) return console.log(err);
            res.redirect("/galuzi");
        })
    })
    
    app.get("/edit/:id_galuzi", function(req, res) {
        const id_galuzi = req.params.id_galuzi;
        pool.query("SELECT\n" +
            "galuzi.id_galuzi,\n" +
            "galuzi.nazva_galuzi,\n" +
            "galuzi.opys\n" +
            "FROM\n" +
            "galuzi WHERE id_galuzi=?", [id_galuzi], function(err, data) {
            if(err) return console.log(err);
            res.render("edit.hbs", {
                galuzi: data[0],
                zagolovok: zagolovok
            })
        })
    })
    
    
    app.post("/edit", urlencodedParser, function (req, res) {
        
        if (!req.body) return res.sendStatus(400);
        const nazva_galuzi = req.body.nazva_galuzi;
        const opys = req.body.opys;
        const id_galuzi = req.body.id_galuzi;
    
        pool.query("UPDATE galuzi SET nazva_galuzi=?, opys=? WHERE id_galuzi=?", 
            [nazva_galuzi, opys, id_galuzi], function (err, data) {
            if (err) return console.log(err);
            res.redirect("/galuzi");
        })
    })
    
    app.post("/delete/:id_galuzi", function(req, res) {
        const id_galuzi = req.params.id_galuzi;
        pool.query("DELETE FROM galuzi WHERE id_galuzi=?", [id_galuzi], function(err, data) {
            if (err) return console.log(err);
            res.redirect("/galuzi");
        })
    })
}