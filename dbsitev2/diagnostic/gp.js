module.exports = function(){
    var express = require('express');
    var router = express.Router();


<!--//////////////////////// SQL Queries/Functions ////////////////////////-->

    function getVenues(res, mysql, context, complete){
        mysql.pool.query("SELECT venue_id as id, name FROM venues", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.venues  = results;
            complete();
        });
    }


    function getPlayers(res, mysql, context, complete){
        mysql.pool.query("SELECT guitar_players.player_id as id, fname, lname, venues.name AS fav_venue, guitar_type FROM guitar_players INNER JOIN venues ON fav_venue = venues.venue_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players = results;
            complete();
        });
    }

    function getPlayersbyVenue(req, res, mysql, context, complete){
      var query = "SELECT guitar_players.player_id as id, fname, lname, venues.name AS fav_venue FROM guitar_players INNER JOIN venues ON fav_venue = venues.venue_id WHERE guitar_players.fav_venue = ?";
      console.log(req.params)
      var inserts = [req.params.venue]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players = results;
            complete();
        });
    }

    /* Find players whose fname starts with a given string in the req */
    function getPlayersWithNameLike(req, res, mysql, context, complete) {
      var q = "SELECT guitar_players.player_id as id, fname, lname, venues.name AS fav_venue FROM guitar_players INNER JOIN venues ON fav_venue = venues.venue_id WHERE guitar_players.fname LIKE " + mysql.pool.escape(req.params.s + '%');
      mysql.pool.query(q, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players = results;
            complete();
        });
    }

    function getPlayer(res, mysql, context, id, complete){
        var sql = "SELECT player_id as id, fname, lname, guitar_type, fav_venue FROM guitar_players WHERE player_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.player = results[0];
            complete();
        });
    }

  <!--//////////////////////// ROUTES ////////////////////////-->

    /*Display all guitar players from the main route. Requires Javascript to delete users with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletePlayer.js","filterPlayer.js","searchPlayer.js"];
        var mysql = req.app.get('mysql');
        getPlayers(res, mysql, context, complete);
        getVenues(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('gp', context);
            }

        }
    });

    /*Display all guitar players from a given most played venue. Requires Javascript to delete users with AJAX*/
    router.get('/filter/:venue', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletePlayer.js","filterPlayer.js","searchPlayer.js"];
        var mysql = req.app.get('mysql');
        getPlayersbyVenue(req,res, mysql, context, complete);
        getVenues(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('gp', context);
            }

        }
    });

    /*Display all guitar players whose name starts with a given string. Requires Javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletePlayer.js","filterPlayer.js","searchPlayer.js"];
        var mysql = req.app.get('mysql');
        getPlayersWithNameLike(req, res, mysql, context, complete);
        getVenues(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('gp', context);
            }
        }
    });

    /* Display one guitar player for the specific purpose of updating guitar players */
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedVenue.js", "updatePlayer.js"];
        var mysql = req.app.get('mysql');
        getPlayer(res, mysql, context, req.params.id, complete);
        getVenues(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update_gp', context);
            }

        }
    });

    /* Adds a player, redirects to the gp page after adding */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var q = "INSERT INTO guitar_players (fname, lname, guitar_type, fav_venue) VALUES (?,?,?,?)";
        var inserts = [req.body.fname, req.body.lname, req.body.guitar_type, req.body.fav_venue];
        q = mysql.pool.query(q,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/gp');
                console.log("A player was entered into the DB");
            }
        });
    });

    /* The URI that update data is sent to in order to update a player */
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var q = "UPDATE guitar_players SET fname=?, lname=?, guitar_type=?, fav_venue=? WHERE player_id=?";
        var inserts = [req.body.fname, req.body.lname, req.body.guitar_type, req.body.fav_venue, req.params.id];
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

    /* Route to delete a player. Handled with AJAX. */
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var q = "DELETE FROM guitar_players WHERE player_id = ?";
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
