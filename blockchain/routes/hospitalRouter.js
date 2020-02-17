const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Hospitals = require('../models/hospitals');

const hospitalRouter = express.Router();

hospitalRouter.use(bodyParser.json());

hospitalRouter.route('/')
.options((req,res) => { res.sendStatus(200); })
.get(authenticate.verifyUser || authenticate.verifyAdmin, (req , res , next ) => {
    Hospitals.find(req.query) //passing query to find 
    .then((hospitals) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(hospitals);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser || authenticate.verifyAdmin, (req, res, next) => {
    
    Hospitals.create(req.body)
    .then((hospital) => {
        console.log('hospital Created ',hospital);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(hospital);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /hospital');
})
.delete( authenticate.verifyUser || authenticate.verifyAdmin, (req, res, next) => {
    Hospitals.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

hospitalRouter.route('/:hospitalId')
.options( (req, res) => { res.sendStatus(200); })
.get(authenticate.verifyUser || authenticate.verifyAdmin || authenticate.verifyPatient, (req,res,next) => {
    Hospitals.findById(req.params.hospitalId)
    .then((hospitals) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(hospitals);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('you cannot create on /hospital/'+ req.params.hospitalId);
})
.put( authenticate.verifyUser || authenticate.verifyAdmin || authenticate.verifyPatient,  (req, res, next) => {
    Hospitals.findByIdAndUpdate(req.params.hospitalId, {
        $set: req.body
    }, { new: true })
    .then((hospital) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(hospital);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete( authenticate.verifyUser || authenticate.verifyAdmin || authenticate.verifyPatient, (req, res, next) => {
    Hospitals.findByIdAndRemove(req.params.hospitalId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

hospitalRouter.route('/:hospitalId/doctorvisit')
.get(authenticate.verifyUser || authenticate.verifyDoctor || authenticate.verifyPatient,(req,res,next) => {
    Hospitals.findById(req.params.hospitalId)
    .then((hospital) => {
        if (hospital != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(hospital.doctorvisit);
        }
        else {
            err = new Error('hospital ' + req.params.hospitalId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser || authenticate.verifyDoctor,   (req, res, next) => {
    Hospitals.findById(req.params.hospitalId)
    .then((hospital) => {
        if (hospital != null) {
            req.body.labtech_name = req.user._id;
            hospital.doctorvisit.push(req.body);
            hospital.save()
            .then((hospital) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(hospital);
            }, (err) => next(err));
        }
        else {
            err = new Error('hospital ' + req.params.hospitalId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));

})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /hospital/'
        + req.params.hospitalId );
})

.delete(authenticate.verifyUser || authenticate.verifyDoctor,  (req, res, next) => {
    Hospitals.findById(req.params.hospitalId)
    .then((hospital) => {
        if (hospital != null) {
            for (var i = (hospital.doctorvisit.length -1); i >= 0; i--) {
                hospital.doctorvisit.id(hospital.doctorvisit[i]._id).remove();
            }
            hospital.save()
            .then((hospital) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(hospital);                
            }, (err) => next(err));
        }
        else {
            err = new Error('hospital ' + req.params.hospitalId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

hospitalRouter.route('/:hospitalId/doctorvisit/:doctorvisitId')
.get(authenticate.verifyUser || authenticate.verifyDoctor || authenticate.verifyPatient, (req, res, next) => {
    Hospitals.findById(req.params.hospitalId)
    .then((hospital) => {
        if( hospital != null && hospital.doctorvisit.id) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(hospital.doctorvisit.id(req.params.doctorvisitId));
        }
        else if (hospital == null) {
            err = new Error('hospital ' + req.params.hospitalId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('doctorvisit ' + req.params.doctorvisitId + ' not found');
            err.status = 404;
            return next(err);            
        }
        
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    res.statusCode = 403;
    res.end('you cannot create on /hospital/'+ req.params.hospitalId);
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /hospital');
})
.delete( (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /hospital');
});


module.exports = hospitalRouter;