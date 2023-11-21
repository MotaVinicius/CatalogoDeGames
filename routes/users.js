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

router.post('/login', async(req,res)=>{
  let dadosLogin = req.body;
  let senhaCrypto = sha2.sha224(req.body.senha).toString('hex');
  try{
    let resultado = await db.logar(dadosLogin.login, senhaCrypto);
    if(resultado){
      const token = sha2.sha224(new Date() + resultado.login).toString('hex');
      req.session.token = token;
      req.session.login = resultado.login;
      res.status(200).json({token: token, user: resultado.nome})
    }else{
      res.status(200).json({message: "Usuário e/ou senha inválidos."});
    }}catch(erro){
      console.log(erro);
      res.status(500).json({message: "Erro ao autenticar o usuário. Tente novamente."});
    }
  });

  router.post('/logout',(req,res)=>{
    let tokenUsuario = req.body.token;//receberemos o token do usuário
    if(req.session.token == tokenUsuario){
      req.session.destroy();
    }
    res.status(200).end();
  });

module.exports = router;