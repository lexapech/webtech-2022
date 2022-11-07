import express from 'express'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import crypto from 'crypto'
import {storage, token as secret} from "../app.js";
import {createUser} from "../utils.js";
import jwt from 'jsonwebtoken'

function generateAccessToken(username) {
    return jwt.sign(username, secret, { expiresIn: '86400s' });
}

let getCookie = (cookie,name)=>{
    const value = `; ${cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) { // @ts-ignore
        return parts.pop().split(';').shift();
    }
    return null
}


function adminAuth(req, res, next) {
    const token = getCookie( req.headers['cookie'],"token")
    if (!token) return res.sendStatus(401)
    jwt.verify(token, secret, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        let _user = storage.select((x)=>x.email===user.username,storage.users)[0]
        if (_user.role!=="admin") return res.sendStatus(403)
        req.user = _user

        next()
    })
}

function userAuth(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, secret, (err, user) => {
        //console.log(err)
        if (err) return res.sendStatus(403)
        let _user = storage.select((x)=>x.email===user.username,storage.users)[0]

        req.user = _user

        next()
    })
}


passport.use(new LocalStrategy(function verify(username, password, callback) {


    let user = storage.select((x)=>x.email===username,storage.users)[0]
    let cred = storage.select((x)=>x.userid===user.id,storage.credentials)[0]

    //let user = users.users.find((x)=> x.username === username)
    if (!user) return callback(null, false, { user:false,password:false });
    if (!cred) return callback(null, false, { user:true,password:false });

    crypto.pbkdf2(password, Buffer.from(cred.salt), 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return callback(err); }
        //console.log(hashedPassword.toJSON())
        if (!crypto.timingSafeEqual(Buffer.from(cred.pwd), hashedPassword)) {
            return callback(null, false, { user:true,password:false });
        }

        return callback(null, user,{ user:true,password:true });
    });

}));


const router = express.Router()


router.post('/api/login',(req, res) =>{
    passport.authenticate('local',{}, function(err, user,message) {
        if(!message) message={ user:false,password:false }
        if (!user) {res.end(JSON.stringify({user:null,message}));return}
        res.end(JSON.stringify({user:generateAccessToken({username:user.email}),message}))
    })(req, res)
});

router.post('/api/signup', function(req, res, next) {

    let user = storage.select((x)=>x.email === req.body.email,storage.users)

    if (user.length>0) {res.end(JSON.stringify({user:null,success:false}));return}
    let salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return next(err); }
        let user = createUser(req.body)
        let id = storage.insert(user,storage.users).id
        let cred = {userid:id,pwd:hashedPassword.toJSON().data,salt:salt.toJSON().data}
        storage.insert(cred,storage.credentials)
        res.end(JSON.stringify({user:generateAccessToken({username:user.email}),success:true}))
    });
});

/*
router.get('/api/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.end(JSON.stringify({status:"ok"}))
    });
});
*/

router.get('/api/logged',userAuth, function(req, res, next) {
    res.end(JSON.stringify({username: 'id' + req.user.id, isAdmin: req.user.role === "admin"}))
});


export default router
export {userAuth,adminAuth}