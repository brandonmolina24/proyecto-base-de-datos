const jwt = require('jsonwebtoken');
const { UsuarioInterno } = require('../models');

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que vengan los datos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y password son requeridos' 
      });
    }

    // Buscar usuario
    const usuario = await UsuarioInterno.findOne({ 
      where: { Email: email, Estado: 'Activo' } 
    });

    if (!usuario) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Validar password
    const passwordValido = await usuario.validarPassword(password);
    if (!passwordValido) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Actualizar último acceso
    await usuario.update({ UltimoAcceso: new Date() });

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: usuario.UsuarioID, 
        email: usuario.Email,
        rol: usuario.Rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      usuario: {
        id: usuario.UsuarioID,
        nombre: usuario.NombreCompleto,
        email: usuario.Email,
        rol: usuario.Rol,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener perfil del usuario autenticado
const perfil = async (req, res) => {
  try {
    const usuario = await UsuarioInterno.findByPk(req.usuario.userId, {
      attributes: { exclude: ['PasswordHash'] }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  login,
  perfil
};