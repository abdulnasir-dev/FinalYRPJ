import React, { useState } from 'react'

const SignUp = ({ switchtoSignin }) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Password doesn't Match!");
            return;
        }

        console.log({ email, name, password });

    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-black  via-gray-900 to-zinc-800 px-4'>

            <form onSubmit={handleSubmit} className='w-full max-w-md px-8 backdrop-blur-1xl bg-white/10 border-white/20 rounded-2xl p8 shadow-2xl'>
                <h1 className='text-3xl text-center mb-2 text-white mt-9 font-bold font-sans'>Welcome!</h1>
                <p className='text-gray-300 mb-6 text-center'>Sign up To Continue</p>


                <input 
                type="text" 
                placeholder='Enter Your FullName'
                value={name}
                onChange={(e)=> setName(e.target.value)}
                required
                className='w-full mb-4 px-4 py-4 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition' 
                />
                <input 
                type="email" 
                placeholder='Enter Your Email'
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                required
                className='w-full mb-4 px-4 py-4 bg-white/10 rounded-lg  placeholder-gray-400 text-white outline-none border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition ' 
                />
                <input 
                type="password" 
                placeholder='Enter Your passowrd'
                value={password}
                required
                onChange={(e)=> setPassword(e.target.value)}
                className='w-full mb-4 px-4 py-4 bg-white/10 rounded-lg  placeholder-gray-400 text-white outline-none border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition ' 
                />
                <input 
                type="password" 
                placeholder='Confirm your Password'
                value={confirmPassword}
                required
                onChange={(e)=> setConfirmPassword(e.target.value)}
                className='w-full mb-4 px-4 py-4 bg-white/10 rounded-lg  placeholder-gray-400 text-white outline-none border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition ' 
                />

                <button
             type='submit'
             className='w-full py-3 rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:opacity-90 transition '
             >SignUp</button>

                <p className='text-sm text-gray-300 text-center mt-6'>Already have an Account?</p>
                <span onClick={switchtoSignin} className='text-blue-400 hover:underline flex justify-center pb-6 text-sm '>SignUp</span>
            </form>

        </div>
    )
}

export default SignUp
