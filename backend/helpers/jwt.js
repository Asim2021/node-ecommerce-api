//This module provides Express middleware for validating JWTs,
//The decoded JWT payload is available on the request object.
const ejwt = require('express-jwt')

// HERE WE RESTRICTED ROUTES BY CREATING REQUEST-HANDLER USING EXPRESS-JWT 
// NOW REQUEST WITH TOKEN(encoded with secret key) ARE ALLOWED 
// UNLESS [THE REQUEST IS TO ALLOWED PATH]

function authJwt(){
    const secret = process.env.SECRET_KEY
    const api = process.env.API_URL
    return ejwt({
        secret,
        algorithms:['HS256'],
        isRevoked:isRevoked  // BY THIS WE DEFINE THE PERMISSION OF USER AS PER ADMIN OR LOCAL USER
    }).unless({path:[
        {url:/\/api\/v1\/products(.*)/,methods:['GET','OPTIONS']},
        {url:/\/public\/uploads(.*)/,methods:['GET','OPTIONS']},
        {url:/\/api\/v1\/categories(.*)/,methods:['GET','OPTIONS']},
        `${api}/users/login`,
        `${api}/users/register`,
]})
}

async function isRevoked(req,payload,done){
    if(!payload.isAdmin){
        done(null,true)
    }
    done();
}

module.exports = authJwt;