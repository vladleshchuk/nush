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

    app.get("/zustrichi", function(req, res) {
        res.render("zustrichi.hbs", {
            zagolovok: zagolovok,
            zustrichi_visible: false
        });
    });

    app.post("/zustrichi", urlencodedParser, function (req, res) {
        if (!req.body) return res.sendStatus(400);
        const data_pochatku = req.body.data_pochatku;
        const data_zakinchennya = req.body.data_zakinchennya;
        pool.query("SELECT \
            zustrichi.id_zustrichi, \
            zustrichi.nazva_zustrichi, \
            concat(spikery.prizvyshche, ' ', Left(spikery.imya,1), '.', Left(spikery.pobatkovi,1), '.') as prizvyshche, \
            DATE_FORMAT(zustrichi.data_pochatku, '%d.%m.%Y') AS data_pochatku, \
            DATE_FORMAT(zustrichi.data_zakinchennya, '%d.%m.%Y') AS data_zakinchennya, \
            (zustrichi.data_zakinchennya-zustrichi.data_pochatku) AS truvalist, \
            zustrichi.id_spikery \
          FROM \
            zustrichi \
          Inner Join spikery ON zustrichi.id_spikery = spikery.id_spikery \
          WHERE \
            zustrichi.data_pochatku >= ? AND \
            zustrichi.data_zakinchennya <= ?", [data_pochatku, data_zakinchennya], function (err, data) {
            if (err) return console.log(err);
            res.render("zustrichi.hbs", {
              zustrichi: data,
              zagolovok: zagolovok,
              zustrichi_visible: true,
              data_pochatku: data_pochatku,
              data_zakinchennya: data_zakinchennya,
            });
          });
      });

      app.get("/zustrichi_create", function(req, res) {
        pool.query("SELECT\n" +
            "spikery.id_spikery,\n" +
            "spikery.prizvyshche\n" +
            "FROM\n" +
            "spikery\n", function(err, data) {
            if (err) return console.log(err);
            res.render("zustrichi_create.hbs", {
                spikery: data,
                zagolovok: zagolovok
            });
        });
    });

    app.post("/zustrichi_create", urlencodedParser, function (req, res) {
        if (!req.body) return res.sendStatus(400);
        const id_spikery = req.body.id_spikery;
        const nazva_zustrichi = req.body.nazva_zustrichi;
        const data_pochatku = req.body.data_pochatku;
        const data_zakinchennya = req.body.data_zakinchennya;
        pool.query("INSERT INTO zustrichi (id_spikery, nazva_zustrichi, data_pochatku, data_zakinchennya) VALUES (?, ?, ?, ?)",
        [id_spikery, nazva_zustrichi, data_pochatku, data_zakinchennya], function (err, data) {
            if (err) return console.log(err);
            res.redirect("/zustrichi");
        })
    })

    app.get("/zustrichi_edit/:id_zustrichi", function(req, res) {
        const id_zustrichi = req.params.id_zustrichi;
        pool.query("SELECT \
            id_zustrichi, \
            id_spikery, \
            nazva_zustrichi, \
            DATE_FORMAT(zustrichi.data_pochatku,'%Y-%m-%d') AS data_pochatku, \
            DATE_FORMAT(zustrichi.data_zakinchennya, '%Y-%m-%d') AS data_zakinchennya \
        FROM \
            zustrichi \
        WHERE \
            id_zustrichi = ?", [id_zustrichi], function(err, data) {
            if (err) return console.log(err);
    
            pool.query("SELECT \
                galuzi.id_galuzi, \
                galuzi.nazva_galuzi \
            FROM \
                galuzi", function(err, data2) {
                if (err) return console.log(err);
    
                res.render("zustrichi_edit.hbs", {
                    zustrichi: data[0],
                    galuzi: data2,
                    zagolovok: zagolovok
                });
            });
        });
    });

    app.post("/zustrichi_edit", urlencodedParser, function(req, res) {
        if (!req.body) return res.sendStatus(400);
        const id_zustrichi = req.body.id_zustrichi;
        const id_spikery = req.body.id_spikery;
        const nazva_zustrichi = req.body.nazva_zustrichi;
        const data_pochatku = req.body.data_pochatku;
        const data_zakinchennya = req.body.data_zakinchennya;
        
        pool.query("UPDATE zustrichi SET id_spikery=?, nazva_zustrichi=?, data_pochatku=?, data_zakinchennya=? WHERE id_zustrichi=?", 
        [id_spikery, nazva_zustrichi, data_pochatku, data_zakinchennya, id_zustrichi], function(err, data) {
            if (err) return console.log(err);
            res.redirect("/zustrichi");
        });
    });

    app.post("/zustrichi_delete/:id_zustrichi", function(req, res) {
        const id_zustrichi = req.params.id_zustrichi;
        
        pool.query("DELETE FROM zustrichi WHERE id_zustrichi=?", [id_zustrichi], function(err, data) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.redirect("/zustrichi");
        });
    });
}