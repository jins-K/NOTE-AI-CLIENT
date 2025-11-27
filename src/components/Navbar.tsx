import React from 'react'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-bold">AI Note</Link>
        <div className="flex gap-3">
          <Link to="/dashboard" className="text-sm">Dashboard</Link>
          <Link to="/login" className="text-sm">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar
