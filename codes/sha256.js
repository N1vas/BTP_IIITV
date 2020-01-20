var crypto = require('crypto');
var fs = require('fs');

var fileName = './ourdata.txt'

//var hash = 'b21541791e8c853d0e3a789551ea67a13acfcedc930e856ea622a6e52fe2a77f';
var hash;
var bapatla = [];
//bapatla.push(hash);

var timeCheck = 0;



for(var j=0;j<999;j++){

    bapatla=[];
    hash = 'b21541791e8c853d0e3a789551ea67a13acfcedc930e856ea622a6e52fe2a77f';
    bapatla.push(hash);
    var start= new Date().getTime();
    for(var i=0; i<1999; i++){

        hash = crypto.createHash('sha256').update(hash).digest('hex');    
        bapatla.push(hash);
        
    }
    var stop = new Date().getTime();
    var diff = stop - start;
    timeCheck += diff;
    
}

timeCheck = timeCheck/1000;
console.log("average time is: "+timeCheck+" ms");

fs.writeFileSync(fileName, bapatla.join('\n'));



