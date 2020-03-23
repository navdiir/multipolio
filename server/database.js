import Mongoose from 'mongoose';
import secrets from './secret';

// Mongoose.connect(`mongodb://${secrets.database.user}:${secrets.database.password}@${secrets.database.server}.mlab.com:${secrets.database.port}/commission`, {useCreateIndex: true, useNewUrlParser: true});
Mongoose.connect(`mongodb+srv://${secrets.database.user}:${secrets.database.password}@multipolio-pxoep.mongodb.net/${secrets.database.name}?retryWrites=true&w=majority`, {useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true});

let db = Mongoose.connection;
db.on('err',console.error.bind(console,'Connection Error: '));
db.once('open', ()=>{
	console.log('Database is Connected!');
	return db;
})