var express    = require("express"),
    mysql      = require("./dbcon.js"),
    bodyParser = require("body-parser"),
    app        = express(),
    handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use("/static", express.static("public"));
app.set("view engine", "handlebars");
app.set("port",process.argv[2]);
app.set("mysql",mysql);

app.use("/players_bands", require("./players_bands.js"));
app.use("/gp", require("./gp.js"));
app.use("/venues", require("./venues.js"));
app.use("/labels", require("./labels.js"));
app.use("/bands", require("./bands.js"));
app.use("/", express.static("public"));


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

/******** LISTEN *********/
app.listen(app.get("port"), function(){
    console.log("Server has started on http://localhost:"+app.get("port"));
});
