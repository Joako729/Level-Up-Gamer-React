import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import AdminPanel from './AdminPanel';

interface User { id: number; nombre: string; email: string; rol: string; }
interface Order { id: number; fecha: string; total: number; estado: string; usuario?: { email: string }; detalles?: any[]; }

export default function Perfil(): JSX.Element {
  const [role, setRole] = useState('');
  const [activeTab, setActiveTab] = useState('perfil');
  
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  useEffect(() => {
    const r = localStorage.getItem('user_role') || '';
    setRole(r);
    if (r === 'ADMIN') loadOrders();
    else loadMyOrders();
  }, []);

  const loadUsers = async () => setUsers(await api.getUsers());
  
  const loadOrders = async () => { 
      try { 
          const data = await api.getAllOrders();
          console.log("Pedidos Admin:", data); // MIRA LA CONSOLA F12
          setOrders(data); 
      } catch(e) { console.error(e); } 
  };

  const loadMyOrders = async () => { 
      try { 
          const data = await api.getMyOrders();
          console.log("Mis Pedidos:", data); // MIRA LA CONSOLA F12
          setMyOrders(data); 
      } catch(e) { console.error(e); } 
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'usuarios') loadUsers();
    if (tab === 'pedidos') loadOrders();
    if (tab === 'mis-compras') loadMyOrders();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/#/login';
  };

  return (
    <div className="container py-5 text-white">
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary pb-3">
        <div><h2 className="mb-0">Mi Cuenta</h2><span className={`badge mt-1 ${role==='ADMIN'?'bg-danger':'bg-primary'}`}>{role}</span></div>
        <button onClick={handleLogout} className="btn btn-outline-light btn-sm">Cerrar Sesión</button>
      </div>

      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="list-group shadow-sm">
            <button className={`list-group-item list-group-item-action border-secondary fw-bold ${activeTab==='perfil'?'active bg-primary text-white':'bg-dark text-white'}`} onClick={()=>handleTabChange('perfil')}>👤 Mis Datos</button>
            {role === 'ADMIN' ? (
              <>
                <button className={`list-group-item list-group-item-action border-secondary ${activeTab==='productos'?'active bg-primary text-white':'bg-dark text-white'}`} onClick={()=>handleTabChange('productos')}>📦 Productos</button>
                <button className={`list-group-item list-group-item-action border-secondary ${activeTab==='usuarios'?'active bg-primary text-white':'bg-dark text-white'}`} onClick={()=>handleTabChange('usuarios')}>👥 Usuarios</button>
                <button className={`list-group-item list-group-item-action border-secondary ${activeTab==='pedidos'?'active bg-primary text-white':'bg-dark text-white'}`} onClick={()=>handleTabChange('pedidos')}>🛒 Ventas Globales</button>
              </>
            ) : (
              <button className={`list-group-item list-group-item-action border-secondary ${activeTab==='mis-compras'?'active bg-primary text-white':'bg-dark text-white'}`} onClick={()=>handleTabChange('mis-compras')}>🛍️ Historial de Compras</button>
            )}
          </div>
        </div>

        <div className="col-md-9">
          {/* PERFIL */}
          {activeTab === 'perfil' && (
            <div className="card bg-dark border-secondary p-4 shadow">
              <h4 className="text-white mb-4 border-bottom border-secondary pb-2">Información Personal</h4>
              <div className="row g-4">
                  <div className="col-md-6"><label className="text-white-50 small">Nombre</label><p className="fs-5 text-white fw-bold">{localStorage.getItem('user_name')}</p></div>
                  <div className="col-md-6"><label className="text-white-50 small">Email</label><p className="fs-5 text-white fw-bold">{localStorage.getItem('user_email')}</p></div>
                  <div className="col-md-6"><label className="text-white-50 small">Rol</label><div><span className="badge bg-info text-dark">{role}</span></div></div>
                  <div className="col-md-6">
                      <label className="text-white-50 small">ID Usuario</label>
                      {/* CORRECCIÓN DE COLOR Y TAMAÑO */}
                      <div><span className="badge bg-secondary text-white fs-6">#{localStorage.getItem('user_id')}</span></div>
                  </div>
              </div>
            </div>
          )}

          {activeTab === 'productos' && <AdminPanel />}

          {/* USUARIOS */}
          {activeTab === 'usuarios' && (
            <div className="card bg-dark border-secondary p-3 shadow">
                <h4 className="text-white mb-3">Usuarios</h4>
                <div className="table-responsive">
                    <table className="table table-dark table-striped">
                        <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th></tr></thead>
                        <tbody>{users.map(u => <tr key={u.id}><td>{u.id}</td><td>{u.nombre}</td><td>{u.email}</td><td>{u.rol}</td></tr>)}</tbody>
                    </table>
                </div>
            </div>
          )}

          {/* PEDIDOS ADMIN */}
          {activeTab === 'pedidos' && (
            <div className="card bg-dark border-secondary p-3 shadow">
                <h4 className="text-white mb-3">Historial de Ventas</h4>
                {orders.length === 0 ? <p className="text-white-50">No hay ventas registradas.</p> : (
                    <div className="table-responsive">
                        <table className="table table-dark table-hover align-middle">
                            <thead><tr><th>ID</th><th>Cliente</th><th>Detalle</th><th>Total</th></tr></thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o.id}>
                                        <td>#{o.id}</td>
                                        <td>{o.usuario?.email || '---'}</td>
                                        <td>
                                            <small className="text-white-50 d-block">{new Date(o.fecha).toLocaleDateString()}</small>
                                            {o.detalles?.map((d: any, i) => <div key={i} className="small">• {d.cantidad}x {d.nombreProducto}</div>)}
                                        </td>
                                        <td className="text-warning fw-bold">${o.total.toLocaleString('es-CL')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
          )}

          {/* PEDIDOS CLIENTE */}
          {activeTab === 'mis-compras' && (
            <div className="card bg-dark border-secondary p-3 shadow">
                <h4 className="text-white mb-3">Mis Pedidos</h4>
                {myOrders.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-white-50">No hay compras visibles.</p>
                        <a href="#/categorias" className="btn btn-primary btn-sm">Ir a Comprar</a>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-dark table-hover align-middle">
                            <thead><tr><th>ID</th><th>Fecha</th><th>Productos</th><th>Total</th><th>Estado</th></tr></thead>
                            <tbody>
                                {myOrders.map(o => (
                                    <tr key={o.id}>
                                        <td>#{o.id}</td>
                                        <td>{new Date(o.fecha).toLocaleDateString()}</td>
                                        <td>
                                            {o.detalles?.map((d: any, i) => (
                                                <div key={i}>• {d.cantidad}x <span className="text-info">{d.nombreProducto}</span></div>
                                            ))}
                                        </td>
                                        <td className="text-success fw-bold">${o.total.toLocaleString('es-CL')}</td>
                                        <td><span className="badge bg-success">{o.estado}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}