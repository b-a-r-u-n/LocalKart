import { ArrowLeft, Home, Search, ShoppingBag } from 'lucide-react';
import React from 'react'
import { Button } from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="relative">
          <h1 className="text-8xl md:text-[180px] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-blue-400 to-purple-400 -z-10"></div>
        </div>

        <h2 className="text-4xl mb-4 text-gray-900">Oops! Page Not Found</h2>

        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to a new location.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="w-full sm:w-auto"
          >
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Button>

          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage
