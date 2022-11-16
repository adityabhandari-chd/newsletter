const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName

            }
        }]
    };

    app.post("/failure", function(req, res) {
        res.redirect("/");
    });

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/99a2e80d5b";
    const options = {
        method: "POST",
        auth: "addy:05a95f1d84f2ca3998d4c4e8672b61e5-us21"
    }



    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });

    });
    request.write(jsonData);
    request.end();



});

app.listen(process.env.PORT || 3000, function() {
    console.log("server started");
});

//05a95f1d84f2ca3998d4c4e8672b61e5-us21
// 99a2e80d5b.