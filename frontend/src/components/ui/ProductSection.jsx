import Arrow from "./Arrow"

export default function ProductSection ({ title, subtitle, image, bgColor = "bg-gray-50" }) {
  return (
    <div className={`w-full ${bgColor} rounded-md overflow-hidden my-6`}>
      <div className="flex flex-col md:flex-row items-center p-6">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            className="max-w-full max-h-[300px] object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start md:items-end p-4">
            <h3 className="flex mx-1 text-xl font-bold uppercase">
            {   title} <Arrow className="inline h-5 w-5" rotation={90} />
            </h3>
          {subtitle && <p className="text-sm text-gray-500 uppercase">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}
