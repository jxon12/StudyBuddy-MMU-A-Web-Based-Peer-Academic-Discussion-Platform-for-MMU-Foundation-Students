import './App.css'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

function App() {
  const [count, setCount] = useState(0)
  const [supabaseReady, setSupabaseReady] = useState(false)

  useEffect(() => {
    // Initialize Supabase client
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      createClient(supabaseUrl, supabaseAnonKey)
      setSupabaseReady(true)
      console.log('Supabase initialized successfully')
    } else {
      console.warn('Supabase configuration missing. Please check .env file')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
            StudyBuddy MMU
          </h1>
          
          <p className="text-center text-gray-600 mb-6">
            A Web-Based Peer Academic Discussion Platform
          </p>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Status:</span>{' '}
              {supabaseReady ? (
                <span className="text-green-600">✓ Supabase Connected</span>
              ) : (
                <span className="text-yellow-600">⚠ Configure Supabase</span>
              )}
            </p>
          </div>

          <button
            onClick={() => setCount((count) => count + 1)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Clicks: {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
