"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { queryKnowledgeBase } from '@/lib/knowledgeBase';
import clsx from 'clsx';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hello! I'm Santanu's AI assistant. Ask me about his work in Business Technology Strategy, his time at Bank of America/Deloitte, or his MBA from Duke.",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: newMessages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                }),
            });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('You are sending messages too quickly. Please wait a minute.');
                }
                throw new Error('Failed to connect to the server.');
            }

            const data = await response.json();

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.content,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error: any) {
            console.error("Failed to fetch response", error);
            // Fallback message
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: error.message || "I'm having trouble connecting right now. Please try again in a moment.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-neutral-950">
            {/* Header for mobile/small screens (optional context) */}
            <div className="md:hidden p-4 border-b border-neutral-800 bg-neutral-900 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                    SS
                </div>
                <span className="font-semibold text-white">Santanu Sarkar</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={clsx(
                                "flex gap-4 max-w-3xl mx-auto",
                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                                msg.role === 'assistant'
                                    ? "bg-neutral-800 border-neutral-700 text-indigo-400"
                                    : "bg-neutral-800 border-neutral-700 text-neutral-400"
                            )}>
                                {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                            </div>

                            <div className={clsx(
                                "rounded-2xl px-5 py-3 text-sm leading-relaxed max-w-[80%]",
                                msg.role === 'assistant'
                                    ? "bg-neutral-900 border border-neutral-800 text-neutral-200"
                                    : "bg-indigo-600 text-white"
                            )}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 max-w-3xl mx-auto"
                    >
                        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 text-indigo-400">
                            <Bot size={18} />
                        </div>
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 backdrop-blur-md">
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about my experience, skills, or background..."
                            aria-label="Chat input"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            aria-label="Send message"
                            className="absolute right-2 p-2 bg-indigo-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors"
                        >
                            {isLoading ? <Sparkles size={18} className="animate-pulse" /> : <Send size={18} />}
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <p className="text-[11px] text-neutral-500 font-medium">
                            AI generated responses. Please verify important information directly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
