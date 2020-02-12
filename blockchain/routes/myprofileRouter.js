const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Myprofiles = require('../models/myprofile');

const myprofileRouter = express.Router();

myprofileRouter.use(bodyParser.json());

myprofileRouter.route('/')
.options((req,res) => { res.sendStatus(200); })
.get(authenticate.verifyUser, (req , res , next ) => {
    Myprofiles.find(req.query) //passing query to find 
    .then((myprofiles) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(myprofiles);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    req.body.myprofile_name = req.user._id;
    Myprofiles.create(req.body)
    .then((myprofile) => {
        console.log('myprofile Created ',myprofile);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(myprofile);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /myprofile');
})
.delete( authenticate.verifyUser, (req, res, next) => {
    Myprofiles.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

myprofileRouter.route('/:myprofileId')
.options( (req, res) => { res.sendStatus(200); })
.get(authenticate.verifyUser, (req,res,next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofiles) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(myprofiles);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('you cannot create on /myprofile/'+ req.params.myprofileId);
})
.put( authenticate.verifyUser,  (req, res, next) => {
    Myprofiles.findByIdAndUpdate(req.params.myprofileId, {
        $set: req.body
    }, { new: true })
    .then((myprofile) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(myprofile);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete( authenticate.verifyUser,  (req, res, next) => {
    Myprofiles.findByIdAndRemove(req.params.myprofileId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

myprofileRouter.route('/:myprofileId/doctorvisit')
.get(authenticate.verifyUser,(req,res,next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(myprofile.doctorvisit);
        }
        else {
            err = new Error('myprofile ' + req.params.myprofileId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,  (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null) {
            req.body.labtech_name = req.user._id;
            myprofile.doctorvisit.push(req.body);
            myprofile.save()
            .then((myprofile) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(myprofile);
            }, (err) => next(err));
        }
        else {
            err = new Error('myprofile ' + req.params.myprofileId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));

})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /myprofile/'
        + req.params.myprofileId );
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null) {
            for (var i = (myprofile.doctorvisit.length -1); i >= 0; i--) {
                myprofile.doctorvisit.id(myprofile.doctorvisit[i]._id).remove();
            }
            myprofile.save()
            .then((myprofile) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(myprofile);                
            }, (err) => next(err));
        }
        else {
            err = new Error('myprofile ' + req.params.myprofileId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

myprofileRouter.route('/:myprofileId/doctorvisit/:doctorvisitId')
.get(authenticate.verifyUser, (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if( myprofile != null && myprofile.doctorvisit.id) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(myprofile.doctorvisit.id(req.params.doctorvisitId));
        }
        else if (myprofile == null) {
            err = new Error('myprofile ' + req.params.myprofileId + ' not found');
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
    res.end('you cannot create on /myprofile/'+ req.params.myprofileId);
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /myprofile');
})
.delete( (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /myprofile');
});

myprofileRouter.route('/:myprofileId/doctorvisit/:doctorvisitId/labreports')
.get(authenticate.verifyUser, (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if( myprofile != null && myprofile.doctorvisit.id) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(myprofile.doctorvisit.id(req.params.doctorvisitId).labreports);
        }
        else if (myprofile == null) {
            err = new Error('myprofile ' + req.params.myprofileId + ' not found');
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

.post(authenticate.verifyUser,  (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null && myprofile.doctorvisit.id) {
            myprofile.doctorvisit.id(req.params.doctorvisitId).labreports.push(req.body);
            
            myprofile.save()
            .then((myprofile) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(myprofile);
            }, (err) => next(err));
        }
        else {
            err = new Error('myprofile ' + req.params.myprofileId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));

});



module.exports = myprofileRouter;