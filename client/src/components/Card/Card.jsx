import React from 'react'

const Card = ({ children, className = "", hover = false }) => {
  return (
     <div
      className={`bg-white rounded-lg shadow-sm border border-[#e5e7eb] ${
        hover ? "hover:shadow-md transition-shadow cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
