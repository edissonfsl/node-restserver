const jwt = require('jsonwebtoken');

// ======================
// Verificar Token
// =======================
let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decode.usuario;
        next();

    });
};

// ======================
// Verificar Token
// =======================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Necesitas privilegios ADMIN'
            }
        });
    }
    next();
};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}