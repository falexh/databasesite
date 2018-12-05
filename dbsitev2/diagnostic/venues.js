module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getVenues(res, mysql, context, complete){
        mysql.pool.query("SELECT venue_id as id, name, max_seating, city FROM venues", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.venues  = results;
            complete();
        });
    }

    function getVenue(res, mysql, context, id, complete){
        var sql = "SELECT venue_id as id, name, max_seating, city FROM venues WHERE venue_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.venues = results[0];
            complete();
        });
    }

    /*Display all venues*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteVenue.js"];
        var mysql = req.app.get('mysql');
        getVenues(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('venues', context);
            }
        }
    });

    /* Display one venue for the specific purpose of updating venues */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateVenue.js"];
        var mysql = req.app.get('mysql');
        getVenues(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update_venues', context);
            }
        }
    });

    /* Adds a venue, redirects to the venue page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var q = "INSERT INTO venues (name,max_seating,city) VALUES (?,?,?)";
        var inserts = [req.body.venue_name, req.body.max_seating, req.body.city];
        q = mysql.pool.query(q,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/venues');
            }
        });
    });

    /* The URI that update data is sent to in order to update a venue */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var q = "UPDATE venues SET name=?, max_seating=?, city=? WHERE venue_id=?";
        var inserts = [req.body.venue_name, req.body.max_seating, req.body.city, req.params.id];
        q = mysql.pool.query(q,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a venue */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var q = "DELETE FROM venues WHERE venue_id = ?";
        var inserts = [req.params.id];
        q = mysql.pool.query(q, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
