require('dotenv').config();

exports.Api_key = (req, res, next) => {
    const apiKey = req.headers['x-api-key']

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({
            message: 'Acceso denegado. API key no válida.'
        })
    }
    next();
}