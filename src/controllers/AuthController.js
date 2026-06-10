import jwt from 'jsonwebtoken';
import { usuarios } from '../data/usuarios.js';

export const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'username y password son requeridos.' });
    }

    const usuario = usuarios.find(u => u.username === username && u.password === password);

    if (!usuario) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
        { username: usuario.username, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    return res.json({
        success: true,
        token,
        user: { username: usuario.username, rol: usuario.rol }
    });
};
