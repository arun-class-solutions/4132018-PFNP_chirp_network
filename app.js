//Require modules and models

var express = require("express");
var models = require("./models/index");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var app = express();

//Set view engine

app.set("view engine", "ejs");

//Middleware

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(methodOverride("_method"));

app.get("/", function(req, res) {
    res.redirect(301, "/chirps");
});

//Get all chirps
app.get("/chirps", (req, res) => {
  // Step 1: Retrieve all chirps from the DB
  models.Chirp.findAll().then((chirps) => {
    // Step 2: Generate HTML with the chirps inside
    // Step 3: Send the generated HTML to the browser
    res.render("index", { chirps });
  });
});

//Create new chirp
app.post("/chirps", (req, res) => {
  // Step 1: Retrieve new chirp text from the HTML form
  var newChirp = req.body;

  // Step 2: Save new chirp to the DB
  models.Chirp.create(newChirp).then(() => {
    // Step 3: Redirect user back to show all chirps page
    res.redirect("/chirps");
  });
});

//Get specific chirp
app.get("/chirps/:id/edit", (req, res) => {
  // Step 1: Retrieve specific chirp from the DB via its ID coming from the URL
  var chirpId = req.params.id;

  models.Chirp.findById(chirpId).then((chirp) => {
    // Step 2: Generate HTML with single chirp inside
    // Step 3: Send the generated HTML back to the browser
    res.render("edit", { chirp });
  });
});

//Edit a chirp
app.put("/chirps/:id", (req, res) => {
  // Step 1: Retrieve updated chirp text from the form
  var updatedChirp = req.body;
  var chirpId = req.params.id;

  // Step 2: Retrieve specific chirp from the DB via its ID in the URL
  models.Chirp.findById(chirpId).then((chirp) => {
    // Step 3: Save the updates to the DB
    chirp.updateAttributes(updatedChirp).then(() => {
      // Step 4: Redirect user back to show all chirps page
      res.redirect("/chirps");
    });
  });
});

//Delete a chirp
// Hint: .destroy() is the method to delete a record

app.listen(process.env.PORT || 3000);
