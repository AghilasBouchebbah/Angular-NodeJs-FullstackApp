const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add',auth.authenticatetoken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    queri="insert into product (name,categoryId,description,price,status) values(?,?,?,?,'true')";
    connection.query(queri,[product.name,product.categoryId,product.description,product.price],(err,results)=>{
        if (!err){
            return res.status(200).json({message:"Product added Successfully"});

        }
        else{
            return res.status(500).json(err);
        }
    })
})


router.get('/get',auth.authenticatetoken,(req,res,next)=>{
    var queri="select p.id,p.name,p.description,p.price,p.status,c.id as categoryId,c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id ";
    connection.query(queri,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})


// API pour retourner les produit selon l'id de category
router.get('/getByCategory/:id',auth.authenticatetoken,(req,res,next)=>{
    const id = req.params.id;
    var queri="select id,name from product where categoryId =? and status='true'";
    connection.query(queri,[id],(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})


// API pour retourner les produit selon l'id de produit
router.get('/getById/:id',auth.authenticatetoken,(req,res,next)=>{
    const id = req.params.id;
    var queri="select id,name,description,price from product where id =?";
    connection.query(queri,[id],(err,results)=>{
        if(!err){
            return res.status(200).json(results[0]);
        }
        else{
            return res.status(500).json(err);
        }
    })
})



// API pour modifier un produit
router.patch('/update',auth.authenticatetoken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    var queri="update product set name=?,categoryId=?,description=?,price=? where id=?";
    connection.query(queri,[product.name,product.categoryId,product.description,product.price,product.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"product id does not found"});
            }
            return res.status(200).json({message:"product updated successfully"});

        }
        else{
            return res.status(500).json(err);
        }
    })
})


//API pour supprimer un produit
router.delete('/delete/:id',auth.authenticatetoken,checkRole.checkRole,(req,res,next)=>{
    const id = req.params.id;
    var queri="delete from product where id =?";
    connection.query(queri,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"product id does not found"});
            }
            return res.status(200).json({message:"product deleted successfully"});

        }
        else{
            return res.status(500).json(err);
        }
    })
})


// API pour modifier le "status" d'un produit
router.patch('/updateStatus',auth.authenticatetoken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    var queri="update product set status=? where id=?";
    connection.query(queri,[product.status,product.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"product id does not found"});
            }
            return res.status(200).json({message:"Product Status updated successfully"});

        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;