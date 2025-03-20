import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isAddedNewUser: false,
    addUser: false,
    isDeleteUser: false,

    getUsers: async () => {
        try {
            set({ isUsersLoading: true })
            const res = await axiosInstance.get('/messages/users')
            set({ users: res?.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },

    getMessages: async (userId) => {
        try {
            set({ isMessagesLoading: true })
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({ messages: res?.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (messageData) => {
        try {
            const { selectedUser, messages } = get()
            const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`, messageData)
            set({ messages: [...messages, res?.data] })
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    addNewUsers: async (data) => {
        try {
            set({ isAddedNewUser: true })
            const res = await axiosInstance.post("/messages/add-friend", data);
            toast.success(res.data.message)
            get().getUsers();
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isAddedNewUser: false })
        }
    },

    removeUsers: async (data) => {
        try {
            set({ isDeleteUser: true })
            const res = await axiosInstance.delete(`/messages/delete-friend/${data?.Friends_array?._id}`, { data })
            toast.success(res?.data?.message)
            get().getUsers()
            set({ selectedUser: null })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isDeleteUser: false })
        }
    },

    // todo: optimize this one later
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    subscribeToMessages: () => {
        const { selectedUser } = get()
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket
        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser?._id) return;
            set({
                messages: [...get().messages, newMessage]
            })
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessage");
    }
}))