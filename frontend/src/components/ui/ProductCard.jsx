const ProductCard = ({ product }) => {
  const { id, name, type, price, image, colors } = product;

  // Format price to show currency symbol
  const formattedPrice = typeof price === 'number' 
    ? `$${price.toFixed(2)}` 
    : price;

  console.dir(product, { depth: null});

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="bg-gray-50 flex-grow">
        <div className="flex items-center justify-center p-8 h-[200px] transition-transform hover:scale-110 duration-300">
          <img 
            src={image || "/placeholder.svg?height=120&width=120"} 
            alt={name} 
            className="max-w-full max-h-[120px] object-contain" 
          />
        </div>

        {/* Color swatches - only show for accessories */}
        <div className="flex justify-end gap-1 mt-2 mb-4 px-4">
          {type === 'ACCESSORY' && colors && colors.length > 0 ? (
            colors.map((color, index) => (
              <div 
                key={index} 
                className="w-6 h-6 border border-gray-200" 
                style={{ backgroundColor: color }} 
                title={`Color option ${index + 1}`}
              />
            ))
          ) : (
            <div 
              className="w-6 h-6 border border-gray-200 bg-transparent" 
              title="No color available"
            />
          )}
        </div>


        <div className="px-4 pb-4">
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs uppercase font-medium">
              {name}
              {/* Only show type for non-accessory pages */}
              {type !== 'ACCESSORY' && (
                <span className="text-gray-500 ml-1">({type})</span>
              )}
            </div>
            <div className="text-sm font-medium">{formattedPrice}</div>
          </div>
        </div>
      </div>

      <button className="w-full bg-white border border-gray-300 text-black text-xs py-2 hover:bg-black hover:text-white transition-all duration-300 uppercase rounded-b-lg shadow-sm">
        Add to cart
      </button>
    </div>
  );
};

export default ProductCard;
