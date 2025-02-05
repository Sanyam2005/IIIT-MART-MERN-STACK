import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaComments } from 'react-icons/fa';

const SupportChat = ({ isOpenFromNavbar, onClose }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! Welcome to IIIT MART Support. How can I help you today?'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const chatBoxRef = useRef(null);
    const baseURL = import.meta.env.VITE_API_URL;

    // Generate or retrieve sessionId
    const [sessionId, setSessionId] = useState('');

    useEffect(() => {
        // Initialize sessionId when the component mounts
        const storedSessionId = localStorage.getItem('chatSessionId');
        if (!storedSessionId) {
            const newSessionId = generateUniqueId();
            localStorage.setItem('chatSessionId', newSessionId);
            setSessionId(newSessionId);
        } else {
            setSessionId(storedSessionId);
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = {
            role: 'user',
            content: inputMessage.trim()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        try {
            const response = await axios.post(`${baseURL}/chat`, {
                message: inputMessage,
                sessionId: sessionId // Include sessionId in the request
            }, {
                withCredentials: true
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.message
            }]);
        } catch (error) {
            console.error('Error getting chat response:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        }
        setIsTyping(false);
    };

    // Function to generate a unique sessionId
    const generateUniqueId = () => {
        return 'session-' + Math.random().toString(36).substr(2, 9);
    };

    return (
        <div className={`fixed bottom-4 right-4 w-[95%] max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-lg shadow-xl transition-transform duration-300 transform ${isOpenFromNavbar ? 'translate-y-0' : 'translate-y-full'} z-50`}>
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <FaComments className="text-xl text-gray-800"/>
                    </div>
                    <div>
                        <h3 className="font-bold">Chat Support</h3>
                        <p className="text-sm opacity-90">Your AI assistant</p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Chat Messages */}
            <div 
                ref={chatBoxRef}
                className="h-64 md:h-96 overflow-y-auto p-4 space-y-4"
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-3/4 p-3 rounded-lg ${
                                message.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 rounded-bl-none">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t w-full ">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        className=" md:flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SupportChat;