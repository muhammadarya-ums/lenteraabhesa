'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Trash2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// 1. COMPONENT: Navbar
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Kamus', path: '/kamus' },
    { name: 'Sejarah', path: '/sejarah' },
    { name: 'Game🚀', path: '/game' },
    { name: 'Tentang Kami', path: '/tentang-kami' },
  ]

  return (
    <nav className="w-full bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Lentera Abhesa" width={140} height={60} priority className="cursor-pointer" />
          </Link>
        </div>

        <div className="hidden md:flex gap-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`text-sm font-semibold transition-colors ${
                  isActive ? 'text-[#005C43]' : 'text-gray-700 hover:text-[#005C43]'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>

        <Link
          href="/dukungkami"
          className="hidden md:block bg-[#005C43] text-white rounded-full px-6 py-2.5 font-medium text-[15px] hover:opacity-90 transition-opacity text-center"
        >
          Dukung Kami
        </Link>

        <button className="md:hidden p-2 text-[#005C43]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-left font-semibold transition-colors ${
                  isActive ? 'text-[#005C43]' : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
          <Link
            href="/dukungkami"
            className="w-full bg-[#005C43] text-white rounded-full py-3 font-bold text-center"
          >
            Dukung Kami
          </Link>
        </div>
      )}
    </nav>
  )
}

// 2. COMPONENT: ChatInterface
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halo, Bule Lentera AI, Bede se bisa nanti soal bhesa ken sejarah Bawean?',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
  }, [messages, isLoading]);

  const handleClearChat = () => {
    if (window.confirm('Yakin ingin menghapus semua riwayat percakapan?')) {
      setMessages([{
        id: Date.now().toString(),
        text: 'Riwayat obrolan dibersihkan. Yuk mulai lagi!',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    
    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/lentera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) throw new Error('Gagal memuat balasan');
      
      const data = await response.json();
      
      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Maaf, tidak ada balasan dari server.", 
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((prev) => [...prev, newBotMsg]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        text: 'Waduh, koneksi ke server lagi bermasalah nih. Coba periksa file route API lo ya!',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#EAF2ED] via-white to-[#EAF2ED] font-sans flex flex-col">
      
      {/* Navbar di-inject di sini biar menyatu sama halaman */}
      <Navbar />
      
      {/* Main Chat Layout - Responsive sizing */}
      {/* Desktop: dikasih padding biar melayang. Mobile: mepet ke pinggir layar biar lega */}
      <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col md:p-6 lg:p-8 h-[calc(100dvh-70px)] md:h-[calc(100vh-80px)]">
        
        {/* Chat Container */}
        <div className="flex flex-col flex-1 w-full bg-white/60 md:bg-white/80 backdrop-blur-xl md:rounded-[2rem] md:shadow-2xl md:border border-white overflow-hidden relative">
          
          {/* Chat Header */}
          <header className="shrink-0 flex items-center justify-between px-5 md:px-8 py-4 bg-white/90 backdrop-blur-md border-b border-[#005C43]/10 z-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#007A5A] to-[#005C43] text-white shadow-lg shadow-[#005C43]/30 relative shrink-0">
                <Sparkles size={20} className="absolute top-1 right-1 opacity-50" />
                <Bot size={24} />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 border-[2.5px] border-white rounded-full"></span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#005C43] to-[#003828] bg-clip-text text-transparent leading-tight">Lentera AI</h1>
                <p className="text-xs md:text-sm text-[#005C43]/70 font-medium">Asisten Cerdas Abhesa</p>
              </div>
            </div>
            <button 
              onClick={handleClearChat}
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
              title="Bersihkan Obrolan"
            >
              <Trash2 size={20} />
            </button>
          </header>

          {/* Chat Messages Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth bg-[#f8faf9]/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <span className="text-[11px] text-gray-400 mb-1.5 px-2 font-medium flex gap-2 items-center tracking-wide uppercase">
                    {isUser ? (
                      <>{msg.timestamp} <span className="text-[#005C43] font-bold">Anda</span></>
                    ) : (
                      <><span className="text-[#005C43] font-bold">Lentera</span> {msg.timestamp}</>
                    )}
                  </span>
                  
                  <div 
                    className={`max-w-[90%] md:max-w-[75%] px-5 py-3.5 text-[15px] leading-relaxed shadow-sm md:shadow-md ${
                      isUser 
                        ? 'bg-gradient-to-br from-[#007A5A] to-[#005C43] text-white rounded-[1.5rem] rounded-br-sm' 
                        : 'bg-white text-gray-700 border border-gray-100 rounded-[1.5rem] rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex flex-col items-start animate-in fade-in duration-300">
                <span className="text-[11px] text-[#005C43] font-bold mb-1.5 px-2 tracking-wide uppercase">Lentera sedang mengetik...</span>
                <div className="flex items-center gap-1.5 px-5 py-4 bg-white border border-gray-100 rounded-[1.5rem] rounded-bl-sm shadow-sm md:shadow-md w-fit">
                  <div className="w-2 h-2 rounded-full bg-[#005C43]/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#005C43]/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#005C43]/80 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </main>

          {/* Chat Input Footer */}
          <footer className="shrink-0 bg-white/90 backdrop-blur-md border-t border-[#005C43]/10 p-4 md:px-8 md:py-6">
            <form onSubmit={handleSubmit} className="relative flex items-center shadow-lg rounded-full">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tanyakan kosakata atau sejarah Bawean..."
                disabled={isLoading}
                className="w-full bg-white text-gray-800 placeholder-gray-400 px-6 py-4 pr-16 rounded-full border border-gray-200 focus:border-[#005C43] focus:outline-none focus:ring-2 focus:ring-[#005C43]/20 transition-all duration-300 disabled:opacity-70 shadow-inner text-[15px]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 flex items-center justify-center w-11 h-11 bg-gradient-to-br from-[#007A5A] to-[#005C43] text-white rounded-full hover:shadow-lg hover:shadow-[#005C43]/40 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005C43] group"
              >
                <Send size={18} className={`${inputValue.trim() && !isLoading ? 'group-hover:translate-x-1 group-hover:-translate-y-1' : ''} transition-transform`} />
              </button>
            </form>
            <p className="text-center text-[11px] text-gray-400 mt-3 font-medium hidden md:block">
              Lentera AI dapat membuat kesalahan. Harap periksa kembali informasi penting.
            </p>
          </footer>

        </div>
      </div>
    </div>
  );
}