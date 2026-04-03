import React from 'react'

const Input = ({ label, error, className = "", ...props }) => {
  return (
     <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm text-[#111827]">
          {label}
        </label>
      )}

      <input
        className={`w-full px-4 py-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition-all ${
          error ? "border-red-500" : ""
        } ${className}`}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
