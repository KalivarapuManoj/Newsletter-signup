const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){
    var fname = req.body.firstName;
    var lname = req.body.lastName;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    const jsondata = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/03d66c782a";
    const options = {
        method: "POST",
        auth: "manoj:490e19a010b01f0b41e58b54da3733cc-us17"
    };

    const request = https.request(url,options,function(response){
        if(response.statusCode == 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsondata);
    request.end();
    
}); 

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
});

//API Key
//490e19a010b01f0b41e58b54da3733cc-us17

//List Id
//03d66c782a