const express = require('express');
const router = express.Router();

router.get('/register', (req,res)=>{
    res.render('register');
})

router.get('/login', (req,res)=>{
    res.render('login');
});

router.get('/logout', (req,res)=>{
    res.render('logout');
});

module.exports = router;