import React, { useState } from 'react';
import AboutMail from "../components/ui/AboutMail";
import TextCarousel from "../components/ui/TextCarousel"
import NavBar2 from "../components/layout/NavBar2"
import Footer from "../components/layout/Footer"

const CategoryModal = ({ category, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-[500px] relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold"
        >
          ×
        </button>
        
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-6">{category.title}</h2>
          
          <div className="mb-6 flex justify-center space-x-4">
            {category.images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`${category.title} image ${index + 1}`} 
                className="max-h-40 object-cover rounded-lg"
              />
            ))}
          </div>
          
          <p className="text-gray-600 mb-8 leading-relaxed text-base">
            {category.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const AboutSecent = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const aromaCategories = [
    {
      title: 'HERB',
      component: AboutMail,
      description: 'The classic herbal inhaler scent helps relieve dizziness, nasal congestion, and fatigue, leaving you feeling refreshed, relaxed, and focused. Additionally, it helps reduce motion sickness and purifies the air. Perfect for daily use, it promotes freshness and overall well-being.',
      images: ['/type_of_inhaler/Herb1.jpg', '/type_of_inhaler/Herb2.jpg']
    },
    {
      title: 'MINT',
      component: AboutMail,
      description: 'Mint has a cooling effect that helps relieve dizziness, lightheadedness and motion sickness, including nausea and vomiting. It refreshes the body, promotes alertness, and enhances wakefulness. Inhaling menthol while sleeping can stimulate heart function, reduce stress, and improve memory.',
      images: ['/type_of_inhaler/Mint1.jpg', '/type_of_inhaler/Mint2.jpg']
    },
    {
      title: 'EARL GREY',
      component: AboutMail,
      description: 'The distinctive aroma of Earl Grey tea is derived from bergamot oil, which offers several beneficial effects. It helps alleviate stress and anxiety, reduces headaches and migraines, and promotes clearer breathing. Additionally, the scent of Earl Grey tea can enhance mental clarity, improve focus, and diminish feelings of mental fog.',
      images: ['/type_of_inhaler/earl_grey1.jpg', '/type_of_inhaler/earl_grey2.jpg']
    },
    {
      title: 'CAMPHOR',
      component: AboutMail,
      description: 'Camphor has a cool, refreshing scent that promotes relaxation and stimulates the mind. It helps relieve dizziness, alleviate cold symptoms, and clear nasal congestion.',
      images: ['/type_of_inhaler/camphor1.jpg', '/type_of_inhaler/camphor2.jpg']
    },
    {
      title: 'LAVENDER',
      component: AboutMail,
      description: 'When it comes to aromatherapy, no scent holds the crown quite like lavender. Known as the ultimate stress-relieving fragrance, lavender extract helps refresh the mind and promote deep relaxation. It effectively eases stress, soothes headaches and migraines, and reduces mental fatigue. Additionally, it helps restore emotional balance, enhancing focus and concentration.',
      images: ['/type_of_inhaler/lavender1.jpg', '/type_of_inhaler/lavender2.jpg']
    },
    {
      title: 'FRUITY',
      component: AboutMail,
      description: 'Fruity scents in inhalers often contain notes of fruits like orange, lemon, berries, apple, or passion fruit. They help refresh and energize, reduce stress, and uplift the mood. Additionally, fruity aromas can stimulate the mind, enhance focus, clear nasal congestion, and promote easier breathing. They also help alleviate dizziness, nausea, and fatigue-related discomfort.',
      images: ['/type_of_inhaler/fruity1.jpg', '/type_of_inhaler/fruity2.jpg']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar2 />
       
      <div className="flex-grow container mx-auto px-4 py-8 relative">
        <h1 className="text-4xl font-bold text-center mb-12">
          AROMAS
        </h1>
         
        <div className="grid grid-cols-3 gap-6 relative">
          {aromaCategories.map((category, index) => (
            <div
              key={index}
              onClick={() => setSelectedCategory(category)}
              className="bg-white border border-purple-200 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
              <div className="flex justify-center mt-4">
                <category.component />
              </div>
            </div>
          ))}
        </div>
         
        {/* Centered Modal for Category Details */}
        {selectedCategory && (
          <CategoryModal 
            category={selectedCategory} 
            onClose={() => setSelectedCategory(null)} 
          />
        )}
         
        <div className="my-12">
          <TextCarousel
            text={["REFRESHING AROMAS", "GET BOOSTED", "DON'T FEEL BAD, FEEL THE STYLE"]}
            colorIndex={[2, 1, 3]}
            baseVelocity={5}
            className="font-anybody"
          />
        </div>
         
        <div className="my-4">
          <TextCarousel
            text={["REFRESHING AROMAS", "GET BOOSTED", "DON'T FEEL BAD, FEEL THE STYLE"]}
            colorIndex={[2, 1, 3]}
            baseVelocity={-5}
            className="font-anybody"
          />
        </div>
      </div>
       
      <Footer />
    </div>
  );
};

export default AboutSecent;