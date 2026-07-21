import React from 'react';

// Menentukan tipe data untuk props
interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function MessageItem({ role, content }: MessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm md:text-base ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none'
        }`}
      >
        {/* Render text dengan newline jika ada */}
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  );
}