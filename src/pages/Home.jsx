import React, { useEffect, useState } from 'react'
import { listProducts, addToCart } from '../data/data' 
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    setProducts(listProducts())
  }, [])

  return (
    <div className="container py-4">
      <h1 className="mb-3">Tienda</h1>
      <div className="row g-3">
        {products.map(p => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id}>
            <ProductCard product={p} onAdd={() => addToCart(p.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}

