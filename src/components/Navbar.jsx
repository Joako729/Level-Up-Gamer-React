import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const CATS = ['Todos','Juegos de mesa','Accesorios','Consolas','PCs','Ropa'];

export default function Navbar(){
  const navigate = useNavigate();
  const [q, setQ] = React.useState('');

  function normaliza(s){
    return (s || '').toString().trim().toLowerCase();
  }

  function onSearch(e){
    e.preventDefault();
    const entrada = normaliza(q);

    // intenta “matchear” contra las categorías conocidas
    const match = CATS.find(c => normaliza(c) === entrada)
      // aceptamos abreviaturas comunes
      || (entrada.includes('juego') ? 'Juegos de mesa' : null)
      || (entrada.includes('consol') ? 'Consolas' : null)
      || (entrada === 'pc' || entrada === 'pcs' ? 'PCs' : null)
      || (entrada.includes('ropa') ? 'Ropa' : null)
      || (entrada.includes('acces') ? 'Accesorios' : null)
      || (entrada.includes('todo') ? 'Todos' : null);

    // si hay match vamos a /categorias con la query ?cat=
    if (match){
      navigate(`/categorias?cat=${encodeURIComponent(match)}`);
      setQ('');
    }else{
      // si no, te llevo igual a categorías (filtras ahí)
      navigate(`/categorias`);
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">Level-Up Gamer</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMain">
          {/* Buscador */}
          <form className="d-flex ms-lg-3 my-2 my-lg-0" role="search" style={{maxWidth: 380}} onSubmit={onSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder='Buscar: "Juegos de mesa", "Consolas", "PCs"...'
              value={q}
              onChange={e=>setQ(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">Buscar</button>
          </form>

          {/* Links centro */}
          <ul className="navbar-nav ms-lg-3 me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>

            <li className="nav-item dropdown">
              <NavLink className="nav-link dropdown-toggle" to="/categorias" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Categorías
              </NavLink>
              <ul className="dropdown-menu">
                {CATS.map(c=>(
                  <li key={c}>
                    <Link className="dropdown-item" to={`/categorias?cat=${encodeURIComponent(c)}`}>{c}</Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/ofertas">Ofertas</NavLink>
            </li>
          </ul>

          {/* Botones derecha */}
          <div className="d-flex gap-2">
            <Link to="/carrito" className="btn btn-success fw-bold">🛒 Carrito</Link>
            <Link to="/admin" className="btn btn-outline-light">Admin</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
