import React from 'react';
import { Package, Edit, Trash2, Plus } from "lucide-react";
import { formatCurrency } from '../../utils';

export default function ProductsTab({
  products, setShowProductModal, setEditingProduct, setShowEditProductModal, handleDeleteProduct,
  currentPage, onPageChange,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Products</h3>
          <p className="text-gray-500 text-sm">{products.length} products in catalogue</p>
        </div>
        <button onClick={() => setShowProductModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{["Product", "Category", "Price", "Stock", "Actions"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.image && <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" onError={e => e.target.style.display = 'none'} />}
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">{product.category}</span></td>
                  <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4"><span className={`text-sm font-medium ${product.stock < 20 ? 'text-red-600' : 'text-gray-900'}`}>{product.stock} units {product.stock < 20 && "⚠️"}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingProduct({ ...product }); setShowEditProductModal(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <div className="text-center py-12 text-gray-400"><Package className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No products yet</p></div>}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
        <span className="text-sm text-gray-500">Page {currentPage}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={products.length < 10}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
      </div>
    </div>
  );
}
