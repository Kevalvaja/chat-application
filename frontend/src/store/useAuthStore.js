import toast from "react-hot-toast";
import { axiosInstance, BASE_URL } from "../lib/axios.js"
import { create } from "zustand";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check')
            set({ authUser: res?.data })
            get().connectSocket()
        } catch (error) {
            console.log('Error in checkAuth:', error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/singup", data)
            set({ authUser: res?.data })
            toast.success("Account created successfully")
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIng: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res?.data })
            toast.success("Login successfully")

            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isLoggingIng: false })
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout")
            if (res?.status === 200) {
                toast.success(res?.data?.message)
                setTimeout(() => {
                    set({ authUser: null })
                }, 1000);
                get().disconnectSocket()
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    updateProfile: async (data) => {
        try {
            set({ isUpdatingProfile: true })
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data })
            toast.success("Profile updated successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    /** after login connect socket io */
    connectSocket: async () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return
        const socket = io(BASE_URL, {
            query: {
                userId: authUser?._id
            }
        });
        socket.connect();

        set({ socket: socket })

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })
    },

    /** disconnect socket io */
    disconnectSocket: async () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}))
