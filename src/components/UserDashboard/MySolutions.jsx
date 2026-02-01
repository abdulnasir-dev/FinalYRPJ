import React, { useEffect, useState } from 'react'

import { FaFilter } from "react-icons/fa6";
import { FetchMySolutions } from '../../api/userDashboard';
import { useNavigate } from 'react-router-dom';

const MySolutions = () => {
  const [solutions, setSolutions] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMySolutions = async () => {
      try {
        const res = await FetchMySolutions()
        console.log(res.data)
        setSolutions(res.data.solutions)
      } catch (error) {
        console.error(error)
      }
    }

    fetchMySolutions()
  }, [])

  const handleDelete = async (solutionId) => {
    if (window.confirm('Are you sure you want to delete this solution?')) {
      try {
        console.log('Delete solution:', solutionId);
        // await deleteSolution(solutionId);
        // setSolutions(solutions.filter(s => s._id !== solutionId));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <div className='flex flex-col gap-4 h-full'>
      <div className='p-1 flex flex-col gap-2'>
        <h1 className='text-2xl font-bold'>MY SOLUTIONS</h1>
        <p className='text-stone-600'>View and manage all the solutions you've contributed to the community.</p>
      </div>

      <div className='bg-white rounded-xl w-full h-fit py-3 px-4 flex flex-col gap-4 border-2 border-gray-300'>

        <div className='flex justify-between h-fit items-center'>
          <div className='flex gap-3 h-fit items-center p-1'>
            <h1 className='text-base md:text-lg font-bold'>My Contributions - </h1>
            <div className='h-5 w-5 bg-black text-white rounded-full flex justify-center items-center text-xs'>{solutions.length}</div>
          </div>
          <div className='px-2 md:px-5'>
            <FaFilter size={20} className="md:w-6 md:h-6" />
          </div>
        </div>


        {solutions.map((solution) => (
          <div key={solution._id} className='bg-white rounded-md w-full min-h-32 py-4 px-3 md:px-4 flex flex-col gap-3 border-2 border-gray-300'>
            {/* Top - Problem Title */}
            <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-2'>
              <div className='flex-1'>
                <h3 className='text-sm md:text-base font-semibold text-gray-600 mb-1'>Problem:</h3>
                <h2 className='text-base md:text-lg font-bold text-gray-800'>{solution.problemId?.title || 'Problem title unavailable'}</h2>
              </div>

              <div className='flex items-center gap-2 text-xs md:text-sm text-gray-500'>
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(solution.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>

            {/* Middle - Solution Text */}
            <div className='flex flex-col gap-1'>
              <h3 className='text-sm md:text-base font-semibold text-gray-600'>Your Solution:</h3>
              <p className='text-sm md:text-base text-gray-700 line-clamp-3'>
                {solution.answer}
              </p>
            </div>

            {/* Bottom - Actions */}
            <div className='flex items-center justify-between flex-wrap gap-2'>
              <button
                onClick={() => navigate(`/problems/${solution.problemId._id || solution.problemId}`)}
                className='px-3 md:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs md:text-sm font-semibold'
              >
                View Problem
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent div click
                  handleDelete(solution._id);
                }}
                className='px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200'
              >
                Delete Solution
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default MySolutions