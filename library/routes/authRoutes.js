import express from 'express'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import {writeJson} from "../server.js";
import crypto from 'crypto'
import users from '../data/users.json' assert {type: "json"};


passport.use(new LocalStrategy(function verify(username, password, callback) {

    let user = users.users.find((x)=> x.username === username)
    if (!user) return callback(null, false, { user:false,password:false });

    crypto.pbkdf2(password, Buffer.from(user.salt), 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return callback(err); }
        //console.log(hashedPassword.toJSON())
        if (!crypto.timingSafeEqual(Buffer.from(user.hashed_password), hashedPassword)) {
            return callback(null, false, { user:true,password:false });
        }

        return callback(null, user,{ user:true,password:true });
    });

}));

function isAuthenticated (req, res, next) {
    if (req.session.passport) next()
    else res.redirect('/login');
}



passport.serializeUser(function(user, callback) {
    callback(null, {username:user.username});
});

passport.deserializeUser(function(user, callback) {
        return callback(null, user);
});

const router = express.Router()


router.post('/login/password',(req, res) =>{
    passport.authenticate('local',{}, function(err, user,message) {
        if(!message) message={ user:false,password:false }
        if (!user) {res.end(JSON.stringify(message));return}
        req.login(user, function(err) {
            if (err) { return next(err); }
            res.end(JSON.stringify(message));
        });

        })(req, res)
});

router.post('/signup', function(req, res, next) {
    if (users.users.find((x)=> x.username === req.body.username)) {res.end(JSON.stringify({success:false}));return}
    let salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return next(err); }

        let user = {username : req.body.username, hashed_password: hashedPassword.toJSON().data, salt: salt.toJSON().data}
        users.users[users.users.length] = user
        writeJson(users,'users.json')
        req.login(user, function(err) {
            if (err) { return next(err); }
            res.end(JSON.stringify({success:true}))
        });
    });
});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

export default router
export {isAuthenticated}