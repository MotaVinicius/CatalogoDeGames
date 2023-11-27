var express = require('express');
var router = express.Router();
var sha2 = require('sha2');
var logger = require('morgan');
var cors = require('cors');
const mongoose = require('mongoose');

const app = express()

const originsCors = ['http://localhost:5173','https://visionary-dolphin-4c5211.netlify.app','https://6564cb3b1a68030082883b79--visionary-dolphin-4c5211.netlify.app'];

app.use(cors({ origin: originsCors,
methods: ['GET','POST','PUT','DELETE','OPTIONS','HEAD'],
credentials: true, allowedHeaders: ['Content-Type']}));
app.use(logger('dev'));
app.use(express.json());
const port = process.env.PORT || 4000 ;

mongoose.connect('mongodb+srv://motavinicius:Aguia999*@catalogogames-api.1b1fxq3.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const LoginSchema = new mongoose.Schema({
  nome: String,
  login: String,
  senha: String
});


LoginSchema.statics.logar = async function(login, senhaCrypto) {
  return await this.findOne({ login, senha: senhaCrypto }).exec();
};

const Login = mongoose.model('Login', LoginSchema);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB:'));
db.once('open', () => {
  console.log('Conectado ao MongoDB!');
});


app.post('/addUser', async(req,res) =>{
  const login = new Login ({
    nome: req.body.nome,
    login: req.body.login,
    senha: sha2.sha224(req.body.senha).toString('hex')
  })
  if(login.nome && login.login && login.senha){
    try{
      await login.save()
      res.status(200).json({message:`O usuario ${login.nome} foi criado`})
    }catch(erro){
      res.status(500).json({message:`Falha ao adicionar o usuario ${login.nome}, tente novamente.`})
    } 
  }else{
    res.status(400).json({message: "Dados não foram preenchidos corretamente. Verifique e tente novamente"});
  }
})

app.get('/listarusers', async(req,res) => {
  try{
    const login = await Login.find({}).sort({nome: +1})
    res.status(200).json(login)
    }catch(erro){
        console.log(erro);
        res.status(500).json({message: "Algo de errado aconteceu. Falha ao listar nossa biblioteca de games."})
    }
})

app.post('/login', async(req,res)=>{
  let dadosLogin = req.body;
  let senhaCrypto = sha2.sha224(req.body.senha).toString('hex');
  try{

    console.log('Login:', dadosLogin.login);
    console.log('Senha criptografada:', senhaCrypto);

    let resultado = await Login.logar(dadosLogin.login, senhaCrypto);

    console.log('Resultado do login:', resultado);

    if(resultado){
      if (!req.session) {
        req.session = {};
      }
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

  app.post('/logout',(req,res)=>{
    if (!req.session) {
      req.session = {};
    }
    let tokenUsuario = req.body.token;//receberemos o token do usuário
    if(req.session.token == tokenUsuario){
      req.session.destroy();
    }
    res.status(200).end();
  });

  app.listen(port, () => {
    console.log(`App running on port ${port}`)
}) 

module.exports = router;