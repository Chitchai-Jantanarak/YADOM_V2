"use client"

import { useState, useEffect } from "react"
import { getAromas } from "../../services/aromaService"

const AromaSelector = ({ onAromaSelect, selectedAroma }) => {
  const [aromas, setAromas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAromas = async () => {
      try {
        setLoading(true)
        const data = await getAromas()
        setAromas(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching aromas:", err)
        setError("Failed to load aromas")
        setLoading(false)
      }
    }

    fetchAromas()
  }, [])

  if (loading) {
    return (
      <div className="glass-panel p-5 rounded-[24px] backdrop-blur-xl border border-white/40 shadow-lg">
        <h2 className="text-[#0c9df8] text-lg font-medium mb-1">Aromas</h2>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel p-5 rounded-[24px] backdrop-blur-xl border border-white/40 shadow-lg">
        <h2 className="text-[#0c9df8] text-lg font-medium mb-1">Aromas</h2>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="glass-panel p-5 rounded-[24px] backdrop-blur-xl border border-white/40 shadow-lg">
      <h2 className="text-[#0c9df8] text-lg font-medium mb-1">Aromas</h2>
      <p className="text-gray-700 text-sm mb-4">Select a scent for your product</p>

      {aromas.length === 0 ? (
        <p className="text-gray-500 text-sm">No aromas available</p>
      ) : (
        <div className="max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
          {aromas.map((aroma) => (
            <button
              key={aroma.id}
              onClick={() => onAromaSelect(aroma)}
              className={`w-full flex items-center justify-between p-2 rounded-md text-sm mb-2 ${
                selectedAroma?.id === aroma.id ? "bg-blue-50/50 text-[#0c9df8]" : "hover:bg-white/30 text-gray-700"
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{aroma.name}</span>
              </div>
              <span className="text-xs font-medium">{aroma.price.toFixed(2)} B</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default AromaSelector

