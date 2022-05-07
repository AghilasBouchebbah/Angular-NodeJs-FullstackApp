require('dotenv').config()
const jwt = require('jsonwebtoken');

function authenticatetoken(req,res,next){
    const authHeader = req.headers['authorization']
    //spliter le authHeader selon l'espace et prendre le  premier
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null)
    return res.sendStatus(401);
    // verifier le token avec la clé ACCESS_TOKEN qui se trouve dans .env créeau debut
    jwt.verify(token, process.env.ACCESS_TOKEN, (err,response)=>{
        if(err)
            return res.sendStatus(403);
        //si c'est ok, c'est à dire le token exist deja dans le header, 
        //le res de router appelant dans user.js se voit affecter la reponse du jwt.verify
        res.locals = response;
        // et le router appelant continue son executin grace au mot next()
        next()
    })
}


module.exports = { authenticatetoken: authenticatetoken }