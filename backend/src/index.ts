import express from 'express';
import cors from 'cors';
import cards from './routes/cards';
import inventory from './routes/inventory';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/cards', cards);
app.use('/api/inventory', inventory);

app.listen(3001, () => console.log('API on http://localhost:3001'));
