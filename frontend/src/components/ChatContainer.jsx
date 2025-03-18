import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput'
import MessageSkeleton from './MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore()
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser?._id)
    }
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messages && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])


  if (isMessagesLoading) return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>
  )

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages?.map((message) => (
          <div
            key={message?._id}
            className={`chat ${message?.senderId === authUser?._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img src={message?.senderId === authUser?._id ? authUser?.profilePic || "/avatar.png" :
                  selectedUser.profilePic || "/avatar.png"
                }
                  alt="profile pic"
                  onError={(e) => {
                    e.currentTarget.src = '/avatar.png'
                  }}
                />
              </div>
            </div>
            <div className='chat-header mb-1'>
              <div className='text-xs opacity-50 ml-1'>
                {formatMessageTime(message?.createdAt)}
              </div>
            </div>

            <div className='chat-bubble flex flex-col'>
              {message?.image && (
                <img
                  src={message?.image}
                  alt="Attachement"
                  className='sm:max-w-[200px] rounded-md mb-2'
                />
              )}
              {message?.text && <p>{message?.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  )
}

export default ChatContainer
