import React, { useState } from 'react';

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "What payment methods do you accept?",
      answer: "We currently accept payments only through QR Code."
    },
    {
      id: 2,
      question: "Does the system check the shopping cart after customization?",
      answer: "Yes, our system automatically verifies all items in your cart after customization to ensure compatibility."
    },
    {
      id: 3,
      question: "Is the shipping fee free?",
      answer: "Shipping is free for orders over $50. Standard shipping fees apply for smaller orders."
    },
    {
      id: 4,
      question: "How do I know which inhaler scent suits me?",
      answer: "We recommend trying our sample pack which includes all scents in small quantities."
    },
    {
      id: 5,
      question: "Is there a charge for trying customization?",
      answer: "Not at all! You can try customizing on our website for free."
    }
  ];

  const toggleQuestion = (id) => {
    if (openQuestion === id) {
      setOpenQuestion(null);
    } else {
      setOpenQuestion(id);
    }
  };

  return (
    <div className="w-full px-4 max-w-6xl mx-auto pt-12">
      <h1 className="text-5xl font-bold mb-16 text-center pt-8">Frequently Ask Questions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* FAQ Section - adjusted to take 7 columns on desktop */}
        <div className="md:col-span-7 space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="border rounded shadow-sm">
              <button
                className={`flex items-center justify-between w-full p-4 text-left ${
                  openQuestion === faq.id ? "border-b" : ""
                }`}
                onClick={() => toggleQuestion(faq.id)}
              >
                <span className="text-base">{faq.question}</span>
                <span className="text-xl">
                  {openQuestion === faq.id ? "−" : "+"}
                </span>
              </button>
              
              {openQuestion === faq.id && (
                <div className="p-4 bg-blue-50">
                  <p className="text-base">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Decorative Section - adjusted to take 5 columns on desktop */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="mb-6">
            <img src="/Main/questionMask.png" alt="Question mark" className="w-40 h-40" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Any Question?</h2>
          <p className="text-base text-gray-600 text-center">You can ask anything you want to know Feedback</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;