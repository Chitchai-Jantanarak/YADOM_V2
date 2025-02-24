import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import OtpInput from 'react-otp-input';
import Logo from '../components/ui/Logo';
import PageTransition from '../components/layout/PageTransition';

const PasswordForgot = () => {

    const [steps, setSteps] = useState( 3 );
    const [otp, setOtp] = useState("");

    const handleOtpChange = (otp) => {
        setOtp(otp);
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
        <div className='login'>  
            <section className='max-h-full max-w-full grid sm:grid-cols-5'>
                <div className='col-span-3 grid grid-rows-8'>
                    {/* header */}
                    <div className='row-span-1 flex justify-between items-center p-5 m-0 w-full'>   
                        <Logo />

                        <div className="flex items-center space-x-4">
                            <span className="font-montserrat font-extralight text-xs">
                                No Account yet?
                            </span> 
                            <Link to="/register">
                                <button className="font-montserrat font-medium px-5 py-2 border border-black transition-all duration-300 hover:bg-black hover:text-white">
                                    Sign up
                                </button>
                            </Link>
                        </div>
                    </div>

                    { steps === 1 && (
                    <>
                        {/* content I */}
                        <div className="row-span-7 flex items-center justify-center">
                            <div className='inline-block font-poppins text-center w-2/3 space-y-5'>
                                <h1 className='font-extrabold text-3xl'>
                                    Forget Password
                                </h1>
                                <h2 className='font-montserrat font-light text-sm text-black tracking-wider'>
                                    Please enter your email to reset the password
                                </h2>

                                {/* Form */}
                                <form className="space-y-3">
                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="email"
                                            className="block text-left font-extrabold"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div>
                                        {/* TODO : make sending to backend -> step to 2 if completed */}
                                        <button
                                            type="submit"
                                            className="px-12 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 util-textshadow-default focus:ring-offset-1"
                                        >
                                            Enter
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                    )}


                    { steps === 2 && (
                    <>
                        {/* content II */}
                        <div className="row-span-7 flex items-center justify-center">
                            <div className='inline-block font-poppins text-center w-2/3 space-y-5'>
                                <h1 className='font-extrabold text-3xl'>
                                    Check you email
                                </h1>
                                <h2 className='font-montserrat font-light text-sm text-black tracking-wider'>
                                    We send a reset link to example@gmail.com
                                    <br /> enter 5 digit code that mentioned in the email
                                </h2>

                                <br />

                                <div className='flex text-center justify-center'>
                                    <OtpInput
                                        value={otp}
                                        onChange={handleOtpChange}
                                        numInputs={6}
                                        renderInput={(props) => <input {...props} style={{ width: '48px', height: '56px', marginRight: '10px' }} className='input input-bordered' />}
                                    />
                                </div>

                            </div>
                        </div>
                    </>
                    )}


                    { steps === 3 && (
                    <>
                        {/* content III */}
                        <div className="row-span-7 flex items-center justify-center">
                            <div className='inline-block font-poppins text-center w-2/3 space-y-5'>
                                <h1 className='font-extrabold text-3xl'>
                                    Password reset
                                </h1>
                                <h2 className='font-montserrat font-light text-sm text-black tracking-wider'>
                                    Your password has been successfully reset.
                                    <br /> click confirm to set a new password
                                </h2>

                                <br />
                                <Link to="../PasswordReset">
                                    <button
                                        className="px-12 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 util-textshadow-default focus:ring-offset-1"
                                    >
                                        Confirm
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </>
                    )}
                    


                </div>
                <div className="col-span-2 flex bg-red-500 max-sm:hidden"></div>

            </section>
        </div>
    );
}

export default PageTransition(PasswordForgot);