import React, { useEffect, useState } from 'react'
import { myProblems } from '../../api/userDashboard'
import { FaFilter } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const MyProblems = () => {
  const [problems, setProblems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMyProblems = async () => {
      try {
        const res = await myProblems()
        console.log(res.data.problems)
        setProblems(res.data.problems)
      } catch (error) {
        console.error(error)
      }
    }

    fetchMyProblems()
  }, [])

  const handleEdit = (problemId) => {
    console.log('Edit problem:', problemId);
  };

  const handleDelete = async (problemId) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        console.log('Delete problem:', problemId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <div className='flex flex-col gap-4 h-full'>
      <div className='p-1 flex flex-col gap-2'>
        <h1 className='text-2xl font-bold'>MY PROBLEMS</h1>
        <p className='text-stone-600'>Track and manage all the problems you've posted to the community.</p>
      </div>

      <div className='bg-white rounded-xl w-full h-fit py-3 px-4 flex flex-col gap-4 border-2 border-gray-300'>

        <div className='flex justify-between h-fit items-center'>
          <div className='flex gap-3 h-fit items-center p-1'>
            <h1 className='text-base md:text-lg font-bold'>Manage Problems - </h1>
            <div className='h-5 w-5 bg-black text-white rounded-full flex justify-center items-center text-xs'>{problems.length}</div>
          </div>
          <div className='px-2 md:px-5'>
            <FaFilter size={20} className="md:w-6 md:h-6" />
          </div>
        </div>


        {problems.map((problem) => (
          <div key={problem._id} className='bg-white rounded-md w-full min-h-20 py-3 px-3 md:px-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3 border-2 border-gray-300'>
            {/* Left side - Problem details */}
            <div className='flex flex-col gap-2 flex-1'>
              <h3 className='text-base md:text-lg font-semibold text-gray-800 line-clamp-2'>{problem.title}</h3>

              <div className='flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 flex-wrap'>
                <span className='flex items-center gap-1'>
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(problem.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>

                <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${problem.status === 'open' ? 'bg-amber-100 text-amber-700' :
                  problem.status === 'solved' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                  {problem.status.charAt(0).toUpperCase() + problem.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className='flex items-center gap-2 md:gap-3 flex-wrap'>
              <button onClick={() => navigate(`/problems/${problem._id}`)} className='px-3 md:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs md:text-sm font-semibold whitespace-nowrap'>
                View Solutions
              </button>

              <div className='flex items-center gap-2'>
                <button
                  onClick={() => handleEdit(problem._id)}
                  className='px-2 md:px-3 py-2 text-xs md:text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition'
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(problem._id)}
                  className='px-2 md:px-3 py-2 text-xs md:text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default MyProblems