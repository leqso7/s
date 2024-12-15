import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { HomeIcon, UserGroupIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { supabase } from './lib/supabase'

// Components
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
                  <NavLink to="/request" icon={<UserGroupIcon className="h-5 w-5" />} text="მოთხოვნა" />
                  {isAdmin && (
                    <NavLink to="/index" icon={<ClipboardDocumentListIcon className="h-5 w-5" />} text="მართვა" />
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
            <Route path="/request" element={<Request />} />
            {isAdmin && <Route path="/index" element={<Index />} />}
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
            მართეთ სტუდენტების ჯგუფები და განიხილეთ მოთხოვნები
          </p>
          <Link
            to="/index"
            className="inline-block bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium"
          >
            ჯგუფების მართვა
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

function Request() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  useEffect(() => {
    const checkExistingCode = async () => {
      const storedCode = localStorage.getItem("accessCode")
      if (storedCode) {
        const { data } = await supabase
          .from("access_requests")
          .select("status")
          .eq("code", storedCode)
          .single()

        if (data?.status === "approved") {
          navigate("/index")
        }
      }
    }

    checkExistingCode()
  }, [navigate])

  const generateCode = () => {
    return Math.random().toString().substring(2, 7)
  }

  const handleRequest = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert("გთხოვთ შეავსოთ ყველა ველი")
      return
    }

    try {
      setIsLoading(true)
      const code = generateCode()
      
      const { error } = await supabase
        .from("access_requests")
        .insert([{ 
          code, 
          first_name: firstName.trim(), 
          last_name: lastName.trim(),
          status: "pending"
        }])

      if (error) throw error

      localStorage.setItem("accessCode", code)
      
      alert(`მოთხოვნა გაგზავნილია! თქვენი კოდია: ${code}`)
    } catch (error) {
      console.error("Error:", error)
      alert("მოთხოვნის გაგზავნა ვერ მოხერხდა")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center"
    >
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">წვდომის მოთხოვნა</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              სახელი
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
              placeholder="შეიყვანეთ სახელი"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              გვარი
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
              placeholder="შეიყვანეთ გვარი"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRequest}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium text-white disabled:opacity-50"
          >
            {isLoading ? "იგზავნება..." : "მოთხოვნის გაგზავნა"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function Index() {
  const [students, setStudents] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const checkAccess = async () => {
      const code = localStorage.getItem("accessCode")
      
      if (!code) {
        navigate("/request")
        return
      }

      const { data } = await supabase
        .from("access_requests")
        .select("status")
        .eq("code", code)
        .single()

      if (!data || data.status !== "approved") {
        navigate("/request")
      }
    }

    checkAccess()
  }, [navigate])

  const handleAddStudent = async (name) => {
    try {
      const { error } = await supabase
        .from("students")
        .insert([{ name, created_at: new Date().toISOString() }])

      if (error) throw error
      alert("მოსწავლე წარმატებით დაემატა")
    } catch (error) {
      console.error("Error:", error)
      alert("მოსწავლის დამატება ვერ მოხერხდა")
    }
  }

  const handleDeleteStudent = async (id) => {
    try {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", id)

      if (error) throw error
      alert("მოსწავლე წარმატებით წაიშალა")
    } catch (error) {
      console.error("Error:", error)
      alert("მოსწავლის წაშლა ვერ მოხერხდა")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">ჯგუფების მართვა</h2>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="მოსწავლის სახელი"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddStudent(e.target.value)
                  e.target.value = ''
                }
              }}
            />
          </div>
          <div className="space-y-2">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
              >
                <span>{student.name}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteStudent(student.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  წაშლა
                </motion.button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default App
