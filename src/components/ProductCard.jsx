import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="group">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-beige-100 mb-4">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Quick add overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
            <button 
              onClick={handleAddToCart}
              className="bg-dark text-white px-6 py-2.5 text-sm font-medium tracking-wide hover:bg-dark/90 transition-all transform translate-y-4 group-hover:translate-y-0"
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </Link>
      
      <div className="text-center">
        <span className="text-xs text-gray-500 uppercase tracking-widest">
          {product.category}
        </span>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif text-lg text-dark mt-1 hover:text-gray-600 transition">
            {product.name}
          </h3>
        </Link>
        <p className="text-dark font-medium mt-2">
          {product.price.toLocaleString('vi-VN')}đ
        </p>
      </div>
    </div>
  );
};

export default ProductCard;