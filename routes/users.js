var express = require('express');
var router = express.Router();
var sha2 = require('sha2');

router.get('/gerasenhacrypto/:senha', function(req, res, next) {
  if(req.params.senha){
    let senhaCrypto = sha2.sha224(req.params.senha).toString('hex');
    res.status(200).json({senhaCrypto: senhaCrypto});
  }else
    res.send('Não há senha para criptografar');
});

module.exports = router;