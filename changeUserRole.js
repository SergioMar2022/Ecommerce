// Endpoint para cambiar el rol de un usuario
app.post('/api/users/premium/:uid', (req, res) => {
    const { uid } = req.params;
    const { role } = req.body;
  
    // Buscar el usuario por su ID
    const user = users.find(user => user.id === uid);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
  
    // Actualizar el rol del usuario
    user.role = role;
  
    res.json({ message: 'Rol de usuario actualizado exitosamente.' });
  });
  