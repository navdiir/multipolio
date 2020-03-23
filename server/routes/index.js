import { Router } from 'express';
import apiGame from './apiGame';

const app = Router();

app.use('/game',apiGame);

export default app;