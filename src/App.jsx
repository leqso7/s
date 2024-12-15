import { useState } from 'react'
import { motion } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { HomeIcon, UserIcon, DocumentTextIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { RequestForm } from './components/RequestForm'
import { RequestsList } from './components/RequestsList'

function App() {
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
              >
                <Link to="/" className="text-xl font-bold">Student Groups</Link>
              </motion.div>
              
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink to="/" icon={<HomeIcon className="h-5 w-5" />} text="მთავარი" />
                  <NavLink to="/request" icon={<DocumentTextIcon className="h-5 w-5" />} text="მოთხოვნა" />
                  {isAdmin && (
                    <NavLink to="/admin" icon={<ClipboardDocumentListIcon className="h-5 w-5" />} text="მოთხოვნების სია" />
                  )}
                </div>
              </div>
              
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
              >
                {isAdmin ? 'User Mode' : 'Admin Mode'}
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/request" element={<RequestForm />} />
            {isAdmin && <Route path="/admin" element={<RequestsList />} />}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function NavLink({ to, icon, text }) {
  return (
    <Link
      to={to}
      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
    >
      {icon}
      <span className="ml-2">{text}</span>
    </Link>
  )
}

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <h1 className="text-4xl font-bold mb-6">მოგესალმებით Student Groups-ში</h1>
      <p className="text-xl text-gray-300 mb-8">
        ეს არის პლატფორმა, სადაც შეგიძლიათ შეუერთდეთ სასურველ სასწავლო ჯგუფს
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 p-6 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-4">სტუდენტებისთვის</h2>
          <p className="text-gray-300 mb-4">
            გაგზავნეთ მოთხოვნა თქვენთვის სასურველ ჯგუფში გასაწევრიანებლად
          </p>
          <Link
            to="/request"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium"
          >
            მოთხოვნის გაგზავნა
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 p-6 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-4">ადმინისტრატორებისთვის</h2>
          <p className="text-gray-300 mb-4">
            განიხილეთ და დაამტკიცეთ სტუდენტების მოთხოვნები
          </p>
          <Link
            to="/admin"
            className="inline-block bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium"
          >
            მოთხოვნების ნახვა
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default App
