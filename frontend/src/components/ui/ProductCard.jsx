import React, { useState, useEffect } from "react";

const ProductCard = ({ product }) => {
  const { id, name, type, price, image, colors } = product;

  // Format price to show currency symbol
  const formattedPrice = typeof price === 'number' 
    ? `$${price.toFixed(2)}` 
    : price;

  const defaultImage = "/unknown_image.png";
  const validImage = image && image.trim() !== "" ? image : defaultImage;

  const [imageSrc, setImageSrc] = useState(validImage);  

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-center h-[200px] my-2 transition-transform hover:scale-105 duration-300">
        <img 
          src={imageSrc} 
          alt={name} 
          className="max-w-full max-h-[200px] w-full object-contain" 
          onError={() => setImageSrc(defaultImage)}
        />
      </div>

      <div className="bg-gray-50 flex-grow">
        

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
