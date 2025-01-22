import React from 'react'
import CommentCard from './CommentCard'

const Testimonials = () => {
  return (
    <section id="testimonials" className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white py-20 px-6">
    <div className="container mx-auto text-center">
        <h3 className="text-5xl font-bold mb-12">What People Say About Us</h3>
        <div className="mt-8 flex flex-wrap justify-center gap-8">
            <CommentCard name='Alex Johnson' occupation='student' company='IIT Delhi' comment='This platform transformed my learning experience! Highly recommend it.'/>
            <CommentCard name='Alex Johnson' occupation='student' company='IIT Delhi' comment='This platform transformed my learning experience! Highly recommend it.'/>
            <CommentCard name='Alex Johnson' occupation='student' company='IIT Delhi' comment='This platform transformed my learning experience! Highly recommend it.'/>
            <CommentCard name='Alex Johnson' occupation='student' company='IIT Delhi' comment='This platform transformed my learning experience! Highly recommend it.'/>
            <CommentCard name='Alex Johnson' occupation='student' company='IIT Delhi' comment='This platform transformed my learning experience! Highly recommend it.'/>
            <CommentCard name='Alex Johnson' occupation='student' company='IIT Delhi' comment='This platform transformed my learning experience! Highly recommend it.'/>

        </div>
    </div>
</section>

      
  )
}

export default Testimonials