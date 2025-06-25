const mysql = require("mysql2")
const express = require("express")
const bodyParser = require("body-parser")
const hbs = require("hbs")
const expressHbs = require("express-handlebars")
const path = require("path")
const { gunzip } = require("zlib")
const app = express()
const urlencodedParser = bodyParser.urlencoded({extended: false})

module.exports = function(app){
    app.get("/spikery", function(req, res) {
        pool.query("SELECT nazva_galuzi FROM galuzi " +
                   "ORDER BY nazva_galuzi", function(err, data) {
            if (err) return console.log(err);
            res.render("spikery.hbs", {
                spikery: data,
                zagolovok: zagolovok,
                spikery_visible: false
            });
        });
    });

    app.post("/spikery", urlencodedParser, function (req, res) {
        if (!req.body) return res.sendStatus(400);
        const nazva_galuzi = req.body.nazva_galuzi;
        pool.query(
            "SELECT \
            spikery.id_spikery, \
            spikery.id_galuzi, \
            spikery.prizvyshche, \
            spikery.imya, \
            spikery.pobatkovi, \
            galuzi.nazva_galuzi \
            FROM \
            spikery \
            Inner Join galuzi ON spikery.id_galuzi = galuzi.id_galuzi \
            WHERE \
            galuzi.nazva_galuzi = ?", [nazva_galuzi], function (err, data) {
                if (err) return console.log(err);
                res.render("spikery.hbs", {
                    spikery: data,
                    zagolovok: zagolovok,
                    spikery_visible: true,
                    nazva_galuzi: nazva_galuzi,
                });
            });
    });
    
    app.get("/spikery_create", function(req, res) {
        pool.query("SELECT\n" +
            "galuzi.id_galuzi,\n" +
            "galuzi.nazva_galuzi\n" +
            "FROM\n" +
            "galuzi\n", function(err, data) {
            if (err) return console.log(err);
            res.render("spikery_create.hbs", {
                galuzi: data,
                zagolovok: zagolovok
            });
        });
    });

    app.post("/spikery_create", urlencodedParser, function (req, res) {
        if (!req.body) return res.sendStatus(400);
        const id_galuzi = req.body.id_galuzi;
        const prizvyshche = req.body.prizvyshche;
        const imya = req.body.imya;
        const pobatkovi = req.body.pobatkovi;
        pool.query("INSERT INTO spikery (id_galuzi, prizvyshche, imya, pobatkovi) VALUES (?, ?, ?, ?)",
        [id_galuzi, prizvyshche, imya, pobatkovi], function (err, data) {
            if (err) return console.log(err);
            res.redirect("/spikery");
        })
    })





    app.get("/spikery_edit/:id_spikery", function(req, res) {
        const id_spikery = req.params.id_spikery;
        pool.query("SELECT \
            id_spikery, \
            id_galuzi, \
            prizvyshche, \
            imya, \
            pobatkovi \
        FROM \
            spikery \
        WHERE \
            id_spikery = ?", [id_spikery], function(err, data) {
            if (err) return console.log(err);
    
            pool.query("SELECT \
                galuzi.id_galuzi, \
                galuzi.nazva_galuzi \
            FROM \
                galuzi", function(err, data2) {
                if (err) return console.log(err);
    
                res.render("spikery_edit.hbs", {
                    spikery: data[0],
                    galuzi: data2,
                    zagolovok: zagolovok
                });
            });
        });
    });

    app.post("/spikery_edit", urlencodedParser, function(req, res) {
        if (!req.body) return res.sendStatus(400);
        const id_spikery = req.body.id_spikery;
        const id_galuzi = req.body.id_galuzi;
        const prizvyshche = req.body.prizvyshche;
        const imya = req.body.imya;
        const pobatkovi = req.body.pobatkovi;
        
        pool.query("UPDATE spikery SET id_galuzi=?, prizvyshche=?, imya=?, pobatkovi=? WHERE id_spikery=?", 
        [id_galuzi, prizvyshche, imya, pobatkovi, id_spikery], function(err, data) {
            if (err) return console.log(err);
            res.redirect("/spikery");
        });
    });

    app.post("/spikery_delete/:id_spikery", function(req, res) {
        const id_spikery = req.params.id_spikery;
        
        pool.query("DELETE FROM spikery WHERE id_spikery=?", [id_spikery], function(err, data) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.redirect("/spikery");
        });
    });
}


