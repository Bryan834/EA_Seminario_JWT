import express from 'express';
import mongoose from "mongoose";
import cors from 'cors'; 
import { Usuario } from './models/usuario';
import usuarioRoutes from './routes/usuarioRoutes'; 
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import eventoRoutes from './routes/eventoRoutes';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3000;
const port = 3001;

async function createDefaultAdmin() {
    try {
        const adminExists = await Usuario.findOne({ rol: 'admin' });
        if (!adminExists) {
            await Usuario.create({
                username: 'ADMIN',
                gmail: 'admin@example.com',
                password: '123456',
                birthday: new Date('1990-01-01'),
                rol: 'admin'
            });
            console.log('Usuario administrador por defecto creado');
        }
    } catch (error) {
        console.error('Error al crear el usuario administrador:', error);
    }
}

app.use(cors({
    origin: 'http://localhost:4200', // Reemplaza con el origen de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

//////////////////////AQUI APLICAMOS LAS VARIABLES PARA EL MIDDLE WARE CORS//////////////////////
app.use(express.json());
app.use(cookieParser());
app.use(express.json() as express.RequestHandler); 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//////////////////////AQUI CONECTAMOS A LA BASE DE DATOS//////////////////////
mongoose.connect('mongodb://localhost:27017/BBDD')
    .then(() => {
        console.log('CONEXION EXITOSA A LA BASE DE DATOS DE MONGODB'); 
        createDefaultAdmin(); // Llamamos a la función después de conectar
        app.listen(PORT, () => {
            console.log(`URL DEL SERVIDOR http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('HAY ALGUN ERROR CON LA CONEXION', err);
    });

app.use('/api/user', usuarioRoutes);
app.use('/api/event', eventoRoutes);