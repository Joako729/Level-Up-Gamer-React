import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { addToCart } from '../data/data';

export default function ProductDetail(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  
  // Estado para formulario
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [userEmail, setUserEmail] = useState('');

  // 🟢 NUEVO ESTADO: Mensaje de éxito
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadData();
    const email = localStorage.getItem('user_email');
    if (email) setUserEmail(email);
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    try {
      const allProducts = await api.getProducts();
      const found = allProducts.find((p: any) => p.id === Number(id));
      setProduct(found);

      const reviewsData = await api.getReviewsByProduct(Number(id));
      setReviews(reviewsData);
    } catch (e) { console.error(e); }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) {
        alert("Debes iniciar sesión para dejar una reseña");
        navigate('/login');
        return;
    }
    try {
        await api.createReview({
            productoId: Number(id),
            emailUsuario: userEmail,
            comentario: newComment,
            calificacion: newRating
        });
        
        // Limpiar formulario
        setNewComment('');
        setNewRating(5);

        // 🟢 MOSTRAR MENSAJE DE ÉXITO
        setSuccessMsg('¡Tu reseña ha sido publicada correctamente!');
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => setSuccessMsg(''), 3000);

        loadData(); // Recargar reseñas para ver la nueva
    } catch (error) {
        alert('Error al enviar reseña');
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.calificacion, 0) / reviews.length).toFixed(1) 
    : '0.0';

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
        <span key={i} style={{ color: i < rating ? '#FFD700' : '#555' }}>★</span>
    ));
  };

  if (!product) return <div className="text-white text-center mt-5">Cargando producto...</div>;

  return (
    <div className="container py-5 text-white">
      <button onClick={() => navigate(-1)} className="btn btn-outline-secondary mb-4">← Volver</button>
      
      <div className="row mb-5">
        <div className="col-md-6 text-center">
            <img src={product.image} alt={product.name} className="img-fluid rounded shadow" style={{maxHeight: 400, objectFit: 'contain', background: '#3C3C3C'}} />
        </div>
        
        <div className="col-md-6">
            <h2 className="fw-bold">{product.name}</h2>
            <p className="text-info fs-5">{product.category}</p>
            <div className="fs-4 mb-3 text-warning">
                {renderStars(Math.round(Number(averageRating)))} 
                <span className="ms-2 text-white fs-6">({reviews.length} opiniones)</span>
            </div>
            <p className="lead">{product.description}</p>
            <h3 className="fw-bold my-4">${product.price.toLocaleString('es-CL')}</h3>
            
            <button className="btn btn-primary btn-lg w-100 fw-bold" onClick={() => addToCart(product.id)}>
                Añadir al Carrito 🛒
            </button>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12 border-top border-secondary pt-4">
            <h3>Opiniones de Clientes</h3>
            
            {/* 🟢 AQUÍ APARECE EL MENSAJE DE ÉXITO */}
            {successMsg && (
                <div className="alert alert-success fade show mt-3" role="alert">
                    ✅ {successMsg}
                </div>
            )}

            <div className="card bg-dark border-secondary p-4 mb-4 mt-3">
                <h5 className="text-white">Dejar una reseña</h5>
                <form onSubmit={handleAddReview}>
                    <div className="mb-3">
                        <label className="form-label text-white-50">Calificación:</label>
                        <select className="form-select bg-secondary text-white border-0" value={newRating} onChange={e => setNewRating(Number(e.target.value))}>
                            <option value="5">★★★★★ (5) Excelente</option>
                            <option value="4">★★★★☆ (4) Muy bueno</option>
                            <option value="3">★★★☆☆ (3) Normal</option>
                            <option value="2">★★☆☆☆ (2) Malo</option>
                            <option value="1">★☆☆☆☆ (1) Pésimo</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <textarea className="form-control bg-secondary text-white border-0" rows={3} placeholder="Escribe tu opinión..." value={newComment} onChange={e => setNewComment(e.target.value)} required></textarea>
                    </div>
                    <button type="submit" className="btn btn-info text-dark fw-bold">Publicar Reseña</button>
                </form>
            </div>

            {reviews.length === 0 ? (
                <p className="text-white-50">No hay reseñas todavía. ¡Sé el primero!</p>
            ) : (
                <div className="list-group">
                    {reviews.map((r: any) => (
                        <div key={r.id} className="list-group-item bg-dark text-white border-secondary mb-2 rounded">
                            <div className="d-flex justify-content-between">
                                <h6 className="fw-bold mb-1">{r.usuario?.nombre || 'Usuario'}</h6>
                                <small className="text-white-50">{new Date(r.fecha).toLocaleDateString()}</small>
                            </div>
                            <div className="mb-2 text-warning">{renderStars(r.calificacion)}</div>
                            <p className="mb-1">{r.comentario}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}