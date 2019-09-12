var express = require('express');
var app = express();

var mysql = require('mysql');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var paypal = require('paypal-rest-sdk');

app.engine('ejs', engines.ejs);
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({extended:true}));

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AR2W7vYUKaCLGORkiZKcpl3J9A9u4w7sJobOFdgABictfda7YyZgZOAqtrYmbOefo01Wo7QoPe8L3Vkm',
    'client_secret': 'EOSCAMy8NdbJ-9rGHxauIVcfqJEVAf8Heomak3KC5da43TMo8lfISy9Dz-5qUZCjuqK9PilnCRT6XCns'
  });

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

app.get('/' , (req,res) => {
    res.render("index");
});

app.get('/paypal', (req,res) => {
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://192.168.43.35:8080/success",
            "cancel_url": "http://192.168.43.35:8080/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "1.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "1.00"
            },
            "description": "This is the payment description."
        }]
    };
    
    
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            res.redirect(payment.links[1].href);
        }
    });
});

app.get('/success', (req,res) => {
    // res.send('Success');
    var PayerID = req.query.PayerID;
    var paymentId = req.query.paymentId;

    var execute_payment_json = {
        "payer_id": PayerID,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "1.00"
            }
        }]
    };
    
    
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.render('success');
        }
    });
});

app.get('/cancel', (req,res) => {
    res.render('cancel');
});

app.get('/login/:user/:pass',function(req,res){
    con.query('select * from user where user_username = ? and user_password = ? ',[req.params.user,req.params.pass],function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.get('/user', function(req,res){
    con.query('select * from user', function(error, rows, fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.get('/geItemsByOrder/:order_code',function(req,res){
    con.query('SELECT * FROM orders INNER JOIN item_setup ON orders.item_id=item_setup.item_id WHERE orders.order_code = ?',[req.params.order_code],function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.get('/getOrderCode/:user_id', function(req,res){
    con.query('select distinct(order_code),status,payment from orders where status in ("Pending","On The Way","Cancelled") and user_id = ?',[req.params.user_id],function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    })
});

app.get('/getOrderItems/:user_id', function(req,res){
    con.query('select * from orders inner join item_setup on orders.item_id = item_setup.item_id where orders.status in ("Pending","On The Way") and orders.user_id = ?',[req.params.user_id], function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    })
})


app.get('/getHistoryByDel/:id',function(req,res){
    con.query('select * from history inner join delivery on history.order_code = delivery.order_code',function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    })
})

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
    con.query('select * from user inner join user_details on user.user_username = user_details.user_username where user.user_id = ? and user_details.user_status = "ACTIVE"',[req.params.id],function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.get('/getUserDetails/:id', function(req,res){
    con.query('select * from user inner join user_details on user.user_username = user_details.user_username where user.user_id = ?',[req.params.id],function(error,rows,fields){
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
    var data = {order_code:req.body.order_code,hist_date:req.body.order_date,item_id:req.body.item_id,user_id:req.body.user_id};
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

app.post('/insertComment', function(req,res){
    console.log(req.body);
    var data = {comment:req.body.comment,user_id:req.body.user_id,item_id:req.body.item_id,time:req.body.time};
    var sql = 'insert into comments set ?';
    con.query(sql,data,(err,result) => {
        if(err) throw err;
        console.log(result);
        res.send({
            status: 'Comment inserted',
            no: null,
            comment:req.body.comment,
            user_id:req.body.user_id,
            item_id:req.body.item_id,
            time:req.body.time
        })
    })
});

app.post('/delCart/:user_id/:item_id',function(req,res){
    console.log(req.body);
    var sql = 'delete from cart where user_id = ? and item_id = ?';
    con.query(sql,[req.params.user_id,req.params.item_id],function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.post('/updateItem/:quantity/:item_id', function(req,res){
    console.log(req.body);
    var sql = 'update item_setup set item_quantity = item_quantity - ? where item_id = ?';
    con.query(sql,[req.params.quantity,req.params.item_id],function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows)
        } 
    });
});

app.post('/updateDetailsByStatus/:status', function(req,res){
    console.log(req.body);
    var sql = "update user_details set user_status = 'INACTIVE' where user_status = ?";
    con.query(sql,[req.params.status], function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    })
});

app.post('/updateDetailsById/:id', function(req,res){
    console.log(req.body);
    var sql = "update user_details set user_status = 'ACTIVE' where details_id = ?";
    con.query(sql,[req.params.id], function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    })
})

app.get('/getComment/:item_id', function(req,res){
    con.query('SELECT * FROM comments WHERE comments.item_id = ?',[req.params.item_id],function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
})

app.post('/cancelOrder/:status/:order_code', function(req,res){
    con.query('update orders set status = ? where order_code = ?',[req.params.status,req.params.order_code],function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.get('/cancelDelivery/:status/:order_code', function(req,res){
    con.query('update delivery set delivery_status = ? where order_code = ?',[req.params.status,req.params.order_code], function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.get('/lastOrderCode', function(req,res){
    con.query('select order_code from orders order by order_id desc limit 1', function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.get('/delHistory/:order_code', function(req,res){
    con.query('delete from history where order_code = ?', [req.params.order_code], function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
});

app.get('/getHistory/:user_id', function(req,res){
    var sql = 'select history.order_code, history.hist_date,history.user_id, history.item_id,delivery.delivery_date,delivery.notif_status,delivery.delivery_status from history,delivery,item_setup where history.order_code = delivery.order_code and delivery.delivery_status in ("Cancelled","Delivered") and item_setup.item_id = history.item_id and item_setup.item_id = delivery.item_id and history.user_id = ?';
    con.query(sql,[req.params.user_id],function(error,rows,fields){
        if(error) console.log(error);
        else{
            console.log(rows);
            res.send(rows);
        }
    });
})