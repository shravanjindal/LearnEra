import React from 'react'
import PricingCard from './cards/PricingCard'

const Pricing = () => {
  return (
    <section  className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white py-20 px-6">
    <div className="container mx-auto text-center">
    <h3 className="text-5xl font-bold mb-3">Get Started today!</h3>
<p className="text-xl text-blue-200 mb-12">Flexible plans tailored to meet your needs.</p>

        <div className="mt-8 flex flex-wrap justify-center gap-10">
            <PricingCard plan='FREE' price='$0' target='Free-tier features' perks={["Generate general roadmaps", "Explore your interests","Test your skills", "Learn one skill","Email Support"]}/>
            <PricingCard plan='BASIC' price='$0.78' target='Perfect for upskilling' perks={["Generate personalised roadmaps", "Learn infinite skills", "Test your skills", "Track your growth", "Recieve personalized tasks", "Explore your interests","Email Support"]}/>
            <PricingCard plan='PREMIUM' price='$1.17' target='Get industry ready' perks={["Generate personalised roadmaps", "Learn infinite skills", "Test your skills", "Track your growth", "Recieve personalized tasks", "Explore your interests","One-to-one mock interviews","Community access","Connect to industry experts","Email Support"]} />
        </div>
    </div>
</section>
  )
}

export default Pricing