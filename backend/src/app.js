import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'API del Sistema de Reservas para Hotel funcionando'
    });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;