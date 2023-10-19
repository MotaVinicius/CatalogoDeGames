const express = require('express')
const mongoose = require('mongoose');

const app = express()
const port = 3000

mongoose.connect('mongodb+srv://motavinicius:Aguia999*@catalogogames-api.1b1fxq3.mongodb.net/?retryWrites=true&w=majority');
const Game = mongoose.model('Game', {
     name: String,
     genero: String,
     lancamento: Number});

app.get('/', async (req,res) => {
    const games = await Game.find()
    res.send(games)
})

app.post('/', async (req,res) => {
    const game = new Game({
        name: req.body.name,
        genero: req.body.genero,
        lancamento: req.body.lancamento
    })
    await game.save()
    res.send(game)
})

app.put('/:id', async(req, res) => {
    const game = await Game.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        genero: req.body.genero,
        lancamento: req.body.lancamento
    },  {
        new: true
    })
    return res.send(game)
})

app.delete("/", async (req, res) => {
    const game = await Game.findByIdAndRemove(req.params.id)
    return res.send(game)
})

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})