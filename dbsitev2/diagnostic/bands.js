module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getLabels(res, mysql, context, complete){
        mysql.pool.query("SELECT label_id as id, name FROM labels", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.labels  = results;
            complete();
        });
    }


    function getBands(res, mysql, context, complete){
        mysql.pool.query("SELECT bands.band_id as id, bands.name AS name, labels.name AS label, hometown FROM bands INNER JOIN labels ON label = labels.label_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.bands = results;
            complete();
        });
    }



    function getBandsbyLabel(req, res, mysql, context, complete){
      var query = "SELECT bands.band_id as id, bands.name AS name, labels.name AS label, hometown FROM bands INNER JOIN labels ON label = labels.label_id WHERE bands.label = ?";
      console.log(req.params)
      var inserts = [req.params.label]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.bands = results;
            complete();
        });
    }

    function getBand(res, mysql, context, id, complete){
        var sql = "SELECT band_id as id, name, label, hometown FROM bands WHERE band_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.band = results[0];
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteBand.js","filterBand.js"];
        var mysql = req.app.get('mysql');
        getBands(res, mysql, context, complete);
        getLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('bands', context);
            }

        }
    });

    /*Display all bands based on their labels.*/
    router.get('/filter/:label', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteBand.js","filterBand.js"];
        var mysql = req.app.get('mysql');
        getBandsbyLabel(req,res, mysql, context, complete);
        getLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('bands', context);
            }

        }
    });



    /* Display one band for the specific purpose of updating bands */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedLabel.js", "updateBand.js"];
        var mysql = req.app.get('mysql');
        getBand(res, mysql, context, req.params.id, complete);
        getLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update_bands', context);
            }

        }
    });

    /* Adds a band, redirects to the bands page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var q = "INSERT INTO bands (name, label, hometown) VALUES (?,?,?)";
        var inserts = [req.body.name, req.body.label, req.body.hometown];
        q = mysql.pool.query(q,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/bands');
            }
        });
    });

    /* The URI that update data is sent to in order to update a band */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var q = "UPDATE bands SET name=?, label=?, hometown=? WHERE band_id=?";
        var inserts = [req.body.name, req.body.label, req.body.hometown, req.params.id];
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

    /* Route to delete a band. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var q = "DELETE FROM bands WHERE band_id = ?";
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
