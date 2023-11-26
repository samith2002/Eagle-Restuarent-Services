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
        database : "eagle",
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

    const set = new Set();

    const q1 = "select customer_id from eagle.customer";

    conn.query(q1,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            result.forEach(element => {
                set.add(element.customer_id);
            });

            console.log(set);
        }

    })


    const randomDecimal = Math.random();

    let cid;

    do{
        cid = Math.floor(randomDecimal * 90) + 10;
    }while(set.has(cid));

    set.add(cid);



    var name = req.body.supname;

    var mail = req.body.supmail;

    var pass = req.body.suppass;

    var phone = req.body.phn;

    const q = "insert into  eagle.customer values(?,?,?,?,?)";

    conn.query(q,[cid,name,phone,mail,pass] ,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render('customerlogin',{error : false, succ : true});
        }

    })

})

//login globals

let username = "";
let pass = "";
let customerid;

app.post("/clog", function(req,res){

     username = req.body.mail;

     pass = req.body.pass;

    console.log(username);

    console.log(pass);

    const q = "select * from eagle.customer where customer_email = ?  AND customer_password = ?";
    const q1 = "select customer_id from eagle.customer where customer_email = ?  AND customer_password = ?";

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

    conn.query(q1,[username,pass] ,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            customerid = result[0].customer_id;
            console.log(customerid);
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

    res.render("sblogin",{error : false});
})

app.get("/sbmenu", function (req,res){
    res.render("sbmenu");
})



// star bucks post req

app.post("/sblogin",function(req,res){

    
    let firname = req.body.sbmail;

    let pass = req.body.sbpass;

    console.log(firname);

    console.log(pass);

    const q = "SELECT admin_email,admin_password FROM eagle.admin WHERE admin_email = ? and admin_password = ?";

    conn.query(q, [firname,pass],function(err,result){
        if(err){
            console.log(err);
        }
        else if(result.length > 0){
           res.render("sbmainpage",{adminname: firname});
         
        }
        else{
            res.render("sblogin", {error : true});
        }

    })
    
   
    
})

//globals

let  totalprice = 0; //global variable



app.post("/sbmenu", function(req,res){
    
    var reid = req.body.resid;

    console.log(reid)

     totalprice = req.body.totalPrice;

    var price = req.body.price;



    console.log(price);


    

    var query = 'select menu_items from eagle.menu where price = ? and restaurant_id = ?';

    

    conn.query(query,[price,reid] ,function(err,result){

        if(err){
            console.log(err);
        }
        else{

            console.log(query);
            console.log(result);

            var iname = result[0].menu_items;
            console.log(iname); 
            
            const randomDecimal = Math.random();
            const cid = Math.floor(randomDecimal * 90) + 10;

            var q  = 'insert into checkout values(?,?,?,?);'

            conn.query(q,[cid,totalprice,iname,reid] , function(req,result){

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
                        console.log(result);
                        res.render('checkout',{data : result});
                    }


                   })
                }
            })

        
        
       
         
        }
       
    })
})
//delivery

app.get("/delhome", function(req,res){

    res.render("delhome");

})

let itemq;

app.post("/delhome",function(req,res){

    const randomDecimal = Math.random();
    const randomDecimal1 = Math.random();
    const randomDecimal2 = Math.random();

    let oid = Math.floor(randomDecimal * 90) + 10;

    let delvid = Math.floor(randomDecimal1*90)+10;

    let bid = Math.floor(randomDecimal2*90)+10;

    var add = req.body.address;

    var phn = req.body.phone;
    


    const  q0 = 'SELECT COUNT(menu_item) AS itemcount FROM eagle.checkout;'

    conn.query(q0, function(err,result){

        if(err){
            console.log(err);
        }
        else{
           itemq = result[0].itemcount;
           console.log(itemq);
        }
    })



    var q  = "insert into orders values(?,?,?);";

    var q1 = "insert into delivery values(?,?,?,?)";

    conn.query(q,[oid,customerid,itemq] , function(err,result){

        if(err){
            console.log(err);
        }
        else{
          console.log("success");
        }
    })

    conn.query(q1,[delvid,add,phn,oid] , function(err,result){

        if(err){
            console.log(err);
        }
        else{
          res.render("paymentpage", {flag:true});
        }
    })



})


app.get("/payment", function(req,res){
    res.render("paymentpage",{flag:false});
})

app.post("/paymentsucc", function(req,res){
    var bool = req.body.flag;

    console.log(bool);
    if(bool == 1){

        res.render('sbordersucc',{totalprice:totalprice,succ : false});
    }
    else{
        res.render('sbordersucc',{totalprice:totalprice, succ : true});
    }
    
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

app.get("/partTimeEmployees/:resid", function(req,res){

    const { resid } = req.params;
    console.log(resid);
    const q = "SELECT * FROM eagle.part_time_emp where admin_id = ?";

    conn.query(q,[resid],function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render("parttime",{title: 'Part-Time Employees', data: result})
        }

    })
})

