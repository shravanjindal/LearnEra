import React from 'react'
import type { NextPage } from 'next'
const FAQs: NextPage =() =>{
  return (
    <section id="faqs" className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white py-20 px-6">

    <div className="container mx-auto text-center">
        <h3 className="text-4xl font-bold mb-12" >FAQs</h3>
        <div className="mt-8 max-w-3xl mx-auto text-left">
            <details className="mb-6 bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105">
                <summary className="font-bold text-blue-600 cursor-pointer text-xl">What is LearnEra?</summary>
                <p className="mt-4 text-gray-700">LearnEra is a platform designed to revolutionize the way people learn, offering a wide range of courses and tools to enhance your learning experience.</p>
            </details>
            <details className="mb-6 bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105">
                <summary className="font-bold text-blue-600 cursor-pointer text-xl">How do I get started?</summary>
                <p className="mt-4 text-gray-700">Just click Get started!. and the tutor will take care from there.</p>
            </details>
            {/* <details className="mb-6 bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105">
                <summary className="font-bold text-blue-600 cursor-pointer text-xl">Can I switch plans later?</summary>
                <p className="mt-4 text-gray-700">Yes, you can upgrade or downgrade your plan at any time through your account settings.</p>
            </details> */}
            <details className="mb-6 bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 hover:scale-105">
                <summary className="font-bold text-blue-600 cursor-pointer text-xl">Is there a free trial available?</summary>
                <p className="mt-4 text-gray-700">We are currently offering free services only. Learn as much as you want.</p>
            </details>
        </div>
    </div>
    </section>

  )
}

export default FAQs