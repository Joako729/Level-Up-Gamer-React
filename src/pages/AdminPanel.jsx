import React, { useState } from 'react';

const AdminPanel = () => {
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [productoNombre, setProductoNombre] = useState('');
  const [productoPrecio, setProductoPrecio] = useState('');
  const [productoCategoria, setProductoCategoria] = useState('');
  const [productoOferta, setProductoOferta] = useState('No');
  const [productos, setProductos] = useState([
    { id: 'p1', nombre: 'Teclado Mecánico RGB', precio: 39990, categoria: 'Periféricos', oferta: 'Sí' },
    { id: 'p2', nombre: 'Mouse Gamer 12K DPI', precio: 19990, categoria: 'Periféricos', oferta: 'No' },
    { id: 'p3', nombre: 'Audífonos 7.1', precio: 29990, categoria: 'Audio', oferta: 'Sí' },
  ]);

  const agregarProducto = () => {
    const nuevoProducto = {
      id: `p${productos.length + 1}`,
      nombre: productoNombre,
      precio: productoPrecio,
      categoria: productoCategoria,
      oferta: productoOferta,
    };

    setProductos([...productos, nuevoProducto]);

    // Limpiar el formulario después de agregar el producto
    setProductoNombre('');
    setProductoPrecio('');
    setProductoCategoria('');
    setProductoOferta('No');
  };

  const eliminarProducto = (id) => {
    const nuevosProductos = productos.filter((producto) => producto.id !== id);
    setProductos(nuevosProductos);
  };

  const editarProducto = (id) => {
    const producto = productos.find((producto) => producto.id === id);
    setProductoNombre(producto.nombre);
    setProductoPrecio(producto.precio);
    setProductoCategoria(producto.categoria);
    setProductoOferta(producto.oferta);
    eliminarProducto(id); // Eliminar el producto para que el formulario lo reemplace
  };

  const manejarMostrarProductos = () => {
    setMostrarProductos(!mostrarProductos);
  };

  return (
    <div className="container-fluid p-3">
      <h2>Panel de Administración</h2>

      {/* Botones para gestionar productos y usuarios */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-header">Compras</div>
            <div className="card-body">
              <h5 className="card-title">1234</h5>
              <p className="card-text">Probabilidad de aumento: 20%</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Productos</div>
            <div className="card-body">
              <h5 className="card-title">400</h5>
              <p className="card-text">Inventario actual: 500</p>
              <button onClick={manejarMostrarProductos} className="btn btn-light">
                Gestionar Productos
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning mb-3">
            <div className="card-header">Usuarios</div>
            <div className="card-body">
              <h5 className="card-title">892</h5>
              <p className="card-text">Nuevos este mes: 120</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección para gestionar productos */}
      {mostrarProductos && (
        <div>
          <h3>Agregar Nuevo Producto</h3>
          <form>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                className="form-control"
                value={productoNombre}
                onChange={(e) => setProductoNombre(e.target.value)}
                placeholder="Nombre del producto"
              />
            </div>
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                className="form-control"
                value={productoPrecio}
                onChange={(e) => setProductoPrecio(e.target.value)}
                placeholder="Precio del producto"
              />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <select
                className="form-control"
                value={productoCategoria}
                onChange={(e) => setProductoCategoria(e.target.value)}
              >
                <option value="">Selecciona categoría</option>
                <option value="Periféricos">Periféricos</option>
                <option value="Audio">Audio</option>
                <option value="Muebles">Muebles</option>
                <option value="Monitores">Monitores</option>
              </select>
            </div>
            <div className="form-group">
              <label>En Oferta</label>
              <select
                className="form-control"
                value={productoOferta}
                onChange={(e) => setProductoOferta(e.target.value)}
              >
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>
            <button type="button" onClick={agregarProducto} className="btn btn-success mt-3">
              Agregar Producto
            </button>
          </form>

          <h3 className="mt-5">Listado de Productos</h3>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Oferta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>${producto.precio}</td>
                  <td>{producto.oferta}</td>
                  <td>
                    <button onClick={() => editarProducto(producto.id)} className="btn btn-primary">
                      Editar
                    </button>
                    <button onClick={() => eliminarProducto(producto.id)} className="btn btn-danger ml-2">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
