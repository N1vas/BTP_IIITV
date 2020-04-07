const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
var timeCheck = 0;

function encrypt(text){
    var start2= new Date().getTime();
    let  cipher = crypto.createCipheriv('aes-256-cbc',Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    var stop2 = new Date().getTime();
    var diff2 = stop2 - start2;
    timeCheck += diff2;

    //console.log(diff2);
    //console.log(encrypted);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    //console.log(encrypted);
    return { iv : iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}
//var timeCheck = 0;
//var start= new Date().getTime();
//for(var i=0; i<99; i++){

var hw = encrypt("b21541791e8c853d0e3a789551ea67a13acfcedc930e856ea622a6e52fe2a77f");
//var stop = new Date().getTime();
//var diff = stop - start;
//console.log(diff);
//}
//timeCheck = timeCheck/100;
console.log(timeCheck);

console.log(hw);