import React, { useState } from 'react'
import SignUp from './SignUp';

const SignIn = ({switchtoSignup}) => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log({email,password});
    };
  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-black  via-gray-900 to-zinc-800 px-4'>
        <form 
        onSubmit={handleSubmit}
        className='w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl'
        >

            <h1 className='text-3xl font-bold text-center mb-2 text-white'>Welcome Back</h1>

            <p className='text-gray-300 mb-6 text-center'>Sign in to continue</p>

            <input 
            type="email" 
            placeholder='Email' 
            value={email} 
            onChange={(e)=>setEmail(e.target.value)}
            className='w-full mb-4 px-4 py-4 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
            required 
            />

            <input 
            type="password" 
            placeholder='Password' 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)}
            className='w-full mb-4 px-4 py-4 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition'
            required 
            />
            
            <button
             type='submit'
             className='w-full py-3 rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:opacity-90 transition '
             >SignIn
             </button>

             <p className='text-gray-400 text-sm text-center mt-6'>Don't have an account?</p>

             <span onClick={switchtoSignup} className='text-blue-400 hover:underline cursor-pointer flex justify-center '>
                {""}sign up
             </span>

        </form>
 
    </div>
  )
}

export default SignIn
