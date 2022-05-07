const express = require('express');
const connection = require('../connection');
const router = express.Router();
let ejs = require('ejs');
let pdf =require ('html-pdf');
let path =require ('path');
let fs =require ('fs');
let uuid =require ('uuid');
var auth = require('../services/authentication');

router.post('/generateReport',auth.authenticatetoken,(req,res)=>{
    const generateUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);
    queri ="insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values (?,?,?,?,?,?,?,?)";
    //                                                                                                                                                        le res.locales.email pour recuper le mail de celui qi est authentifié et le mettre comme createdBy          
    connection.query(queri,[orderDetails.name,generateUuid,orderDetails.email,orderDetails.contactNumber,orderDetails.paymentMethod,orderDetails.totalAmount,orderDetails.productDetails,res.locals.email],(err,results)=>{
        if (!err){
            ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productDetailsReport, name:orderDetails.name, email:orderDetails.email, contactNumber:orderDetails.contactNumber ,paymentMethod: orderDetails.paymentMethod, totalAmount:orderDetails.totalAmount},(err,results)=>{
                if(err){
                    console.log(err);

                    return res.status(500).json(err);
                }
                else{
                    pdf.create(results).toFile('./generated_pdf/' + generateUuid+ ".pdf", function(err, results){
                        if(err){
                            console.log(err);
                            return res.status(500).json(err);
                        }
                        else{
                            return res.status(200).json({ uuid: generateUuid});
                        }

                    })
                }
            })
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.post('/getPdf',auth.authenticatetoken,(req,res)=>{
    const orderDetails=req.body;
    const pdfPath = './generated_pdf/' + orderDetails.uuid+ '.pdf';
    // si le pdf a déja été crée, donc l'ouvre directement
        if(fs.existsSync(pdfPath)){
            res.contentType("application/pdf");
            fs. createReadStream(pdfPath).pipe(res);
        }
        else{
            //si la facture est stocké dans la base mais que le user n'as pas encore généré le pdf, on le génére puis on l'ouvre
            var productDetailsReport = JSON.parse(orderDetails.productDetails);
            ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productDetailsReport, name:orderDetails.name, email:orderDetails.email, contactNumber:orderDetails.contactNumber ,paymentMethod: orderDetails.paymentMethod, totalAmount:orderDetails.totalAmount},(err,results)=>{
                if(err){
                    console.log(err);

                    return res.status(500).json(err);
                }
                else{
                    //on prend l'uuid de la facture passé en parametre quiest déja stocké dans la base de données:
                    pdf.create(results).toFile('./generated_pdf/' + orderDetails.uuid+ ".pdf", function(err, results){
                        if(err){
                            console.log(err);
                            return res.status(500).json(err);
                        }
                        else{
                            res.contentType("application/pdf");
                            fs. createReadStream(pdfPath).pipe(res);                        }

                    })
                }
            })
        
        }
    })


router.get('/getBills',auth.authenticatetoken,(req,res,next)=>{
    var queri = "select *from bill order by id DESC";
    connection.query(queri,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})


//API pour supprimer un produit
router.delete('/delete/:id',auth.authenticatetoken,(req,res,next)=>{
    const id = req.params.id;
    var queri="delete from bill where id =?";
    connection.query(queri,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Bill id does not found"});
            }
            return res.status(200).json({message:"Bill deleted successfully"});

        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;