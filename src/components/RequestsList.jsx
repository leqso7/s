import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export function RequestsList() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('access_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setRequests(data)
    } catch (error) {
      console.error('Error fetching requests:', error)
      alert('მოთხოვნების ჩატვირთვა ვერ მოხერხდა')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('access_requests')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      // Refresh the requests list
      fetchRequests()
    } catch (error) {
      console.error('Error updating request:', error)
      alert('სტატუსის განახლება ვერ მოხერხდა')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <motion.div
          key={request.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-4 rounded-lg shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">
                {request.first_name} {request.last_name}
              </h3>
              <p className="text-sm text-gray-400">Code: {request.code}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange(request.id, 'approved')}
                className={`px-3 py-1 rounded ${
                  request.status === 'approved'
                    ? 'bg-green-600'
                    : 'bg-gray-600 hover:bg-green-600'
                }`}
              >
                დადასტურება
              </button>
              <button
                onClick={() => handleStatusChange(request.id, 'rejected')}
                className={`px-3 py-1 rounded ${
                  request.status === 'rejected'
                    ? 'bg-red-600'
                    : 'bg-gray-600 hover:bg-red-600'
                }`}
              >
                უარყოფა
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
