"use client"

import { useState, useEffect } from "react"
import AboutMail from "../components/ui/AboutMail"
import Lenis from "lenis"
import NavBar2 from "../components/layout/NavBar2"
import Footer from "../components/layout/Footer"
import PageTransition from "../components/layout/PageTransition"
import { X } from "lucide-react"

// IMAGE ASSETS
import HERB1 from "../assets/images/AboutSecent/Herb1.jpg"
import HERB2 from "../assets/images/AboutSecent/Herb2.jpg"
import MINT1 from "../assets/images/AboutSecent/Mint1.jpg"
import MINT2 from "../assets/images/AboutSecent/Mint2.jpg"
import EARLGREY1 from "../assets/images/AboutSecent/earl_grey1.jpg"
import EARLGREY2 from "../assets/images/AboutSecent/earl_grey2.jpg"
import CAMPHOR1 from "../assets/images/AboutSecent/camphor1.jpg"
import CAMPHOR2 from "../assets/images/AboutSecent/camphor2.jpg"
import LAVENDER1 from "../assets/images/AboutSecent/lavender1.jpg"
import LAVENDER2 from "../assets/images/AboutSecent/lavender2.jpg"
import FRUITY1 from "../assets/images/AboutSecent/fruity1.jpg"
import FRUITY2 from "../assets/images/AboutSecent/fruity2.jpg"

const CategoryModal = ({ category, onClose }) => {
  // Check if category exists before rendering modal content
  if (!category) return null

  return (
    <dialog id="category_modal" className="modal">
      <div className="modal-box w-11/12 max-w-2xl">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" onClick={onClose}>
            <X />
          </button>

        <h2 className="text-2xl font-bold mb-6 text-center">{category.title}</h2>

        <div className="mb-6 flex justify-center space-x-4">
          {category.images.map((image, index) => (
            <img
              key={index}
              src={image || "/placeholder.svg"}
              alt={`${category.title} image ${index + 1}`}
              className="max-h-40 object-cover rounded-lg"
            />
          ))}
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed text-base text-center">{category.description}</p>
      </div>
    </dialog>
  )
}

const AboutSecent = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [modalReady, setModalReady] = useState(false)

  // Ensure modal is ready after component mounts
  useEffect(() => {
    setModalReady(true)
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  const openModal = (category) => {
    // Check if category is not null/undefined
    if (!category) {
      console.error("Cannot open modal: category is undefined or null")
      return
    }

    setSelectedCategory(category)

    // Use setTimeout to ensure state is updated before accessing the DOM
    setTimeout(() => {
      const modalElement = document.getElementById("category_modal")
      if (modalElement) {
        modalElement.showModal()
      } else {
        console.error("Modal element not found in the DOM")
      }
    }, 0)
  }

  const closeModal = () => {
    const modalElement = document.getElementById("category_modal")
    if (modalElement) {
      modalElement.close()
    }
    setSelectedCategory(null)
  }

  const aromaCategories = [
    {
      title: "HERB",
      component: AboutMail,
      description:
        "The classic herbal inhaler scent helps relieve dizziness, nasal congestion, and fatigue, leaving you feeling refreshed, relaxed, and focused. Additionally, it helps reduce motion sickness and purifies the air. Perfect for daily use, it promotes freshness and overall well-being.",
      images: [HERB1, HERB2],
    },
    {
      title: "MINT",
      component: AboutMail,
      description:
        "Mint has a cooling effect that helps relieve dizziness, lightheadedness and motion sickness, including nausea and vomiting. It refreshes the body, promotes alertness, and enhances wakefulness. Inhaling menthol while sleeping can stimulate heart function, reduce stress, and improve memory.",
      images: [MINT1, MINT2],
    },
    {
      title: "EARL GREY",
      component: AboutMail,
      description:
        "The distinctive aroma of Earl Grey tea is derived from bergamot oil, which offers several beneficial effects. It helps alleviate stress and anxiety, reduces headaches and migraines, and promotes clearer breathing. Additionally, the scent of Earl Grey tea can enhance mental clarity, improve focus, and diminish feelings of mental fog.",
      images: [EARLGREY1, EARLGREY2],
    },
    {
      title: "CAMPHOR",
      component: AboutMail,
      description:
        "Camphor has a cool, refreshing scent that promotes relaxation and stimulates the mind. It helps relieve dizziness, alleviate cold symptoms, and clear nasal congestion.",
      images: [CAMPHOR1, CAMPHOR2],
    },
    {
      title: "LAVENDER",
      component: AboutMail,
      description:
        "When it comes to aromatherapy, no scent holds the crown quite like lavender. Known as the ultimate stress-relieving fragrance, lavender extract helps refresh the mind and promote deep relaxation. It effectively eases stress, soothes headaches and migraines, and reduces mental fatigue. Additionally, it helps restore emotional balance, enhancing focus and concentration.",
      images: [LAVENDER1, LAVENDER2],
    },
    {
      title: "FRUITY",
      component: AboutMail,
      description:
        "Fruity scents in inhalers often contain notes of fruits like orange, lemon, berries, apple, or passion fruit. They help refresh and energize, reduce stress, and uplift the mood. Additionally, fruity aromas can stimulate the mind, enhance focus, clear nasal congestion, and promote easier breathing. They also help alleviate dizziness, nausea, and fatigue-related discomfort.",
      images: [FRUITY1, FRUITY2],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar2 />

      <div className="flex-grow container mx-auto px-4 py-16 relative">
        <h1 className="text-4xl font-bold text-center mb-16">AROMAS</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {aromaCategories.map((category, index) => (
            <div
              key={index}
              onClick={() => openModal(category)}
              className="bg-white border border-purple-200 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
              <div className="flex justify-center mt-4">
                <category.component />
              </div>
            </div>
          ))}
        </div>

        {/* Only render the modal if modalReady is true */}
        {modalReady && <CategoryModal category={selectedCategory} onClose={closeModal} />}

      </div>
      <Footer carousel={"true"} />
    </div>
  )
}

export default PageTransition(AboutSecent);

