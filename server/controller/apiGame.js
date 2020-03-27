import Game from '../models/gameSchema';

export async function searchGame(req,res){
    const games = await Game.findById(req.params.id);
    return res.json(games);
}

export async function validGame(req,res){
    const games = await Game.findById(req.params.id);
    if(games.totalPlayers==games.players.length){
        return res.json({error:'404'});
    }
    return res.json(games);
}

export async function createGame(req,res){
    const newGame = new Game();
    newGame.totalPlayers = Number(req.body.players);
    newGame.start = false;
    newGame.players.push({ name: req.body.name, idPlayer: req.body.id, creator: true, cash: 1500, turn: 1,image: 'dog', freePass: 0, properties: [], active: false, loss: false });
    await newGame.save();
    return res.json(newGame);
}

export async function joinGame(req,res){
    const game = await Game.findById(req.params.id);
    game.players.push({ name: req.body.name, idPlayer: req.body.id, creator: false, cash: 1500, turn: game.players.length+1, image: 'cat', freePass:0 , properties: [], active: false, loss: false });
    await game.save();
    return res.json(game);
}

export async function loseGame(req,res){
    const game = await Game.findById(req.params.id);
    game.players[game.players.map(e=>e.idPlayer).indexOf(req.params.idPlayer)].loss=true;
    await game.save();
    return res.json(game);
}

export async function updateStatus(req,res){
    const game = await Game.findById(req.params.id);
    for(let indexPlayer in game.players){
        if(game.players[indexPlayer].idPlayer==req.body.idPlayer){
            game.players[indexPlayer].active = req.body.status;
            break;
        }
    }
    await game.save();
    return res.json(game);
}

export async function removePlayer(req,res){
    const game = await Game.findById(req.params.id);
    let indexPlayer = game.players.map(e=>e.idPlayer).indexOf(req.body.idPlayer);
    game.players.splice(indexPlayer,1);
    await game.save();
    return res.json(game);
}

export async function startGame(req,res){
    const game = await Game.findById(req.params.id);
    game.start=true;
    await game.save();
    return res.json(game);
}

export async function updateTurns(req,res){
    const game = await Game.findById(req.params.id);
    let partialResults = req.body.partials.sort((a,b,)=>b.sum-a.sum);
    let playersTemp = game.players.map(e=>e.turn);
    for(let indexPartial in partialResults){
        let indexPlayer = playersTemp.indexOf(partialResults[indexPartial].turn);
        game.players[indexPlayer].turn = Number(indexPartial)+1;
    }

    await game.save();
    return res.json(game);
}