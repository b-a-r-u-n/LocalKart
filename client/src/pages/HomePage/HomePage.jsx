import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import { ArrowRight } from 'lucide-react'

const HomePage = () => {

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl mb-6">
              Welcome to LocalKart
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover amazing products at unbeatable prices. Shop from thousands of products across all categories.
            </p>
            <div className="flex gap-4">
              <Link to="/products">
                <Button variant="accent" size="lg">
                  Shop Now <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl mb-4">Special Offer!</h2>
          <p className="text-xl mb-6">Get up to 50% off on selected items. Limited time only!</p>
          <Link to="/products">
            <Button variant="secondary" size="lg">
              Shop Deals
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
