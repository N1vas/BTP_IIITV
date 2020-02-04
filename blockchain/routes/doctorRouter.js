const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
//const cors = require('./cors');

const Doctors = require('../models/doctors');

const doctorRouter = express.Router();

doctorRouter.use(bodyParser.json());

doctorRouter.route('/')
.options((req, res) => { res.sendStatus(200); })
.get(authenticate.verifyUser, (req , res , next ) => {
    Doctors.find(req.query) //passing query to find 
    .then((doctors) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(doctors);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyDoctor, (req, res, next) => {
    req.body.doctor_name = req.user._id;
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
.delete( authenticate.verifyUser, authenticate.verifyDoctor,(req, res, next) => {
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
.get(authenticate.verifyUser, authenticate.verifyDoctor, (req,res,next) => {
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
.put( authenticate.verifyUser, authenticate.verifyDoctor, (req, res, next) => {
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
.delete( authenticate.verifyUser, authenticate.verifyDoctor, (req, res, next) => {
    Doctors.findByIdAndRemove(req.params.doctorId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});



doctorRouter.route('/:doctorId/labreports')
.get(authenticate.verifyUser,(req,res,next) => {
    Doctors.findById(req.params.doctorId)
    .then((doctor) => {
        if (doctor != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(doctor.labreports);
        }
        else {
            err = new Error('doctor ' + req.params.doctorId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyLabtech, (req, res, next) => {
    Doctors.findById(req.params.doctorId)
    .then((doctor) => {
        if (doctor != null) {
            req.body.labtech_name = req.user._id;
            doctor.labreports.push(req.body);
            doctor.save()
            .then((doctor) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(doctor);
            }, (err) => next(err));
        }
        else {
            err = new Error('doctor ' + req.params.doctorId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));

})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /doctor/'
        + req.params.doctorId );
})

.delete(authenticate.verifyUser, authenticate.verifyLabtech, (req, res, next) => {
    Doctors.findById(req.params.doctorId)
    .then((doctor) => {
        if (doctor != null) {
            for (var i = (doctor.labreports.length -1); i >= 0; i--) {
                doctor.labreports.id(doctor.labreports[i]._id).remove();
            }
            doctor.save()
            .then((doctor) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(doctor);                
            }, (err) => next(err));
        }
        else {
            err = new Error('doctor ' + req.params.doctorId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

doctorRouter.route('/:doctorId/labreports/:labreportsId')
.get(authenticate.verifyUser, (req, res, next) => {
    Doctors.findById(req.params.doctorId)
    .then((doctor) => {
        if( doctor != null && doctor.labreports.id) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(doctor.labreports.id(req.params.labreportsId));
        }
        else if (doctor == null) {
            err = new Error('doctor ' + req.params.doctorId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('labreports ' + req.params.labreportsId + ' not found');
            err.status = 404;
            return next(err);            
        }
        
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = doctorRouter;