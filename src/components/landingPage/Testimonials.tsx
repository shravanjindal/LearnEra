import React from 'react'
import CommentCard from './cards/CommentCard'

const Testimonials = () => {
  return (
    <section id="testimonials" className="pt-52 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white py-20 px-6">
    <div className="container mx-auto text-center">
        <h3 className="text-5xl font-bold mb-12">What People Say About Us</h3>
        <div className="mt-8 flex flex-wrap justify-center gap-8">
        <CommentCard 
          name='Riya Sharma' 
          occupation='Student' 
          company='IIT Delhi' 
          comment='Learnera helped me stay consistent with my studies. The doubt discussions with tutor are gold!' 
        />

        <CommentCard 
          name='Aarav Singh' 
          occupation='Backend Developer' 
          company='Flipkart' 
          comment="Loved the hands-on approach. It's not just theory—you actually build stuff." 
        />

        <CommentCard 
          name='Sneha Patel' 
          occupation='Software Engineer' 
          company='Google' 
          comment='Amazing mentorship! The feedback I got helped me improve way faster than expected.' 
        />

        <CommentCard 
          name='Kabir Nair' 
          occupation='Data Science Intern' 
          company='Wipro' 
          comment='I joined for the content, but stayed for the community. Super helpful crowd!' 
        />

        <CommentCard 
          name='Pooja Iyer' 
          occupation='UI/UX Designer' 
          company='Tata Elxsi' 
          comment='Every session is super insightful. Helped me build a killer portfolio.' 
        />

        <CommentCard 
          name='Vikram Deshmukh' 
          occupation='Student' 
          company='IIT Bombay' 
          comment='Honestly, Learnera feels like a shortcut to smarter learning. Highly recommend!' 
        />


        </div>
    </div>
</section>

      
  )
}

export default Testimonials