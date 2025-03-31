// FROM HERE NO FUNCTION AVIALABLE FOR THIS ONE TAKE

// import { useState, useRef } from "react"
// import { Package, Upload, Check, AlertTriangle, Info } from "lucide-react"
// import { validateProductFile, uploadProductFile } from "../../utils/fileUtils"

// export default function ModelUploader({ productId, onUploadComplete }) {
//   const [uploading, setUploading] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [error, setError] = useState(null)
//   const [success, setSuccess] = useState(false)
//   const fileInputRef = useRef(null)

//   const handleClick = () => {
//     fileInputRef.current.click()
//   }

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0]
//     if (!file) return

//     // Validate the file
//     const validation = validateProductFile(file, "MAIN_PRODUCT")
//     if (!validation.success) {
//       setError(validation.message)
//       return
//     }

//     try {
//       setUploading(true)
//       setProgress(0)
//       setError(null)
//       setSuccess(false)

//       // Simulate upload and get the path
//       const result = await uploadProductFile(file, "MAIN_PRODUCT", productId, (progress) => {
//         setProgress(progress)
//       })

//       if (result.success) {
//         setSuccess(true)
//         if (onUploadComplete) {
//           onUploadComplete(result.path)
//         }
//       } else {
//         setError(result.message)
//         setProgress(0)
//       }
//     } catch (err) {
//       console.error("Error processing model:", err)
//       setError("An error occurred while processing the model")
//       setProgress(0)
//     } finally {
//       setUploading(false)
//     }
//   }

//   return (
//     <div className="mt-4">
//       <div className="mb-2 flex items-center text-amber-600 text-sm bg-amber-50 p-2 rounded">
//         <Info className="h-4 w-4 mr-1" />
//         <span>Note: This is a simulation. Files are not actually uploaded.</span>
//       </div>

//       <div
//         onClick={handleClick}
//         className={`border-2 border-dashed ${
//           error ? "border-red-300" : "border-gray-300"
//         } rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors`}
//       >
//         <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".glb" className="hidden" />

//         {!uploading && !success ? (
//           <>
//             <Package className="h-10 w-10 text-gray-400 mb-2" />
//             <p className="text-sm font-medium text-gray-700">Click to select 3D model (.glb)</p>
//             <p className="text-xs text-gray-500 mt-1">This will update the product reference</p>
//           </>
//         ) : uploading ? (
//           <>
//             <Upload className="h-10 w-10 text-blue-500 mb-2 animate-pulse" />
//             <p className="text-sm font-medium text-gray-700">Processing model...</p>
//             <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
//               <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
//             </div>
//           </>
//         ) : success ? (
//           <>
//             <Check className="h-10 w-10 text-green-500 mb-2" />
//             <p className="text-sm font-medium text-gray-700">Model reference updated</p>
//           </>
//         ) : null}
//       </div>

//       {error && (
//         <div className="mt-2 flex items-center text-red-500 text-sm">
//           <AlertTriangle className="h-4 w-4 mr-1" />
//           {error}
//         </div>
//       )}
//     </div>
//   )
// }

