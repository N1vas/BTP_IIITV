const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
//const cors = require('./cors');

const Doctors = require('../models/doctors');

const doctorRouter = express.Router();

doctorRouter.use(bodyParser.json());

doctorRouter.route('/')
.options( (req, res) => { res.sendStatus(200); })
.get((req , res , next ) => {
    Doctors.find(req.query) //passing query to find 
    .then((doctors) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(doctors);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( (req, res, next) => {
    Doctors.create(req.body)
    .then((doctor) => {
        console.log('doctor Created ',doctor);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(doctor);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /doctor');
})
.delete( (req, res, next) => {
    Doctors.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

doctorRouter.route('/:doctorId')
.options( (req, res) => { res.sendStatus(200); })
.get((req,res,next) => {
    Doctors.findById(req.params.doctorId)
    .then((doctors) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(doctors);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('you cannot create on /doctor/'+ req.params.doctorId);
})
.put( (req, res, next) => {
    Doctors.findByIdAndUpdate(req.params.doctorId, {
        $set: req.body
    }, { new: true })
    .then((doctor) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(doctor);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete( (req, res, next) => {
    Doctors.findByIdAndRemove(req.params.doctorId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});



module.exports = doctorRouter;