const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
var SHA256 = require("crypto-js/sha256");

//const cors = require('./cors');

const Plans = require('../models/plans');
//const Hashs = require('../models/hashs');

const planRouter = express.Router();

planRouter.use(bodyParser.json());

planRouter.route('/')
.options( (req, res) => { res.sendStatus(200); })
.get((req , res , next ) => {
    Plans.find(req.query) 
    .then((plans) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(plans);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( authenticate.verifyUser , (req, res, next) => {
    const { plan_code,plan_name,description} = req.body;
    var lol = plan_name+plan_code+description;
    console.log(lol);
    const rip= SHA256(lol);

    const haha= new Plans({
        plan_code: plan_code,
        plan_name:plan_name,
        description:description,
        hashVaule:rip
    });

    Plans.create(haha)
    .then((plan) => {
        console.log('Plan Created ',plan);
        //Hashs.create(SHA256(req.body));
        //console.log(SHA256(req.body));
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(plan);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put( authenticate.verifyUser , (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /plans');
})
.delete(authenticate.verifyUser , (req, res, next) => {
    Plans.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

planRouter.route('/:planId')
.options( (req, res) => { res.sendStatus(200); })
.get((req,res,next) => {
    Plans.findById(req.params.planId)
    .then((plans) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(plans);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser , (req, res, next) => {
    res.statusCode = 403;
    res.end('you cannot create on /plans/'+ req.params.planId);
})
.put( authenticate.verifyUser ,(req, res, next) => {
    Plans.findByIdAndUpdate(req.params.planId, {
        $set: req.body
    }, { new: true })
    .then((plan) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(plan);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete( authenticate.verifyUser ,(req, res, next) => {
    Plans.findByIdAndRemove(req.params.planId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});



module.exports = planRouter;