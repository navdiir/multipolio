import { Router } from 'express';
import * as gameController from '../controller/apiGame';

const app = Router();

app.get('/:id', gameController.searchGame);
app.get('/valid/:id', gameController.validGame);
app.post('/create', gameController.createGame);
app.put('/join/:id', gameController.joinGame);
app.put('/removePlayer/:id', gameController.removePlayer);
app.put('/updateStatus/:id', gameController.updateStatus);
app.put('/startGame/:id', gameController.startGame);
app.put('/updateTurns/:id', gameController.updateTurns);
app.put('/lose/:id/:idPlayer', gameController.loseGame);
app.put('/buyProperty/:id/:idPlayer', gameController.buyProperty);

export default app;