import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import connectDB from '../config/database';
import { connectBOT } from '../src/controllers/bot';
import connectSocket from '../src/controllers/socket';
import Routes from './routes';
import { RetrunValidation } from './middleware/validation';
const dir = require('../../db');

const port = 3001;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

connectSocket(io);
connectDB();
connectBOT();

app.set('port', port);
app.set('socketio', io);
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', Routes);

app.use(express.static(path.join(dir.BASEDIR, '..', 'upload')));

app.use(RetrunValidation);
app.use(express.static(path.join(dir.BASEDIR, '../unison-frontend/', 'build')));
app.get('*', (req: express.Request, res: express.Response) => {
  res.sendFile(
    path.join(dir.BASEDIR, '../unison-frontend/', 'build/index.html')
  );
});
server.listen(port);
console.log('server listening on:', port);
