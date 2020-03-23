import { Schema,model } from 'mongoose';

const game = new Schema({
    totalPlayers: Number,
    start: Boolean,
    players: [
        {
            name: String,
            idPlayer: String,
            cash: Number,
            creator: Boolean,
            freePass: Number,
            turn: Number,
            image: String,
            active: Boolean,
            loss: Boolean,
            properties:[
                {
                    idProperty: Number,
                    houses: Number,
                    hotels: Number
                }
            ]
        }
    ]
});

export default model('Games',game);