"use client"
import { Minus, Plus } from "lucide-react"

const ProductQuantity = ({ product, quantity, setQuantity, totalPrice, updateTotalPrice, selectedAroma }) => {
  // Handle quantity change
  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(10, value))
    setQuantity(newQuantity)
    updateTotalPrice(newQuantity, selectedAroma)
  }

  return (
    <div className="glass-panel p-5 rounded-[24px] backdrop-blur-xl border border-white/40 shadow-lg mb-4">
      <h1 className="text-lg font-bold uppercase mb-1">{product.name}</h1>
      <p className="text-lg font-bold mb-4">{totalPrice.toFixed(2)} B</p>

      {/* Description */}
      <div className="mb-4">
        <h2 className="text-xs font-medium mb-1">Description</h2>
        <p className="text-gray-700 text-xs">
          {product.description ||
            "Our flagship product with customizable features, sleek design with maximum efficiency"}
        </p>
      </div>

      {/* Quantity selector */}
      <div>
        <p className="text-xs font-medium mb-2">Quantity</p>
        <div className="flex items-center">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-8 h-8 flex items-center justify-center border border-white/50 bg-white/20 rounded-l-full disabled:opacity-50"
          >
            <Minus size={14} />
          </button>
          <div className="w-10 h-8 flex items-center justify-center border-t border-b border-white/50 bg-white/20">
            {quantity}
          </div>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= 10}
            className="w-8 h-8 flex items-center justify-center border border-white/50 bg-white/20 rounded-r-full disabled:opacity-50"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductQuantity

