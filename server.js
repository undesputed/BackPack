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

app.get('/getUser/:id', function(req,res){
    con.query('select * from user where user_id = ?',[req.params.id],function(error,rows,fields){
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

app.post('/deleteCart', function(req,res){
    console.log(req.body);
    var data = {cart_id: req.body.cart_id};
    var sql = 'delete from cart where ?';
    con.query(sql,data,(err,result)=>{
        if(err) throw err;
        res.send({
            status: 'item deleted',
            no: null,
                cart_id: req.body.cart_id
        });
    });
});

app.post('/getUserById', function(req,res){
    console.log(req.body);
    var data = {user_id:req.body.user_id};
    var sql = 'select * from user where ?';
    con.query(sql,data,(err,result) => {
        if(err) throw err;
        res.send({
            status: 'Success',
            no: null,
                user_id: req.body.user_id
        })
    });
});

app.post('/updateUser/:user_id', function(req,res){
    console.log(req.body);
    var data1 = {user_fname:req.body.user_fname,user_lname:req.body.user_lname,user_address:req.body.user_address,user_postal_code:req.body.postal_code,user_email:req.body.user_email,user_phone:req.body.user_phone,user_username:req.body.user_username,user_password:req.body.user_password};
    var sql = 'update user set ? where user_id = ?';
    con.query(sql,[data1,req.params.user_id], function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows)
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

app.post('/insertOrder',function(req,res){
    console.log(req.body);
    var data = {order_code:req.body.order_code,order_date:req.body.order_date,order_totalPrice:req.body.totalPrice,order_quantity:req.body.quantity,user_id:req.body.user_id,item_id:req.body.item_id,payment:req.body.payment,status:req.body.status};
    var sql = 'insert into orders set ? ';
    con.query(sql,data,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send({
            status: 'Order placed',
            no: null,
            order_code:req.body.order_code,
            order_date:req.body.order_date,
            order_totalPrice:req.body.totalPrice,
            order_quantity:req.body.quantity,
            user_id:req.body.user_id,
            item_id:req.body.item_id,
            payment:req.body.payment,
            status:req.body.status
        })
    });
});

app.post('/insertDelivery',function(req,res){
    console.log(req.body);
    var data = {delivery_date:req.body.order_date,delivery_status:req.body.status,user_id:req.body.user_id,item_id:req.body.item_id,order_code:req.body.order_code};
    var sql = 'insert into delivery set ?';
    con.query(sql,data,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send({
            status: 'Delivery Placed',
            no: null,
            delivery_date:req.body.order_date,
            delivery_status: req.body.status,
            user_id:req.body.user_id,
            item_id:req.body.item_id,
            order_code:req.body.order_code
        });
    });
});

app.post('/insertHistory',function(req,res){
    console.log(req.body);
    var data = {order_code:req.body.order_code,hist_date:req.body.order_date,item_id:req.body.item_id,user_id:req.body.item_id};
    var sql = 'insert into history set ? ';
    con.query(sql,data,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send({
            status: 'History Saved',
            no: null,
            order_code:req.body.order_code,
            hist_date:req.body.order_date,
            item_id:req.body.item_id,
            user_id:req.body.user_id
        })
    });
});