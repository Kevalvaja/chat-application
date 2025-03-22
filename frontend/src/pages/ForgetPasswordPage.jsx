import { BadgeX, Loader2, Mail, MessageSquare, Verified } from 'lucide-react'
import React, { useState } from 'react'
import AuthImagePattern from '../components/AuthImagePattern'
import toast from 'react-hot-toast'
import { usePasswordStore } from '../store/useForgetPasswordStore'
import ForgotPassword from '../components/Forgot-Password'

const ForgetPasswordPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        otp1: "",
        otp2: "",
        otp3: "",
        otp4: "",
    })

    const { isSendOTP, isVerifyEmail, isWrongEmail, sendOTP, sendOTPMessage, verifyOTP, isVerifyOTP, forgetData } = usePasswordStore();

    const validation = () => {
        if (!formData?.email?.trim()) return toast.error("Email is required");
        if (sendOTPMessage && (!formData?.otp1?.trim() || !formData?.otp2?.trim() || !formData?.otp3?.trim() || !formData?.otp4?.trim())) return toast.error("All otp field is required");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData?.email)) return toast.error("Invalid email format");
        return true;
    }

    const handleEmailVerification = async (e) => {
        e.preventDefault();
        const success = validation();
        if (success === true) {
            sendOTP({ email: formData?.email })
        }
    }

    const handleOTPVerification = async (e) => {
        e.preventDefault();
        const success = validation();
        if (success === true) {
            const newOTP = `${formData?.otp1}${formData?.otp2}${formData?.otp3}${formData?.otp4}`
            verifyOTP({ otp: newOTP })
            setFormData({
                otp1: "",
                otp2: "",
                otp3: "",
                otp4: "",
            })
        }
    }
    return (
        <>
            {forgetData ? (
                <>
                    <ForgotPassword />
                </>
            ) : (
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
                                    <p className='text-base-content/60'>Verify your email</p>
                                </div>
                            </div>

                            <form onSubmit={!sendOTPMessage ? handleEmailVerification : handleOTPVerification} className='space-y-6'>
                                <div className='form-control'>
                                    <label className='label'>
                                        <span className='label-text font-medium'>Email</span>
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <Mail className='size-5 text-base-content/40' />
                                        </div>
                                        <input
                                            type='text'
                                            className={`input input-bordered w-full pl-10`}
                                            placeholder='your@example.com'
                                            value={formData?.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            disabled={isVerifyEmail}
                                        />
                                        <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                                            {isVerifyEmail ?
                                                <Verified className='size-5 text-base-content/40 text-green-500' />
                                                : isWrongEmail ?
                                                    <BadgeX className='size-5 text-base-content/40 text-red-500' />
                                                    : ""}
                                        </div>
                                    </div>
                                </div>

                                {sendOTPMessage &&
                                    <div className="flex justify-center space-x-2">
                                        <input
                                            type="text"
                                            maxLength="1"
                                            className="w-12 h-12 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={formData?.otp1}
                                            onChange={(e) => setFormData({ ...formData, otp1: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            maxLength="1"
                                            className="w-12 h-12 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={formData?.otp2}
                                            onChange={(e) => setFormData({ ...formData, otp2: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            maxLength="1"
                                            className="w-12 h-12 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={formData?.otp3}
                                            onChange={(e) => setFormData({ ...formData, otp3: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            maxLength="1"
                                            className="w-12 h-12 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={formData?.otp4}
                                            onChange={(e) => setFormData({ ...formData, otp4: e.target.value })}
                                        />
                                    </div>
                                }

                                <button type='submit' className='btn btn-primary w-full' disabled={isSendOTP || isVerifyOTP}>
                                    {isSendOTP || isVerifyOTP ? (
                                        <>
                                            <Loader2 className='size-5 animate-spin'></Loader2>
                                            {isVerifyEmail && !isSendOTP ? "Verify OTP" : "Verify email..."}
                                        </>
                                    ) : (
                                        "Click here"
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
            )}
        </>
    )
}

export default ForgetPasswordPage
