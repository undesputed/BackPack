var express = require('express');
var app = express();

var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({extended:true}));

var con = mysql.createConnection({

    host:'localhost',
    user:'root',
    password:'',
    database:'bakpak' 

});

var server = app.listen(8080, function(){
    var host = server.address().address
    var post = server.address().port
    console.log("start");
});

con.connect(function (error){
    if(error) console.log(error);
    else console.log("connected");
});

app.get('/user', function(req,res){
    con.query('select * from user', function(error, rows, fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows)
        }
    });
});

app.get('/category', function(req,res){
    con.query('select * from sub_categories', function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.get('/item/:date', function(req,res){
    con.query('select *,(select supplier_name from supplier where item_setup.supp_id = supplier.supp_id) "supplier_name" from item_setup inner join sub_categories ON item_setup.sub_category_id = sub_categories.id where date_added between DATE_ADD(? , INTERVAL -10 DAY) AND ?',[req.params.date,req.params.date], function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.get('/cart',function(req,res){
    con.query('select * from cart inner join item_setup on cart.item_id=item_setup.item_id',function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.get('/userCart/:id', function(req,res){
    con.query('select * from cart inner join item_setup on cart.item_id=item_setup.item_id WHERE user_id = ?',[req.params.id],function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.get('/byCategory/:id', function(req,res){
    con.query('select * from item_setup where sub_category_id = ?',[req.params.id], function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.get('/byItem/:id',function(req,res){
    con.query('select *,(select supplier_name from supplier where item_setup.supp_id=supplier.supp_id)"supplier_name" from item_setup inner join sub_categories on item_setup.sub_category_id=sub_categories.id where item_setup.item_id = ?',[req.params.id],function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.get('/inCart/:userId/:qty/:itemId', function(req,res){
    con.query('insert into cart(user_id,quantity,item_id) values(?,?,?)',[req.params.userId,req.params.qty,req.params.itemId],function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.post('/insertCart', function(req,res){
    console.log(req.body);
    var data = {user_id:req.body.userId,quantity:req.body.qty,item_id:req.body.itemId};
    var sql = 'insert into cart set ?';
    con.query(sql,data,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send({
            status: 'Insert Success',
            no: null,
                user_id: req.body.userId,
                quantity: req.body.qty,
                item_id: req.body.itemId
        });
    });
});