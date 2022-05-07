const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add',auth.authenticatetoken,checkRole.checkRole,(req,res,next)=>{
    let category = req.body;
    queri="insert into category (name) values(?)";
    connection.query(queri,[category.name],(err,results)=>{
        if (!err){
            return res.status(200).json({message:"Category added Successfully"});

        }
        else{
            return res.status(500).json(err);
        }
    })
})


router.get('/get',auth.authenticatetoken,(req,res,next)=>{
    var queri="select *from category order by name";
    connection.query(queri,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.patch('/update',auth.authenticatetoken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    var queri="update category set name=? where id=?";
    connection.query(queri,[product.name,product.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"category id does not found"});
            }
            return res.status(200).json({message:"category updated successfully"});

        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;