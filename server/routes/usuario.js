const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

const Usuario = new require('../models/usuario.js');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

// app.get('/', function(req, res) {
//     res.status(200).send({
//         message: 'Servidor activo y corriendo'
//     });
// });

app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                res.status(400).json({
                    of: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, cont) => {
                res.status(200).json({
                    ok: true,
                    total: cont,
                    usuarios
                });
            });

        });
});

app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.correo,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        } else {
            res.status(200).json({
                ok: true,
                usuario: usuarioBD
            });
        }
    });
});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBD
        });
    });
});

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    })

});

// app.delete('/usuario/:id', function(req, res) {
//     let id = req.params.id;
//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 error: err
//             });
//         }

//         if (!usuarioBorrado) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'Usuario no encontrado'
//                 }
//             });
//         }

//         res.status(200).json({
//             ok: true,
//             usuario: usuarioBorrado
//         });
//     })

// });

module.exports = app;