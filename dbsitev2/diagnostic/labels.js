module.exports = function(){
    var express = require('express');
    var router = express.Router();



    function getLabels(res, mysql, context, complete){
        mysql.pool.query("SELECT label_id as id, name, HQ_city FROM labels", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.labels  = results;
            complete();
        });
    }



    function getLabel(res, mysql, context, id, complete){
        var q = "SELECT label_id as id, name, HQ_city FROM labels WHERE label_id = ?";
        var inserts = [id];
        mysql.pool.query(q, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.labels = results[0];
            complete();
        });
    }

    /*Display all labels */

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteLabel.js"];
        var mysql = req.app.get('mysql');
        getLabels(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('labels', context);
            }
        }
    });



    /* Display one label for the specific purpose of updating labels */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateLabel.js"];
        var mysql = req.app.get('mysql');
        getLabel(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update_labels', context);
            }

        }
    });

    /* Adds a label, redirects to the labels page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var q = "INSERT INTO labels (name, HQ_city) VALUES (?,?)";
        var inserts = [req.body.label_name, req.body.HQ_city];
        q = mysql.pool.query(q,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/labels');
            }
        });
    });

    /* The URI that update data is sent to in order to update a label */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var q = "UPDATE labels SET name=?, HQ_city=? WHERE label_id=?";
        var inserts = [req.body.label_name, req.body.HQ_city, req.params.id];
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

    /* Route to delete a label*/

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var q = "DELETE FROM labels WHERE label_id = ?";
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
