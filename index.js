const express = require('express')
const mongoose = require('mongoose');
var logger = require('morgan');
var cors = require('cors');

const app = express()

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
const port = process.env.PORT || 3333 ;

mongoose.connect('mongodb+srv://motavinicius:Aguia999*@catalogogames-api.1b1fxq3.mongodb.net/?retryWrites=true&w=majority');
const Game = mongoose.model('Game', {
     name: String,
     description: String,
     image_url: String,
     genero: String,
     ratings: Number,
     lancamento: Number});

app.get('/', async (req,res) => {
    try{
    const games = await Game.find({}).sort({ratings: -1}).limit(15)
    res.status(200).json(games)
    }catch(erro){
        console.log(erro);
        res.status(500).json({message: "Algo de errado aconteceu. Falha ao listar nossa biblioteca de games."})
    }
})

app.get('/full', async (req,res) => {
    try{
    const games = await Game.find({}).sort({name: +1})
    res.status(200).json(games)
    }catch(erro){
        console.log(erro);
        res.status(500).json({message: "Algo de errado aconteceu. Falha ao listar nossa biblioteca de games."})
    }
})

app.get('/lancamento', async (req,res) => {
    try{
    const games = await Game.find({lancamento: 2023}).sort({lancamento: -1}).limit(15)
    res.status(200).json(games)
    }catch(erro){
        console.log(erro);
        res.status(500).json({message: "Algo de errado aconteceu. Falha ao listar nossa biblioteca de games."})
    }
})

app.get('/busca', async (req, res) => {
    const { query } = req.query;
  
    try {
      const results = await Game.find({ name: { $regex: query, $options: 'i' } }); // Use regex para buscar parcialmente e case-insensitive
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

app.post('/add', async (req,res) => {
    const game = new Game({
        name: req.body.name,
        description: req.body.description,
        image_url: req.body.image_url,
        genero: req.body.genero,
        ratings: parseInt(req.body.ratings),
        lancamento: parseInt(req.body.lancamento)
    })
    const anoAtual = new Date().getFullYear();
    if(game.name !== undefined && game.name && game.lancamento !== undefined && !isNaN(game.lancamento) && (game.lancamento >= 1972 && game.lancamento <= anoAtual) && (game.ratings >= 0 && game.ratings <= 10)){
        try{
            await game.save()
            res.status(200).json({message: `O Game ${game.name} foi adicionado com sucesso`});
        }catch(erro){
            console.log(erro);
            res.status(500).json({message: `Erro ao adicionar ${game.name}. Tente novamente`})
        }
    }else{
        res.status(400).json({message: "Dados não foram preenchidos corretamente. Verifique e tente novamente"});
    }
    
})

app.put('/:id', async(req, res) => {
    const game = await Game.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        image_url: req.body.image_url,
        genero: req.body.genero,
        ratings: req.body.ratings,
        lancamento: req.body.lancamento
    },  {
        new: true
    })
    return res.send(game)
})

app.delete("/:id", async (req, res) => {
    const game = await Game.findByIdAndRemove(req.params.id)
    return res.send(game)
})

app.listen(port, () => {
    console.log(`App running on port ${port}`)
}) 
//Em desenvolvimento