app.get("/hire/:resid", function(req,res){

    const { resid } = req.params;
    console.log(resid);
    if(resid === "sb"){
        res.render("hiresb");
    }
})

app.get("/permanentEmployees/:resid", function(req,res){

    const { resid } = req.params;
    console.log(resid);
    const q = "SELECT * FROM eagle.permanent_emp where admin_id = ?";

    conn.query(q,[resid],function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render("permemp",{title: 'Permanent Employees', data: result})
        }

    })
})

app.get("/chefs/:resid", function(req,res){

    const { resid } = req.params;
    console.log(resid);
    const q = "SELECT * FROM eagle.chefs where admin_id = ?";

    conn.query(q,[resid],function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render("chefs",{title: 'Chefs', data: result})
        }

    })


})

app.get("/revenue/:resid", function(req,res){

    const { resid } = req.params;
    console.log(resid);
    const q = "SELECT * FROM eagle.revenue where restaurant_id = ?";

    conn.query(q,[resid],function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render("revenue",{title: 'Daily Revenue', data: result})
        }

    })
    
})


app.get("/menu/:resid", function(req,res){

    const { resid } = req.params;
    console.log(resid);
    const q = "SELECT * FROM eagle.menu where restaurant_id = ?";

    conn.query(q,[resid],function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render("menu",{title: 'Menu', data: result})
        }

    })
    
})

app.get("/infra/:resid", function(req,res){

    const { resid } = req.params;
    console.log(resid);
    const q = "SELECT * FROM eagle.infrastructure_management where admin_id = ?";

    conn.query(q,[resid],function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render("infra",{title: 'Infrastructure Data', data: result})
        }

    })
    
})

app.get("/stock/:resid", function(req,res){

    const { resid } = req.params;
    console.log(resid);
    const q = "SELECT * FROM eagle.stocks where admin_id = ?";

    conn.query(q,[resid],function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render("stock",{title: 'Stock Data', data: result})
        }

    })


})

app.post("/assignstock/:resid", function(req,res){

    const par = req.params.resid;

    const q = "insert into eagle.stocks values(?,?,?,?,?);"

    var emp_id = req.body.empid;

    console.log(par);

    var stockid = req.body.stockid;

    var stockname = req.body.stockname;

    var quant = req.body.stockquant;

    const currentDate = new Date().toISOString().split('T')[0];

    var adminid = req.body.adminid;

   

    conn.query(q,[stockid,stockname,quant,currentDate,adminid],function(err,result){
        if(err){
            console.log(err);
        }
        else{
           res.redirect("/stock/12");
        }

    })



})


app.post("/assignper/:resid", function(req,res){

    const par = req.params.resid;

    const q = "insert into eagle.permanent_emp values(?,?,?,?,?,?,?);"

    var emp_id = req.body.empid;

    console.log(par);

    var name = req.body.name;

    var shift = req.body.shift;

    var phone = req.body.phonenum;

    var mail = req.body.mail;

    var ssn = req.body.ssn;

    let aid = req.body.adminid;

    conn.query(q,[emp_id,name,shift,phone,mail,ssn,aid],function(err,result){
        if(err){
            console.log(err);
        }
        else{
           res.redirect("/permanentEmployees/12");
        }

    })



})

app.post("/assign/:resid", function(req,res){

    const par = req.params.resid;

    const q = "insert into eagle.part_time_emp values(?,?,?,?,?,?,?);"

    var emp_id = req.body.empid;

    
    var name = req.body.name;

    var shift = req.body.shift;

    var phone = req.body.phonenum;

    var mail = req.body.mail;

    var ssn = req.body.ssn;

    let aid = req.body.adminid;

    conn.query(q,[emp_id,name,shift,phone,mail,ssn,aid],function(err,result){
        if(err){
            console.log(err);
        }
        else{
           res.redirect("/partTimeEmployees/12");
        }

    })



})


app.post("/assignchef/:resid", function(req,res){

    const par = req.params.resid;

    const q = "insert into eagle.chefs values(?,?,?,?,?,?);"

    var emp_id = req.body.empid;

    console.log(par);

    var name = req.body.name;

    var shift = req.body.shift;

    var phone = req.body.phonenum;

    var mail = req.body.mail;

    let aid = req.body.adminid;

    conn.query(q,[emp_id,name,phone,shift,mail,aid],function(err,result){
        if(err){
            console.log(err);
        }
        else{
           res.redirect("/chefs/12");
        }

    })



})

app.post("/fire/:resid", function(req,res){

    const par = req.params.resid;

    const q = "delete * from eagle.chefs values(?,?,?,?,?,?);"

    var emp_id = req.body.empid;

    console.log(par);

    var name = req.body.name;

    var shift = req.body.shift;

    var phone = req.body.phonenum;

    var mail = req.body.mail;

    let aid = req.body.adminid;

    conn.query(q,[emp_id,name,phone,shift,mail,aid],function(err,result){
        if(err){
            console.log(err);
        }
        else{
           res.redirect("/chefs/12");
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



