import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard';

describe('ProductCard', () => {
  it('muestra datos y agrega', () => {
    const prod = { id:1, name:'Control Pro', price:39990, category:'Accesorios' };
    const onAdd = jasmine.createSpy('onAdd');
    render(<ProductCard product={prod} onAdd={onAdd} />);
    expect(screen.getByText('Control Pro')).toBeTruthy();
    fireEvent.click(screen.getByText('Agregar'));
    expect(onAdd).toHaveBeenCalledWith(prod);
  });
});
