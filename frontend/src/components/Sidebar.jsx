import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { Mail, Trash, UserPlus, UserX, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, addNewUsers, isAddedNewUser, removeUsers, isDeleteUser, setAddUser, isUsersLoading } = useChatStore();

    const [showOnlineOnly, setShowOnlineOnly] = useState(false)

    const [showRemove, setShowRemove] = useState(false);

    const [email, setEmail] = useState("")

    const { onlineUsers } = useAuthStore()

    const filterOnlineUsers = showOnlineOnly ? users?.filter((item) => onlineUsers.includes(item?._id)) : users;
    const checkOnlineCurrentUsers = users?.filter((user) => onlineUsers?.includes(user?._id))
    
    useEffect(() => {
        getUsers();
    }, [getUsers])

    const validationForm = () => {
        if (!email?.trim()) return toast.error("Email is required")
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error("Invalid email format");
        return true
    }

    const handleSumbit = async (e) => {
        e.preventDefault();
        const success = validationForm()
        if (success === true) {
            addNewUsers({ email: email })
            setEmail("")
        }
    }

    const handleRemoveUser = async (e, users) => {
        e.preventDefault();
        console.log(users)
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete && users) {
            removeUsers(users);
        }
    }

    // if(isUsersLoading) return <SlidebarSe
    return (
        <>
            <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
                <div className='border-b border-base-300 w-full p-5'>
                    <div className='flex items-center gap-2'>
                        <div className='flex hover:bg-base-300 rounded-sm w-36 py-2 px-2 cursor-pointer' onClick={() => document.getElementById('my_modal_3').showModal()}>
                            <UserPlus className='size-6' />&nbsp;
                            <span className='font-medium hidden lg:block'>Add Contacts</span>
                        </div>
                    </div>
                    {/** TODO: Online filter toggle */}
                    <div className='mt-3 hidden lg:flex items-center gap-2'>
                        <label className='cursor-pointer flex items-center gap-2'>
                            <input
                                type='checkbox'
                                checked={showOnlineOnly}
                                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                                className='checkbox checkbox-sm'
                            />
                            <span className='text-sm'>Show Online Only</span>
                        </label>
                        <span className='text-xs text-zinc-500'>({checkOnlineCurrentUsers?.length} Online)</span>
                    </div>
                </div>
                <div className='overflow-y-auto w-full py-3'>
                    {filterOnlineUsers?.map((user) => (
                        <button
                            key={user?._id}
                            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer
                            ${selectedUser?._id === user?._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <div className='relative mx-auto lg:mx-0'>
                                <img
                                    src={user?.profilePic || "/avatar.png"}
                                    alt={user?.name}
                                    className='size-12 object-cover rounded-full'
                                    onError={(e) => {
                                        e.currentTarget.src = '/avatar.png'
                                    }}
                                />
                                {onlineUsers?.includes(user?._id) && (
                                    <span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900' />
                                )}
                                {showRemove &&
                                    <button
                                        type="button"
                                        className={`absolute bottom-8 right-8 flex items-center justify-center size-5 ring-2 ring-red-500 rounded-full shadow-lg transition-transform duration-200 ease-in-out
                                        hover:scale-110 hover:bg-red-600 active:scale-90 
                                        ${isDeleteUser ? "animate-pulse pointer-events-none opacity-50" : ""}`}
                                        onClick={(e) => handleRemoveUser(e, user)}
                                    >
                                        <Trash size={12} />
                                    </button>

                                }

                            </div>
                            {/** User info - only visible on larger screens */}
                            <div className='hidden lg:block text-left min-w-8'>
                                <div className='font-medium truncate'>{user?.fullName}</div>
                                <div className='text-sm text-zinc-400'>
                                    {onlineUsers?.includes(user?._id) ? "Online" : "Offline"}
                                </div>
                            </div>
                        </button>
                    ))}
                    {filterOnlineUsers?.length === 0 && (
                        <div className='text-center text-zinc-500 py-4'>No online users</div>
                    )}
                </div>

                {/* Fixed bottom div */}
                <div className="border-t border-base-300 w-full pl-5 p-2 mt-auto">
                    <div className="flex items-center gap-2 text-sm">
                        <div
                            className="flex rounded-sm w-45 py-2 px-2 cursor-pointer"
                            onClick={() => setShowRemove(!showRemove)}
                        >
                            {showRemove ? (
                                <>
                                    <X className="size-5" />&nbsp;
                                </>
                            ) : (
                                <>
                                    <UserX className="size-5" /> &nbsp;
                                </>
                            )}
                            <span className="font-medium hidden lg:block">
                                {showRemove ? "Clear" : "Remove Contacts"}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>


            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => {
                            setEmail("")
                        }}>✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Add new contacts</h3>
                    <div className='text-center pt-3'>
                        <label className="input validator">
                            <Mail className='text-zinc-400' />
                            <input
                                type="input"
                                placeholder="Enter email id"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <p className='text-sm text-zinc-400'>Add your new contact here</p>
                    </div>
                    <div className='text-center pt-2'>
                        <button className='btn btn-primary' onClick={handleSumbit}>{isAddedNewUser ? "Loading..." : "Submit"}</button>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default Sidebar
