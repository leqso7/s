import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export function RequestForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

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
  )
}
