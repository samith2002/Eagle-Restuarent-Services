const e = require('express');

const express = require('express');

const mysql = require('mysql');


// ejs

const ejs = require("ejs"); 

const app = express();

const bodyparser = require('body-parser');

app.set('view engine', 'ejs');


app.use(bodyparser.urlencoded({extended:true}));

app.use(express.static("public"));

//creating connection to db
const conn = mysql.createConnection(
    {
        host : "localhost",
        user : "root",
        password : "S@m#2002",
        database : "sakila",
    }
)

//checking connection

conn.connect(function(err){
    if(err){
        console.log(err);
        return;
    }
    else{
        console.log("Db connection Successful");
    }
})


app.get("/",function(req,res){
    res.render("homepage");
  
})

app.get("/adminhome",function(req,res){
    res.render("adminhome");
  
})

app.get("/clog",function(req,res){
    res.render("customerlogin");
  
})
app.post("/custhome",function(req,res){
    res.render("custhome");
  
})


//****************** Star Bucks Server Login Code *******************//

// star bucks get req

app.get("/sblogin", function(req,res){

    res.render("sblogin");
})

app.get("/sbmenu", function (req,res){
    res.render("sbmenu");
})



// star bucks post req

app.post("/sblogin",function(req,res){

    
    const firname = req.body.sbmail;

    const pass = req.body.sbpass;

    console.log(firname);

    console.log(pass);

    const q = "SELECT * FROM csce5350_fall.instructor WHERE dept_name = 'Finance'";

    conn.query(q, function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render('sbmainpage', { adminname:firname});
         
        }

    })
    
   
    
})

var  totalprice = 0; //global variable

app.post("/sbmenu", function(req,res){
    

     totalprice = req.body.totalPrice;
    

    const query = 'INSERT INTO revenue (price) VALUES (?)';

    conn.query(query,[totalprice] ,function(err,result){

        if(err){
            console.log(err);
        }
        else{



           console.log("Order Submitted Successfully!");

           res.render('paymentpage');
         
        }
       
    })
})

app.post("/paymentsucc", function(req,res){
    res.render('sbordersucc',{totalprice:totalprice});
})




app.get("/sbstaff", function(req,res){

    const q = "SELECT * FROM csce5350_fall.instructor";

    conn.query(q, function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render('sbstaff', { data:result});
         
        }

    })
})




//*************************************//


//****************** Burger King Server Login Code *******************//

app.get("/bklogin", function(req,res){

    res.render("bklogin");
})

app.post("/bklogin",function(req,res){

    
    const firname = req.body.bkmail;

    const pass = req.body.bkpass;

    console.log(firname);

    console.log(pass);


})

app.get("/bkmenu", function(req,res){

    res.render('bkmenu');
})

//*************************************//

//****************** KFC Server Login Code *******************//


app.get("/kfclogin", function(req,res){

    res.render("kfclogin");
})

app.post("/kfclogin",function(req,res){

    
    const firname = req.body.kfcmail;

    const pass = req.body.kfcpass;

    console.log(firname);

    console.log(pass);


})

app.get("/kfcmenu", function(req,res){

    res.render("kfcmenu");

})

//*************************************//

/






//****************** mcd Server Login Code *******************//

app.get("/chicklogin", function(req,res){

    res.render("chicklogin");
})

app.post("/chicklogin",function(req,res){

    
    const firname = req.body.chickmail;

    const pass = req.body.chickpass;

    console.log(firname);

    console.log(pass);


})

app.get("/chickmenu", function(req,res){

    res.render('chickmenu');

})

//*************************************//










app.post("/",function(req,res){

    
    const firname = req.body.fname;

    const check = "SELECT * FROM sakila.actor where first_name = ?; "

    const check_c = mysql.format(check,[firname]);

    

})

app.listen(3000, function(){
    console.log("Server Connected");
})



