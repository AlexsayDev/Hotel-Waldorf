import 'dotenv/config';
import app from './app.js';
import { testConnection } from './config/db.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await testConnection();
        console.log('Base de datos conectada correctamente');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
};

startServer();