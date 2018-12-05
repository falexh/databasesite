module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* get people to populate in dropdown */
    function getPlayers(res, mysql, context, complete){
        mysql.pool.query("SELECT player_id AS pid, fname, lname FROM guitar_players", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players = results;
            complete();
        });
    }

    /* get certificates to populate in dropdown */
    function getBands(res, mysql, context, complete){
        sql = "SELECT band_id AS bid, name FROM bands";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.bands = results
            complete();
        });
    }

    /* get people with their certificates */
    /* TODO: get multiple certificates in a single column and group on
     * fname+lname or id column
     */
    function getPlayersWithBands(res, mysql, context, complete){
        sql = "SELECT pid, bid, CONCAT(fname,' ',lname) AS player_name, bands.name AS band_name FROM guitar_players INNER JOIN bands_players on guitar_players.player_id = bands_players.pid INNER JOIN bands on bands.band_id = bands_players.bid ORDER BY player_name, band_name";
         mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.players_with_bands = results
            complete();
        });
    }


    /* List people with certificates along with
     * displaying a form to associate a person with multiple certificates
     */
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletePlayer.js"];
        var mysql = req.app.get('mysql');
        var handlebars_file = 'players_bands'

        getPlayers(res, mysql, context, complete);
        getBands(res, mysql, context, complete);
        getPlayersWithBands(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render(handlebars_file, context);
            }
        }
    });

    /* Associate certificate or certificates with a person and
     * then redirect to the people_with_certs page after adding
     */
    router.post('/', function(req, res){
        console.log("We get the multi-select certificate dropdown as ", req.body.bands)
        var mysql = req.app.get('mysql');
        var bands = req.body.bands
        var player = req.body.pid
        for (let band of bands) {
          console.log("Processing band id " + band)
          var q = "INSERT INTO bands_players (pid, bid) VALUES (?,?)";
          var inserts = [player, band];
          q = mysql.pool.query(q, inserts, function(error, results, fields){
            if(error){
                console.log(error)
            }
          });
        }
        res.redirect('/players_bands');
    });

    /* Delete a person's certification record */
    /* This route will accept a HTTP DELETE request in the form
     * /pid/{{pid}}/cert/{{cid}} -- which is sent by the AJAX form
     */
    router.delete('/pid/:pid/band/:bid', function(req, res){
        var mysql = req.app.get('mysql');
        var q = "DELETE FROM bands_players WHERE pid = ? AND bid = ?";
        var inserts = [req.params.pid, req.params.bid];
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
