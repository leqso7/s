import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export function RequestsList() {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRequests(data)
    } catch (error) {
      console.error('Error fetching requests:', error)
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      fetchRequests()
    } catch (error) {
      console.error('Error updating request:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6">მოთხოვნების სია</h2>
      <div className="space-y-4">
        {requests.map((request) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{request.name}</h3>
                <p className="text-gray-600">{request.email}</p>
                <p className="text-gray-600">ჯგუფი: {request.group}</p>
                <p className="mt-2">{request.message}</p>
              </div>
              <div className="flex space-x-2">
                {request.status === 'pending' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusUpdate(request.id, 'approved')}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      დადასტურება
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusUpdate(request.id, 'rejected')}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      უარყოფა
                    </motion.button>
                  </>
                )}
                {request.status === 'approved' && (
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded">
                    დადასტურებული
                  </span>
                )}
                {request.status === 'rejected' && (
                  <span className="px-4 py-2 bg-red-100 text-red-800 rounded">
                    უარყოფილი
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
