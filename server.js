/*
    Server implimentation for 467 Group Project
*/

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express')
const mysql = require('mysql')
const ejs = require('ejs')


const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const cookieSession = require('cookie-session')
const DB = require('./lib/db')
const bcrypt = require('bcrypt')


const app = express()

app.use(cookieSession({
    name: 'appAuth',
    keys: ['secret'],
    // ERROR: doenst last a day, lasts a minute. nice for testing, useless in execution
    maxAge: 60 * 60 * 24 // cookie lasts 1 day
}))
app.use(express.json())
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

 app.use(flash())
// app.use(session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: false
// }))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
    console.log(`4- Serialize user: ${JSON.stringify(user.id)}`)
    console.log("--------------------")
    return done(null, user.id)
})

passport.deserializeUser((id, done) => {
    console.log(`Deserialize user: ${id}`)
    const user = DB.findByID(id)
    if (user) {
        return done(null, {id: user.id, username: user.username})
    } else {
        return done(new Error('No user with id is Found'))
    }

})

// passport.deserializeUser((user, done) => {
//     console.log(`5- DeSerialize user: ${JSON.stringify(user)}`)
//     return done(null, user.message)
// })

passport.use('local', new LocalStrategy({ passReqToCallback: true }, 
    async (req, username, password, done) => {
        console.log(`2- Local Strat cb ${JSON.stringify(username)}`)

        let user = await DB.findByUsername(username)
        console.log(`user from DB: ${JSON.stringify(user)}`)
        // checks if user exists
        if (!user) {
            return done(null, false)
        }

        
        var result = false
        // check password
        if (password === user.password) {
            result = true;
        }

        if (result) {
            return done(null, user)
        } else {
            return done('Password/Username incorrect', null)
        }

        // return done(null, user)
        // return done(null, { message:'testing' })
    }
))


app.listen(3100, () => console.log('Server Started'));

app.get('/Login', (req, res) => {
 res.render('Login.ejs')
})

app.post('/Login', (req, res, next) => {
    console.log(`1- Login header ${JSON.stringify(req.body)}`)
    passport.authenticate('local', 
    (err, user) => {
        console.log(`3- Passport auth cb ${JSON.stringify(user)}`)

        if (err) {
            return res.status(401).json({
                timestamp: Date.now(),
                msg: `Access deinied. Username or password incorrect.`,
                code: 401
            })
        }

        if (!user) {
            return res.status(401).json({
                timestamp: Date.now(),
                msg: `Unauthorized user`,
                code: 401
            })
        }

        req.login(user, () => {
            if(err) {
                return next(err)
            }

            res.status(200)
            res.redirect('/MainPage')
        })

        

    })(req, res, next)
})

// Render the pages
app.get('/MainPage', (req, res) => {
    res.render('MainPage.ejs')
})

// this will later be made into a protected page
// possibly the user data display page as a practice
app.get('/MainPage2', (req, res) => {
    
    try {
        console.log('-----')
        console.log('req.body: ', req.body)
        console.log('req.params: ', req.params)
        console.log('req.headers": ', req.headers)
        console.log('req.isAuthenticated:', req.isAuthenticated())
        console.log('req.user:', req.user)


        if (!req.isAuthenticated()) return res.status(403).json({
            timestamp: Date.now(),
            msg: 'Access Denied',
            code: 403
        })

        res.render('MainPage2.ejs')
        //res.sendStatus(200)
    } catch (err) {
        console.error( new Error(err.message))
        res.status(500).json({
            timestamp: Date.now(),
            msg: "Failed to get user, internal error",
            code: 500
        })
    }
    

    // res.render('MainPage2.ejs')
})

app.get('/', (req, res) => {
    res.render('SplashPage.ejs')
})
