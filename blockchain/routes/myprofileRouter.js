const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Myprofiles = require('../models/myprofile');
const Hospitals = require('../models/hospitals');
var SHA256 = require("crypto-js/sha256");

const myprofileRouter = express.Router();

myprofileRouter.use(bodyParser.json());

myprofileRouter.route('/')
.options((req,res) => { res.sendStatus(200); })
.get(authenticate.verifyUser || authenticate.verifyAdmin, (req , res , next ) => {

    if(req.user.user_type=="admin"){
    Myprofiles.find(req.query) //passing query to find 
    .then((myprofiles) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(myprofiles);
    }, (err) => next(err))
    .catch((err) => next(err));
    }
    else{
        res.json("not allowed");
    }
})
.post(authenticate.verifyUser || authenticate.verifyAdmin, (req, res, next) => {
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
.delete( authenticate.verifyUser || authenticate.verifyAdmin, (req, res, next) => {
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
.get( authenticate.verifyUser , (req,res,next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofiles) => {
        if(myprofiles.user_id==req.user._id){    
          
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(myprofiles);
        }else{
            res.json("no access here");
        }   
            
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('you cannot create on /myprofile/'+ req.params.myprofileId);
})
.put( authenticate.verifyUser || authenticate.verifyAdmin || authenticate.verifyPatient,  (req, res, next) => {
    if(myprofiles.user_id==req.user._id){    

    Myprofiles.findByIdAndUpdate(req.params.myprofileId, {
        $set: req.body
    }, { new: true })
    .then((myprofile) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(myprofile);
    }, (err) => next(err))
    .catch((err) => next(err));
    }
})
.delete( authenticate.verifyUser || authenticate.verifyAdmin || authenticate.verifyPatient, (req, res, next) => {
    Myprofiles.findByIdAndRemove(req.params.myprofileId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


myprofileRouter.route('/:myprofileId/insurance')
.get(authenticate.verifyUser ,(req,res,next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null) {
            var check= "0";
            if(myprofiles.user_id==req.user._id){    
                check="2";
            }else  {  
            for(var i=0;i<myprofile.allow.length;i++){
                if(myprofile.allow[i].user_id==req.user._id){
                   check="1"; 
                   for(var j=0;j<myprofile.allow[i].divisiontype.length;j++){
                        if(myprofile.allow[i].divisiontype[j].division_name=="insurance" && myprofile.allow[i].divisiontype[j].perm_allow=="r"){
                            check="2";
                            
                        }     
                   }
                }
            }
            }
            if(check=="2"){
           
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(myprofile.insurance);
            } 
        }
        else {
            err = new Error('myprofile ' + req.params.myprofileId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser || authenticate.verifyDoctor,   (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null && myprofiles.user_id==req.user._id) {
            
             
            
            myprofile.insurance.push(req.body);
           
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





myprofileRouter.route('/:myprofileId/allow')
.get(authenticate.verifyUser || authenticate.verifyDoctor || authenticate.verifyPatient,(req,res,next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null && myprofiles.user_id==req.user._id) {
            
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(myprofile.allow);
             
        }
        else {
            err = new Error('myprofile ' + req.params.myprofileId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser || authenticate.verifyDoctor,   (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null && myprofiles.user_id==req.user._id) {           
            myprofile.allow.push(req.body);
           
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

myprofileRouter.route('/:myprofileId/allow/:allowId')
.get(authenticate.verifyUser || authenticate.verifyDoctor || authenticate.verifyPatient, (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if( myprofile != null && myprofile.allow.id && myprofiles.user_id==req.user._id) {

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(myprofile.doctorvisit.id(req.params.allowId));
            
        }
        else if (myprofile == null) {
            err = new Error('myprofile ' + req.params.myprofileId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('doctorvisit ' + req.params.allowId + ' not found');
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

//

myprofileRouter.route('/:myprofileId/allow/:allowId/divisiontype')
.get(authenticate.verifyUser || authenticate.verifyDoctor || authenticate.verifyPatient, (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if( myprofile != null && myprofile.allow.id && myprofiles.user_id==req.user._id) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(myprofile.allow.id(req.params.allowId).divisiontype);
        }
        else if (myprofile == null) {
            err = new Error('myprofile ' + req.params.myprofileId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('doctorvisit ' + req.params.allowId + ' not found');
            err.status = 404;
            return next(err);            
        }
        
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser || authenticate.verifyDoctor,   (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null && myprofile.allow.id && myprofiles.user_id==req.user._id) {

            myprofile.allow.id(req.params.allowId).divisiontype.push(req.body);
            
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

.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /myprofile');
})
.delete( (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /myprofile');
});


//////////////////////////////
myprofileRouter.route('/:myprofileId/allow/:allowId/divisiontype/:divisiontypeId')
.get(authenticate.verifyUser , (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if( myprofile != null && myprofile.allow.id(req.params.allowId).divisiontype && myprofiles.user_id==req.user._id) {

            
            

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(myprofile.allow.id(req.params.allowId).divisiontype.id(req.params.divisiontypeId));
            
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
.post( (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /myprofile');
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /myprofile');
})
.delete( (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /myprofile');
});


myprofileRouter.route('/:myprofileId/allow/:allowId/divisiontype/:divisiontypeId/division_name')
.get((authenticate.verifyUser ), (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if( myprofile != null && myprofile.allow.id(req.params.allowId).divisiontype && myprofiles.user_id==req.user._id) {

            
          
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(myprofile.allow.id(req.params.allowId).divisiontype.id(req.params.divisiontypeId).division_name);
              
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
.post( authenticate.verifyUser || authenticate.verifyLabtech, (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null && myprofile.allow.id(req.params.allowId).divisiontype.id(req.params.divisiontypeId) && myprofiles.user_id==req.user._id) {

            myprofile.allow.id(req.params.allowId).divisiontype.id(req.params.divisiontypeId).division_name.push(req.body);
            
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
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /myprofile');
})
.delete( (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /myprofile');
});

/////////////24th APril 2020
myprofileRouter.route('/:myprofileId/allow/:allowId/divisiontype/:divisiontypeId/division_name/:division_nameId')
.get((authenticate.verifyUser ), (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if( myprofile != null && myprofile.allow.id(req.params.allowId).divisiontype.id(req.params.divisiontypeId) && myprofiles.user_id==req.user._id) {

            
          
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(myprofile.allow.id(req.params.allowId).divisiontype.id(req.params.divisiontypeId).division_name.id(req.params.division_nameId));
              
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
});
//////now
myprofileRouter.route('/:myprofileId/allow/:allowId/divisiontype/:divisiontypeId/division_name/:division_nameId/permissiontype')
.get((authenticate.verifyUser ), (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if( myprofile != null && myprofile.allow.id(req.params.allowId).divisiontype.id(req.params.divisiontypeId) && myprofiles.user_id==req.user._id) {

            
          
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(myprofile.allow.id(req.params.allowId).divisiontype.id(req.params.divisiontypeId).division_name.id(req.params.division_nameId).permissiontype);
              
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
.post( authenticate.verifyUser || authenticate.verifyLabtech, (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null && myprofile.allow.id(req.params.allowId).divisiontype.id(req.params.divisiontypeId).division_name.id(req.params.division_nameId)&& myprofiles.user_id==req.user._id) {

            myprofile.allow.id(req.params.allowId).divisiontype.id(req.params.divisiontypeId).division_name.id(req.params.division_nameId).permissiontype.push(req.body);
            
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
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /myprofile');
})
.delete( (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /myprofile');
});




////////////////////////////////////////////////////
myprofileRouter.route('/:myprofileId/doctorvisit')
.get(authenticate.verifyUser || authenticate.verifyDoctor || authenticate.verifyPatient,(req,res,next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null) {
            console.log(req.user._id);
            console.log(myprofile._id);
            var check= "0";
            if(myprofiles.user_id==req.user._id){    
                check="2";
            }else  { 

            for(var i=0;i<myprofile.allow.length;i++){
                if(myprofile.allow[i].user_id==req.user._id){
                   check="1"; 
                   for(var j=0;j<myprofile.allow[i].divisiontype.length;j++){
                        if(myprofile.allow[i].divisiontype[j].division_name=="doctor" && myprofile.allow[i].divisiontype[j].perm_allow=="r"){
                            check="2";
                            
                        }     
                   }
                }
            }
            }
            if(check == "2"){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(myprofile.doctorvisit);
            }    
            else{
                res.statusCode = 403;
    res.end('you didnt have permisiion here'+ req.params.myprofileId);
            }    
        }
        else {
            err = new Error('myprofile ' + req.params.myprofileId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser || authenticate.verifyDoctor,   (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null) {
            var check= "0";
            for(var i=0;i<myprofile.allow.length;i++){
                if(myprofile.allow[i].user_id==req.user._id){
                   check="1"; 
                   for(var j=0;j<myprofile.allow[i].divisiontype.length;j++){
                        if(myprofile.allow[i].divisiontype[j].division_name=="doctorvisit" && myprofile.allow[i].divisiontype[j].perm_allow=="w" ){
                            
                            if(req.user.user_type=="doctor"){    
                                check="2";
                            }
                            console.log("for loop");


                            
                        }     
                   }
                }
            }
            console.log(check);
            console.log("for end");
            if(check=="2"){           
            myprofile.doctorvisit.push(req.body);
           
            myprofile.save()
            .then((myprofile) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(myprofile);
            }, (err) => next(err));

            }
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

.delete(authenticate.verifyUser || authenticate.verifyDoctor,  (req, res, next) => {
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
.get(authenticate.verifyUser || authenticate.verifyDoctor || authenticate.verifyPatient, (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if( myprofile != null && myprofile.doctorvisit.id) {

            var check= "0";
            if(myprofiles.user_id==req.user._id){    
                check="2";
            }else  { 
            for(var i=0;i<myprofile.allow.length;i++){
                if(myprofile.allow[i].user_id==req.user._id){
                   check="1"; 
                   for(var j=0;j<myprofile.allow[i].divisiontype.length;j++){
                        if(myprofile.allow[i].divisiontype[j].division_name=="doctorvisit" && myprofile.allow[i].divisiontype[j].perm_allow=="r"){
                            check="2";
                            
                        }     
                   }
                }
            }
            }
            if(check=="2"){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(myprofile.doctorvisit.id(req.params.doctorvisitId));
            }    

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




myprofileRouter.route('/:myprofileId/doctorvisit/:doctorvisitId/prescription')
.get(authenticate.verifyUser || authenticate.verifyDoctor || authenticate.verifyPatient, (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if( myprofile != null && myprofile.doctorvisit.id) {

            var check= "0";
            if(myprofiles.user_id==req.user._id){    
                check="2";
            }else  { 
            for(var i=0;i<myprofile.allow.length;i++){
                if(myprofile.allow[i].user_id==req.user._id){
                   check="1"; 
                   for(var j=0;j<myprofile.allow[i].divisiontype.length;j++){
                        if(myprofile.allow[i].divisiontype[j].division_name=="prescription" && myprofile.allow[i].divisiontype[j].perm_allow=="r"){
                            check="2";
                            
                        }     
                   }
                }
            }
            }
            if(check=="2"){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(myprofile.doctorvisit.id(req.params.doctorvisitId).prescription);
            }
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

.post(authenticate.verifyUser || authenticate.verifyDoctor,   (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null && myprofile.doctorvisit.id) {

            var check= "0";
            for(var i=0;i<myprofile.allow.length;i++){
                if(myprofile.allow[i].user_id==req.user._id){
                   check="1"; 
                   for(var j=0;j<myprofile.allow[i].divisiontype.length;j++){
                        if(myprofile.allow[i].divisiontype[j].division_name=="prescription" && myprofile.allow[i].divisiontype[j].perm_allow=="w"){
                            if(req.user.user_type=="doctor"){    
                                check="2";
                            }
                            
                            
                        }     
                   }
                }
            }
            if(check=="2"){

            myprofile.doctorvisit.id(req.params.doctorvisitId).prescription.push(req.body);
            
            myprofile.save()
            .then((myprofile) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(myprofile);
            }, (err) => next(err));
        }
        }
        else {
            err = new Error('myprofile ' + req.params.myprofileId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));

})

.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /myprofile');
})
.delete( (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /myprofile');
});



myprofileRouter.route('/:myprofileId/doctorvisit/:doctorvisitId/dohash')
.get(authenticate.verifyUser || authenticate.verifyDoctor || authenticate.verifyPatient, (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if( myprofile != null && myprofile.doctorvisit.id && myprofiles.user_id==req.user._id) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(myprofile.doctorvisit.id(req.params.doctorvisitId).dohash);
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

.post(authenticate.verifyUser || authenticate.verifyDoctor,   (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null && myprofile.doctorvisit.id && myprofiles.user_id==req.user._id) {

            req.body.cbhash = SHA256(myprofile.doctorvisit.id(req.params.doctorvisitId));
            const temp1 =req.body.cbhash;
            var a = myprofile.blockadd.length;
            console.log(a);
            const temp2 = myprofile.blockadd[a-1].cbhash;
            console.log(temp2);
            const lol = { 
                cbhash : temp1 ,
                pbhash : temp2
            };
            
            myprofile.doctorvisit.id(req.params.doctorvisitId).dohash.push(req.body);
            myprofile.blockadd.push(lol);
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

.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /myprofile');
})
.delete( (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /myprofile');
});




myprofileRouter.route('/:myprofileId/doctorvisit/:doctorvisitId/labreports')
.get(authenticate.verifyUser || authenticate.verifyDoctor || authenticate.verifyPatient, (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if( myprofile != null && myprofile.doctorvisit.id) {

            var check= "0";
            if(myprofiles.user_id==req.user._id){    
                check="2";
            }else  {
            for(var i=0;i<myprofile.allow.length;i++){
                if(myprofile.allow[i].user_id==req.user._id){
                   check="1"; 
                   for(var j=0;j<myprofile.allow[i].divisiontype.length;j++){
                        if(myprofile.allow[i].divisiontype[j].division_name=="labreports" && myprofile.allow[i].divisiontype[j].perm_allow=="r"){
                            check="2";
                            
                        }     
                   }
                }
            }
            }
            if(check=="2"){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(myprofile.doctorvisit.id(req.params.doctorvisitId).labreports);
            }
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

.post(authenticate.verifyUser || authenticate.verifyDoctor,   (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null && myprofile.doctorvisit.id) {
            
            if(req.user.user_type=="doctor"){    
                
                myprofile.doctorvisit.id(req.params.doctorvisitId).labreports.push(req.body);            
                myprofile.save()
                .then((myprofile) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(myprofile);
                }, (err) => next(err));
            }
        }
        else {
            err = new Error('myprofile ' + req.params.myprofileId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));

})

.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /myprofile');
})
.delete( (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /myprofile');
});

myprofileRouter.route('/:myprofileId/doctorvisit/:doctorvisitId/labreports/:labreportsId')
.get(authenticate.verifyUser || authenticate.verifyDoctor || authenticate.verifyPatient || authenticate.verifyLabtech, (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if( myprofile != null && myprofile.doctorvisit.id(req.params.doctorvisitId).labreports) {

            var check= "0";
            if(myprofiles.user_id==req.user._id){    
                check="2";
            }else  {
            for(var i=0;i<myprofile.allow.length;i++){
                if(myprofile.allow[i].user_id==req.user._id){
                   check="1"; 
                   for(var j=0;j<myprofile.allow[i].divisiontype.length;j++){
                        if(myprofile.allow[i].divisiontype[j].division_name=="labreports" && myprofile.allow[i].divisiontype[j].perm_allow=="r"){
                            check="2";
                            
                        }     
                   }
                }
            }
            }
            if(check=="2"){

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(myprofile.doctorvisit.id(req.params.doctorvisitId).labreports.id(req.params.labreportsId));
            }
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
.post( (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /myprofile');
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /myprofile');
})
.delete( (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /myprofile');
});


myprofileRouter.route('/:myprofileId/doctorvisit/:doctorvisitId/labreports/:labreportsId/reportdata')
.get((authenticate.verifyUser || (authenticate.verifyPatient || authenticate.verifyLabtech || authenticate.verifyDoctor)), (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if( myprofile != null && myprofile.doctorvisit.id(req.params.doctorvisitId).labreports) {

            var check= "0";
            if(myprofiles.user_id==req.user._id){    
                check="2";
            }else  {
            for(var i=0;i<myprofile.allow.length;i++){
                if(myprofile.allow[i].user_id==req.user._id){
                   check="1"; 
                   for(var j=0;j<myprofile.allow[i].divisiontype.length;j++){
                        if(myprofile.allow[i].divisiontype[j].division_name=="labreports" && myprofile.allow[i].divisiontype[j].perm_allow=="r"){
                            check="2";
                            
                        }     
                   }
                }
            }
            }
            if(check=="2"){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(myprofile.doctorvisit.id(req.params.doctorvisitId).labreports.id(req.params.labreportsId).reportdata);
            }    
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
.post( authenticate.verifyUser || authenticate.verifyLabtech, (req, res, next) => {
    Myprofiles.findById(req.params.myprofileId)
    .then((myprofile) => {
        if (myprofile != null && myprofile.doctorvisit.id(req.params.doctorvisitId).labreports.id(req.params.labreportsId).reportdata) {
  
            

            if(req.user.user_type=="labtech"){
            myprofile.doctorvisit.id(req.params.doctorvisitId).labreports.id(req.params.labreportsId).reportdata.push(req.body);
            
            myprofile.save()
            .then((myprofile) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(myprofile);
            }, (err) => next(err));
            
            }

        }
        else {
            err = new Error('myprofile ' + req.params.myprofileId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /myprofile');
})
.delete( (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /myprofile');
});


module.exports = myprofileRouter;