import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import PageTransition from '../components/layout/PageTransition';
import Logo from '../components/ui/Logo';
import Door from '../components/ui/Door';
import { countryCodes } from '../utils/CountryCode';

const Register = () => {

    const [selectedCountry, setSelectedCountry] = useState("+66");

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
    };

    // const [formData, setFormData] = useState({
    //     username: "",
    //     email: "",
    //     password: "",
    // });
    // const [error, setError] = useState("");
    // const [success, setSuccess] = useState("");

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({ ...formData, [name]: value });
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setError("");
    //     setSuccess("");

    //     try {
    //         const response = await axios.post("https://your-backend-url.com/register", formData);
    //         setSuccess("Registration successful!");
    //     } catch (err) {
    //         setError(err.response?.data?.message || "Something went wrong. Please try again.");
    //     }
    // };

    return (
        <div className='register'>  
            <section className='max-h-full max-w-full grid'>
                

                <div className='max-h-lvh grid grid-rows-8 md:mx-36 bg-white'>

                    {/* header */}
                    <div className='row-span-1 flex justify-center items-center p-5 m-0 w-full'>   
                        <Logo width='160' height='60' />
                    </div>

                    {/* content */}
                    <div className="row-span-7 flex items-center justify-center">
                        <div className='inline-block font-poppins w-2/3 space-y-5'>
                            <h1 className='font-extrabold text-3xl'>
                                Create an Account
                            </h1>
    
                            {/* Form */}
                            <form className="space-y-4">
                                {/* Account Field */}
                                <h2 className='font-anybody font-light text-sm text-gray-400 tracking-wider'>
                                    Account Details
                                </h2>
                                    {/* First Name */}
                                    <div className="space-y-2">
                                        <input
                                            type="firstName"
                                            id="firstName"
                                            name="firstName"
                                            placeholder="First Name"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>
                                    {/* Last Name */}
                                    <div className="space-y-2">
                                        <input
                                            type="lastName"
                                            id="lastName"
                                            name="lastName"
                                            placeholder="Last Name"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>
                                    {/* Phone number */}
                                    <div className='flex space-x-2 flex-row w-full'>
                                    <select
                                        className="select select-bordered w-full max-w-24"
                                        value={selectedCountry}
                                        onChange={handleCountryChange}
                                    >
                                        <option disabled value="+66">+66</option>
                                        {countryCodes.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.code}
                                            </option>
                                        ))}
                                    </select>

                                        <div className="space-y-2 w-full">
                                            <input
                                                type="phoneNumber"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                placeholder="Phone Number"
                                                className="input input-bordered w-full"
                                                required
                                            />
                                        </div>
                                    </div>
                                    

                                {/* Password Field */}
                                <h2 className='font-anybody font-light text-sm text-gray-400 tracking-wider'>
                                    Create Password
                                </h2>
                                    {/* Password */}
                                    <div className="space-y-2">
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            placeholder="Password"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>
                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <input
                                            type="confirmPassword"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>
                                
                                <br />

                                {/* Submit Button */}
                                <div className='flex justify-between'>
                                    <button
                                        type="submit"
                                        className="px-12 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 util-textshadow-default focus:ring-offset-1"
                                    >
                                        Sign Up
                                    </button>

                                    <Link className='flex flex-row space-x-2' to={'/Login'}> 
                                        <p> Login </p>
                                        <Door />
                                    </Link>

                                </div>
                            </form>
                            
                        </div>
                    </div>
                </div>
                <div className='fixed -z-10 bg-blue-500 h-full w-full'></div>
            </section>
        </div>
    );
}

export default PageTransition(Register);    