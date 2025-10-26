// src/pages/AdminPanel.jsx
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();

  // Lee vista y modo desde la URL (seguimos en /admin)
  const params = new URLSearchParams(location.search);
  const view = (params.get('view') || 'home').toLowerCase();
  const mode = (params.get('mode') || 'open').toLowerCase();

  const setView = (v, m = 'open') => {
    const next = new URLSearchParams(location.search);
    next.set('view', v);
    next.set('mode', m);
    navigate({ search: `?${next.toString()}` }, { replace: false });
  };

  // Métricas demo
  const stats = useMemo(
    () => ({ compras: 1234, productos: 400, usuarios: 892, pendientes: 17 }),
    []
  );

  const softWhite = 'rgba(255,255,255,.75)'; // blanco suave para textos secundarios

  const kpiBox = (title, value, color) => (
    <div className="col-12 col-md-4 mb-3">
      <div
        className="card shadow-sm h-100"
        style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,.08)', background: '#0f0f0f' }}
      >
        <div
          className="p-3"
          style={{
            background: color,
            color: '#000',
            fontWeight: 700,
            letterSpacing: .2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{title}</span>
          <span style={{ opacity: .8, fontSize: 12 }}>Dashboard</span>
        </div>
        <div className="p-4 d-flex align-items-end justify-content-between">
          <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1, color: '#fff' }}>{value}</div>
          <div style={{ color: softWhite }} className="small">Última act.</div>
        </div>
      </div>
    </div>
  );

  const tile = (title, subtitle, icon, color='var(--card)') => (
    <div className="col-12 col-sm-6 col-lg-3 mb-3">
      <div
        className="card h-100 shadow-sm"
        style={{
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,.08)',
          background: '#141414',
          color: '#fff'
        }}
      >
        <div className="card-body d-flex flex-column">
          <div className="d-flex align-items-center mb-2">
            <div
              className="d-inline-flex align-items-center justify-content-center me-2"
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: color, color: '#000', fontWeight: 800
              }}
            >
              {icon}
            </div>
            <h6 className="mb-0" style={{ fontWeight: 800, color: '#fff' }}>{title}</h6>
          </div>
          <div style={{ color: softWhite }} className="small flex-grow-1">{subtitle}</div>
          <div className="mt-3 d-flex">
            <button className="btn btn-primary btn-sm me-2" onClick={() => setView(title.toLowerCase())}>
              Abrir
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setView(title.toLowerCase(), 'settings')}>
              Configurar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SectionContent = () => {
    const header = (title) => (
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h5 className="mb-0" style={{ color: '#fff' }}>{title}</h5>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => setView(title.toLowerCase())}>
            Abrir
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setView(title.toLowerCase(), 'settings')}>
            Configurar
          </button>
        </div>
      </div>
    );

    const InConstruction = ({title, desc}) => (
      <div style={{ color: softWhite }}>
        <div className="mb-1">{desc}</div>
        <div className="small">Vista: <code>{title}</code> • Modo: <code>{mode}</code></div>
        <div className="small mt-2">* Esta es una vista de ejemplo. Puedes conectar datos reales cuando quieras.</div>
      </div>
    );

    switch (view) {
      case 'dashboard':
        return (
          <>
            {header('Dashboard')}
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="border rounded p-3 h-100" style={{ background: '#0f0f0f', color: '#fff', borderColor: 'rgba(255,255,255,.12)' }}>
                  <div className="fw-semibold mb-2">Resumen de ventas (demo)</div>
                  <ul className="mb-0 small" style={{ color: softWhite }}>
                    <li>Hoy: 57 órdenes</li>
                    <li>Semana: 312 órdenes</li>
                    <li>Mes: 1.234 órdenes</li>
                  </ul>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="border rounded p-3 h-100" style={{ background: '#0f0f0f', color: '#fff', borderColor: 'rgba(255,255,255,.12)' }}>
                  <div className="fw-semibold mb-2">Top productos (demo)</div>
                  <ol className="mb-0 small" style={{ color: softWhite }}>
                    <li>Mouse Gamer Logitech G502</li>
                    <li>Auriculares Razer Kraken</li>
                    <li>PlayStation 5</li>
                  </ol>
                </div>
              </div>
            </div>
          </>
        );
      case 'órdenes':
      case 'ordenes':
        return (
          <>
            {header('Órdenes')}
            <InConstruction title="ordenes" desc="Gestión de pedidos, estados y detalle de órdenes." />
          </>
        );
      case 'productos':
        return (
          <>
            {header('Productos')}
            <InConstruction title="productos" desc="Alta/baja/edición y stock del catálogo." />
          </>
        );
      case 'usuarios':
        return (
          <>
            {header('Usuarios')}
            <InConstruction title="usuarios" desc="Administración de cuentas, roles y permisos." />
          </>
        );
      case 'cupones':
        return (
          <>
            {header('Cupones')}
            <InConstruction title="cupones" desc="Creación y aplicación de descuentos y promociones." />
          </>
        );
      case 'reportes':
        return (
          <>
            {header('Reportes')}
            <InConstruction title="reportes" desc="Ventas, métricas y exportables en distintos formatos." />
          </>
        );
      case 'categorías':
      case 'categorias':
        return (
          <>
            {header('Categorías')}
            <InConstruction title="categorias" desc="Organización del catálogo por secciones." />
          </>
        );
      case 'ajustes':
        return (
          <>
            {header('Ajustes')}
            <InConstruction title="ajustes" desc="Preferencias generales del sistema." />
          </>
        );
      default:
        return (
          <>
            <div className="fw-semibold mb-2" style={{ color: '#fff' }}>Actividad reciente</div>
            <div className="d-flex align-items-center justify-content-between border-bottom py-2" style={{ borderColor: 'rgba(255,255,255,.12)' }}>
              <div>
                <div className="fw-semibold" style={{ color: '#fff' }}>Nueva orden #A-10231</div>
                <div className="small" style={{ color: softWhite }}>Usuario: carlos@correo.com • Total: $59.990</div>
              </div>
              <span className="badge bg-success">Completada</span>
            </div>
            <div className="d-flex align-items-center justify-content-between border-bottom py-2" style={{ borderColor: 'rgba(255,255,255,.12)' }}>
              <div>
                <div className="fw-semibold" style={{ color: '#fff' }}>Producto actualizado</div>
                <div className="small" style={{ color: softWhite }}>“Mouse Gamer Logitech G502” • Stock +20</div>
              </div>
              <span className="badge bg-secondary">Inventario</span>
            </div>
            <div className="d-flex align-items-center justify-content-between py-2">
              <div>
                <div className="fw-semibold" style={{ color: '#fff' }}>Nuevo usuario</div>
                <div className="small" style={{ color: softWhite }}>maria@correo.com • Rol: Cliente</div>
              </div>
              <span className="badge bg-info">Usuarios</span>
            </div>
          </>
        );
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Encabezado */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-0" style={{ color: '#fff' }}>Panel de administración</h2>
          <div style={{ color: 'rgba(255,255,255,.8)' }}>Resumen general y accesos rápidos</div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => alert('Exportar (demo)')}>Exportar</button>
          <button className="btn btn-primary" onClick={() => alert('Crear nuevo (demo)')}>Nuevo</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="row">
        {kpiBox('Compras', stats.compras, '#30A4FF')}
        {kpiBox('Productos', stats.productos, '#47D16E')}
        {kpiBox('Usuarios', stats.usuarios, '#FFC44D')}
      </div>

      {/* Acciones rápidas */}
      <div className="row mt-1">
        {tile('Dashboard', 'Indicadores clave, actividad y atajos.', '📊', '#30A4FF')}
        {tile('Órdenes', 'Gestión de pedidos y estados.', '🧾')}
        {tile('Productos', 'Alta/baja/edición y stock.', '📦', '#47D16E')}
        {tile('Usuarios', 'Registro, permisos y actividad.', '👥', '#FFC44D')}
        {tile('Cupones', 'Descuentos y promociones.', '🎟️')}
        {tile('Reportes', 'Ventas, KPI y exportables.', '📈')}
        {tile('Categorías', 'Organiza el catálogo por secciones.', '🗂️')}
        {tile('Ajustes', 'Preferencias del sistema.', '⚙️')}
      </div>

      {/* Sidebar + contenido dinámico */}
      <div className="row mt-3">
        <div className="col-12 col-lg-3 mb-3">
          <div className="card" style={{ borderRadius: 14, background: '#141414', color: '#fff' }}>
            <div className="card-header" style={{ background: '#181818', color: '#fff' }}>
              Secciones
            </div>
            <ul className="list-group list-group-flush">
              <li
                className="list-group-item d-flex justify-content-between align-items-center"
                role="button"
                onClick={() => setView('ordenes')}
                style={{ background: '#141414', color: '#fff', borderColor: 'rgba(255,255,255,.12)' }}
              >
                Pedidos pendientes
                <span className="badge bg-danger">{stats.pendientes}</span>
              </li>
              {['Devoluciones','Mensajes','Integraciones'].map((t) => (
                <li
                  key={t}
                  className="list-group-item"
                  role="button"
                  onClick={() => setView(t.toLowerCase())}
                  style={{ background: '#141414', color: '#fff', borderColor: 'rgba(255,255,255,.12)' }}
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-12 col-lg-9">
          <div className="card" style={{ borderRadius: 14, background: '#141414', color: '#fff' }}>
            <div className="card-header" style={{ background: '#181818', color: '#fff' }}>
              {view === 'home'
                ? 'Actividad reciente'
                : `${view[0].toUpperCase()}${view.slice(1)}${mode === 'settings' ? ' • Configuración' : ''}`}
            </div>
            <div className="card-body">
              <SectionContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

