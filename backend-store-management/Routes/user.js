const express = require("express");
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { query } = require("express");
require('dotenv').config();
//imporet les deux fichiers qui contiennent les deux fonctions auth et checkrole
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');


//1ere API pour la l'inscription
router.post('/signup', (req, res) => {
    let user = req.body;
    queri = "select email,password,role,status from user where email=?" 
    connection.query(queri, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                queri = "insert into user(name,contactNumber,email,password,status,role) values (?,?,?,?,'false','user')"
                connection.query(queri, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Succesfully Registered." });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })

            }
            else {
                return res.status(400).json({ message: "Email Already Exists." });
            }

        }
        else {
            return res.status(500).json(err);
        }



    })
})


// APi pour login avec utilisation de token jwt 
router.post('/login', (req, res) => {
    const user = req.body;
    queri = "select email,password,role,status from user where email=?";
    connection.query(queri, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "incorrect username or password" });
            }
            else if (results[0].status === 'false') {
                return res.status(401).json({ message: "wait for admin approval" });
            }
            else if (results[0].password == user.password) {
                const response = { email: results[0].email, role: results[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
                res.status(200).json({ token: accessToken });


            }
            else {
                return res.status(400).json({ message: "something wen t wrong, please try again later" });
            }

        }
        else {
            return res.status(500).json(err);
        }
    }
    )
})

var trasporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


//API forgotPassword

router.post('/forgotPassword', (req, res) => {
    const user = req.body;
    queri = "select email,password from user where email=?";
    connection.query(queri, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: "password sent successfuly to your email. " });
            }
            else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Password by store managment system',
                    html: '<p><b>Your login details for store management system </b><br><b>Email: </b>' + results[0].email + '<br><b>Password: </b>' + results[0].password + '<br><a href="http://localhost:4200/">click here to login</a></p>'
                };
                trasporter.sendMail(mailOptions, function (err, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }

                });
                return res.status(200).json({ message: "Password sent successfully to your email." });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})


//API pour renvoyer tous les users sans l'admin
router.get('/get', auth.authenticatetoken, checkRole.checkRole, (req, res) => {
    var queri = "select id,name,email,contactNumber,status from user where role='user'";
    connection.query(queri, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})


//Api pour modifier le status d'un user  (true  or  false)
//verifier d'abord si il est authentifier puis continuer le reste (next):
router.patch('/update', auth.authenticatetoken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    var queri = "update user set status=? where id=?";
    connection.query(queri, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "user id does not exist" });
            }
            else {
                return res.status(200).json({ message: "User updated successfully" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})


router.get('/checkToken', auth.authenticatetoken, (req, res) => {
    return res.status(200).json({ message: "true" });
})

router.post('/changePassword', auth.authenticatetoken, (req, res) => {
    const user = req.body;
    //le res.locals sont remplies par la fonction authencatetoken lors de son appel
    const email = res.locals.email;
    var queri = "select *from user where email=? and password=?";
    connection.query(queri, [email, user.oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ message: "Incorrect Old Password" });
            }
            else if (results[0].password == user.oldPassword) {
                queri = "update user set password=? where email=?";
                connection.query(queri, [user.newPassword, email], (err, result) => {
                    if (!err) {
                        return res.status(200).json({ message: "Password updated successfuly" });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })

            }
            else {
                return res.status(400).json({ message: "Something went wrong, please try again later" });
            }

        }
        else {
            return res.status(500).json(err);
        }
    })
})



module.exports = router;