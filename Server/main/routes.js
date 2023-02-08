const initFb = require("firebase/app")
const fbAuth = require("firebase/auth")
const config = require("./firebaseConfig")
const express = require('express');
const pool = require('./db')

const app = initFb.initializeApp(config);
const auth = fbAuth.getAuth();
const router = express.Router();



/*
    Posts Routes
*/
// Gets latest public posts
router.get('/api/get/latestPosts', (req, res, next ) => {
    pool.query(`SELECT * FROM posts 
                WHERE public='true'
                ORDER BY date_created DESC`, 
              (q_err, q_res) => {
                    res.json(q_res.rows)
    })
  })
  
  // Gets users posts
  router.post('/api/get/userPosts', (req, res, next) => {
    console.log(req.body);
    // console.log(req.body.check);
    // console.log(req.body.user_id);
    const user_id = req.body.user_id;
  
    pool.query(`SELECT * FROM posts
                WHERE user_id=$1 ORDER BY date_created DESC`,
              [ user_id ], (q_err, q_res) => {
                  if (q_err) {
                    res.json(q_err)
                  } else {
                  res.json(q_res.rows)
                  }
        })
  } )
  
  // Creates a post
  router.post('/api/post/create', (req, res, next) => {
   
    if (!req.body.title) {
        return res.json("no title")
    } 
    if (!req.body.body) {
        return res.json("no body")
    }
    if (!req.body.public) {
        req.body.public = 'true' 
    }

    const values = [ req.body.title, 
                     req.body.body,
                     req.body.uid, 
                     req.body.username,
                     req.body.public]
    pool.query(`INSERT INTO posts(title, body, user_id, username, date_created, public, edited)
                VALUES($1, $2, $3, $4, NOW(), $5, null)`,
             values, (q_err, q_res) => {
            if(q_err) return next(q_err);
            res.json(q_res.rows)
      })
  })
  
  // Edits a post
  router.put('/api/put/post', (req, res, next) => {

    if (!req.body.title) {
        return res.json("no title")
    } 
    if (!req.body.body) {
        return res.json("no body")
    }
    if (!req.body.public) {
        req.body.public = 'true' 
    }

    const values = [ req.body.title,
                     req.body.body, 
                     req.body.pid, 
                     req.body.public]
    pool.query(`UPDATE posts SET title = $1, body = $2, public = $4, edited = NOW()
                WHERE pid = $3`, values,
                (q_err, q_res) => {
                    if (q_res) {
                        return res.json("success")
                    }
                    
                  console.log(q_err)
          })
  })
  
  // Deletes a post
  router.delete('/api/delete/post', (req, res, next) => {
    const values = [ req.body.post_id,
                     req.body.uid]
    pool.query(`DELETE FROM posts WHERE pid = $1 AND user_id = $2`, values,
                (q_err, q_res) => {
                  res.json(q_res.rows)
                  console.log(q_err)
         })
  })


/*
    User Routes
*/
// Adds user to DB
router.post('/api/post/users', (req, res, next) => {
    const values = [req.body.uid, 
                    req.body.username, 
                    req.body.email]
    pool.query(`INSERT INTO users(uid, username, email)
                VALUES($1, $2, $3)
                ON CONFLICT DO NOTHING`, values,
                (q_err, q_res) => {
                    console.log(q_err);
                    if (q_err) return res.status(400).send(q_err);

                    console.log(q_res)
                    res.json(q_res.rows)
        })
  } )

// Creates new user on Firebase
router.post('/api/signup', (req, res) => {
    console.log(req.body);
    if (!req.body.email || !req.body.username || !req.body.password || !req.body.passwordCheck) {
        res.json('Missing field')
        
    } else if (req.body.password != req.body.passwordCheck) {
        res.json('Password');
    }
    else {
        fbAuth.createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
            .then( (userCredential) => {
                const user = userCredential.user;
                console.log(user.uid);
                res.json('Success');
            })
            .catch ((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                if (errorCode === "auth/email-already-in-use") {
                    res.json('Email in use')
                } else if (errorCode === "auth/invalid-email") {
                    res.json('Invalid email')
                } else if (errorCode === "auth/weak-password") { 
                    res.json('Weak password')
                }             
            });
    }
});


module.exports = router;