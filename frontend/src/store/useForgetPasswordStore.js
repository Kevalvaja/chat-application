import toast from "react-hot-toast"
import { create } from "zustand"
import { axiosInstance } from "../lib/axios";

export const usePasswordStore = create((set, get) => ({
    isSendOTP: false,
    isVerifyOTP: false,
    isVerifyEmail: false,
    isWrongEmail: false,
    forgetData: null,
    sendOTPMessage: null,

    /** change password field */
    isChangePassword: false,


    sendOTP: async (data) => {
        try {
            set({ isSendOTP: true });
            const res = await axiosInstance.post('/auth/send-otp', data)
            toast.success(res?.data?.message);
            set({ sendOTPMessage: res?.data?.sendMailId, isVerifyEmail: true })
        } catch (error) {
            toast.error(error.response.data.message)
            set({ isWrongEmail: true, isVerifyEmail: false })
        } finally {
            set({ isSendOTP: false })
        }
    },

    verifyOTP: async (data) => {
        try {
            set({ isVerifyOTP: true });
            const res = await axiosInstance.post('/auth/verify-otp', data)
            toast.success(res?.data?.message);
            set({ forgetData: res?.data?.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isVerifyOTP: false, isVerifyEmail: false, isWrongEmail: false })
        }
    },

    defaultPasswordSelection: () => {
        set({
            isSendOTP: false,
            isVerifyOTP: false,
            isVerifyEmail: false,
            isWrongEmail: false,
            forgetData: null,
            sendOTPMessage: null,
            /** change password field */
            isChangePassword: false,
        })
    },

    forgotPassword: async(data) => {
        try {
            set({ isChangePassword: true })
            const res = await axiosInstance.put(`/auth/update-password/${get().forgetData?._id}`, data)
            toast.success(res?.data?.message);
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isChangePassword: false })
        }
    }
}))