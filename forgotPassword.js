// Endpoint para enviar el correo de recuperación de contraseña
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  // Verificar si el correo existe en la base de datos
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(404).json({ message: 'El correo electrónico no está registrado.' });
  }

  // Generar un token único y guardar su fecha de expiración
  const token = generateToken();
  const expirationDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hora de expiración
  user.resetPasswordToken = token;
  user.resetPasswordExpiration = expirationDate;

  // Enviar el correo con el enlace para restablecer la contraseña
  sendPasswordResetEmail(email, token);

  res.json({ message: 'Se ha enviado un correo electrónico para restablecer la contraseña.' });
});

// Endpoint para restablecer la contraseña usando el token
app.post('/reset-password', (req, res) => {
  const { token, password } = req.body;

  // Buscar el usuario con el token de restablecimiento válido
  const user = users.find(user => user.resetPasswordToken === token && user.resetPasswordExpiration > new Date());
  if (!user) {
    return res.status(400).json({ message: 'El token es inválido o ha expirado.' });
  }

  // Verificar si la contraseña es diferente a la actual
  if (password === user.password) {
    return res.status(400).json({ message: 'La nueva contraseña no puede ser la misma que la actual.' });
  }

  // Restablecer la contraseña y limpiar el token y la fecha de expiración
  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpiration = null;

  res.json({ message: 'Contraseña restablecida exitosamente.' });
});
