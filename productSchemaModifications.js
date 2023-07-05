// Esquema de Producto
const productSchema = new Schema({
    name: { type: String, required: true },
    // Otros campos del producto...
    owner: { type: Schema.Types.ObjectId, ref: 'User', default: 'admin' }
  });
  
  // Endpoint para crear un producto
  app.post('/api/products', (req, res) => {
    const { name, ownerId } = req.body;
  
    // Verificar si el usuario es premium antes de asignarlo como propietario
    const user = users.find(user => user.id === ownerId && user.role === 'premium');
    if (!user) {
      return res.status(403).json({ message: 'Solo los usuarios premium pueden crear productos.' });
    }
  
    // Crear el nuevo producto con el propietario asignado
    const product = new Product({
      name,
      owner: ownerId
      // Otros campos del producto...
    });
  
    // Guardar el producto en la base de datos
    product.save()
      .then(() => res.json({ message: 'Producto creado exitosamente.' }))
      .catch(error => res.status(500).json({ message: 'Error al crear el producto.', error }));
  });
  
  // Endpoint para eliminar un producto
  app.delete('/api/products/:productId', (req, res) => {
    const { productId } = req.params;
    const { userId } = req.body;
  
    // Buscar el producto por su ID
    const product = products.find(product => product.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
  
    // Verificar los permisos de eliminación del producto
    if (user.role === 'premium' && product.owner !== user.id) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar este producto.' });
    }
  
    // Eliminar el producto de la base de datos
    products = products.filter(product => product.id !== productId);
  
    res.json({ message: 'Producto eliminado exitosamente.' });
  });
  
  // Endpoint para agregar un producto al carrito
  app.post('/api/cart', (req, res) => {
    const { productId, userId } = req.body;
  
    // Verificar si el usuario es premium y no es el propietario del producto
    const user = users.find(user => user.id === userId && user.role === 'premium');
    const product = products.find(product => product.id === productId);
    if (user && product.owner === user.id) {
      return res.status(403).json({ message: 'No puedes agregar tu propio producto al carrito.' });
    }
  
    // Agregar el producto al carrito del usuario
    user.cart.push(productId);
  
    res.json({ message: 'Producto agregado al carrito exitosamente.' });
  });
  