const ProductCard = ({ product }) => {
  const { id, name, type, price, image, colors } = product

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="bg-gray-50">
        <div className="flex-grow flex items-center justify-center p-8 transition-transform hover:scale-125">
          <img src={image || "/placeholder.svg"} alt={name} className="max-w-full max-h-[120px] object-contain" />
        </div>

        {/* Color swatches */}
        {colors && colors.length > 0 && (
          <div className="flex justify-end gap-1 mt-2 mb-4 px-4">
            {colors.map((color, index) => (
              <div key={index} className="w-6 h-6" style={{ backgroundColor: color }} />
            ))}
          </div>
        )}

        <div className="px-4 pb-4">
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs uppercase font-medium">
              {name}
              <br />
              <span className="text-gray-500">({type})</span>
            </div>
            <div className="text-sm font-medium">{price}</div>
          </div>
        </div>
      </div>

        <button className="w-full bg-white border border-gray-300 text-black text-xs py-2 hover:bg-black hover:text-white transition-all duration-300 uppercase rounded-xl shadow-sm">
          Add to cart
        </button>
    </div>
  )
}

export default ProductCard

