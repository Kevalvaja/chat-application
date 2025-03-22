import React, { useState } from 'react'
import AuthImagePattern from './AuthImagePattern'
import { Eye, EyeOff, MessageSquare, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePasswordStore } from '../store/useForgetPasswordStore';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate()
    const { isChangePassword, forgotPassword } = usePasswordStore();

    const [showPassword, setShowPassword] = useState({
        pass: false,
        cpass: false,
    });

    const [formData, setFormData] = useState({
        pass: "",
        cpass: "",
    })

    const validation = () => {
        if (!formData?.pass?.trim()) return toast.error("Password is required");
        if (formData?.pass?.length < 6) return toast.error("Password must be at least 6 characters long");
        if (!formData?.cpass?.trim()) return toast.error("Cofirm password is required");
        if (formData.pass != formData?.cpass) return toast.error("Password and confirm password both are not match")
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = validation();
        if (success === true) {
            forgotPassword({ password: formData?.pass });
            navigate("/login")
        }
    }
    return (
        <div className='min-h-screen grid lg:grid-cols-2'>
            {/** Left side */}
            <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
                <div className='w-full max-w-md space-y-8'>
                    {/** LOGO */}
                    <div className='text-center mb-8'>
                        <div className='flex flex-col items-center gap-2 group'>
                            <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                                <MessageSquare className='size-6 text-primary' />
                            </div>
                            <h1 className='text-2xl font-bold mt-2'>Forget Password</h1>
                            <p className='text-base-content/60'>Change your password</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text font-medium'>Password</span>
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Lock className='size-5 text-base-content/40' />
                                </div>
                                <input
                                    type={showPassword.pass ? "text" : "password"}
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder='*****'
                                    value={formData?.pass}
                                    onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                                />
                                <button
                                    type='button'
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                    onClick={() => setShowPassword({ ...showPassword, pass: !showPassword.pass })}
                                >
                                    {showPassword.pass ?
                                        <EyeOff className='size-5 text-base-content/40' />
                                        : <Eye className='size-5 text-base-content/40' />}
                                </button>
                            </div>
                        </div>

                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text font-medium'>Confirm Password</span>
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Lock className='size-5 text-base-content/40' />
                                </div>
                                <input
                                    type={showPassword.cpass ? "text" : "password"}
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder='*****'
                                    value={formData?.cpass}
                                    onChange={(e) => setFormData({ ...formData, cpass: e.target.value })}
                                />
                                <button
                                    type='button'
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                    onClick={() => setShowPassword({ ...showPassword, cpass: !showPassword.cpass })}

                                >
                                    {showPassword.cpass ?
                                        <EyeOff className='size-5 text-base-content/40' />
                                        : <Eye className='size-5 text-base-content/40' />}
                                </button>
                            </div>
                        </div>

                        <button type='submit' className='btn btn-primary w-full' disabled={isChangePassword}>
                            {isChangePassword ? (
                                <>
                                    <Loader2 className='size-5 animate-spin'></Loader2>
                                    Loading...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </button>

                    </form>
                </div>
            </div>


            <AuthImagePattern
                title="Join our community"
                subtitle={"Connect with friends, share moments, and stay in toouch with your loved ones."}
            />
        </div>
    )
}

export default ForgotPassword
