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

app.post("/" , function(req,res){

    res.redirect("/");
})

app.get("/adminhome",function(req,res){
    res.render("adminhome");
  
})

app.get("/clog",function(req,res){
    res.render("customerlogin",{error : false, succ : false});
  
})

//signup

app.get("/signup", function(req,res){

    res.render('signup');
})

app.post("/signup", function(req,res){

    var name = req.body.supname;

    var mail = req.body.supmail;

    var pass = req.body.suppass;

    const q = "insert into  sakila.user  values(?,?)";

    conn.query(q,[mail,pass] ,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render('customerlogin',{error : false, succ : true});
        }

    })

})

app.post("/clog", function(req,res){

    var username = req.body.mail;

    var pass = req.body.pass;

    console.log(username);

    console.log(pass);

    const q = "select * from sakila.user where uid = ?  AND pass = ?";

    conn.query(q,[username,pass] ,function(err,result){
        if(err){
            console.log(err);
        }
        else if(result.length > 0){

            console.log(result);
          
            res.render('custhome');
         
        }
        else{
            res.render('customerlogin',{error : true, succ : false});
        }

    })

})
app.post("/custhome",function(req,res){
    res.render("custhome");
  
})

app.get("/custhome", function(req,res){

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

//globals

var  totalprice = 0; //global variable

var iname = "";

app.post("/sbmenu", function(req,res){
    
    var resid = 101;

    console.log(resid)

    var totalprice = req.body.totalPrice;

    var price = req.body.price;



    console.log(price);


    

    var query = 'select item_name from menu where price = ? and res_id = ?';

    

    conn.query(query,[price,resid] ,function(err,result){

        if(err){
            console.log(err);
        }
        else{
            console.log(query);
            console.log(result);

            var iname = result[0].item_name;

            var q  = 'insert into checkout values("?",?);'

            conn.query(q,[iname,totalprice] , function(req,result){

                if(err){
                    console.log(err);
                }
                else{
                   const q1 = "select * from checkout";

                   conn.query(q1, function(req,result){

                    if(err){
                        console.log(err);
                    }
                    else{

                        res.render('checkout',{data : result});
                    }


                   })
                }
            })

        
        
       
         
        }
       
    })
})

app.get("/payment", function(req,res){
    res.render("paymentpage");
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



