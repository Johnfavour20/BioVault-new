import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleGenAI, Chat } from "@google/genai";
import { Sparkles, Send, Bot } from 'lucide-react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const suggestedPrompts = [
  "Summarize my latest blood test results.",
  "What are the potential side effects of Lisinopril?",
  "List all my allergies.",
  "When was my last physical exam?",
];

const AIAssistant: React.FC = () => {
  const { user, healthRecords } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);
  
  const initChat = () => {
      if (user && healthRecords) {
        const recordList = healthRecords.map(doc => `- ${doc.name} (${doc.type})`).join('\n');
        const allergies = user.allergies.join(', ') || 'None';
        const conditions = user.chronicConditions.join(', ') || 'None';
        const medications = user.medications.map(m => `${m.name} (${m.dosage}, ${m.frequency})`).join(', ') || 'None';

        const systemInstruction = `You are BioVault AI, a helpful assistant for managing personal health records. You are friendly, professional, and you MUST NOT provide medical advice. You can only answer questions based on the data provided. Always end your responses with a disclaimer: "This is not medical advice. Please consult a healthcare professional for any medical concerns."

User Data:
- Name: ${user.name}
- Date of Birth: ${user.dateOfBirth}
- Blood Type: ${user.bloodType}
- Allergies: ${allergies}
- Chronic Conditions: ${conditions}
- Medications: ${medications}
- Health Records on file:
${recordList}`;

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: systemInstruction,
          },
        });
         setMessages([{
            sender: 'ai',
            text: "Hello! I'm your AI Health Assistant. I can help you understand your medical records. How can I assist you today?"
         }]);
      } catch (error) {
        console.error("Failed to initialize Gemini Chat:", error);
        setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I couldn't connect to the AI service." }]);
      }
    }
  };

  // Re-initialize chat if user or records change, or on first load.
  useEffect(() => {
    initChat();
  }, [user, healthRecords]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (textToSend.trim() === '' || isLoading || !chatRef.current) return;

    const userMessage: Message = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage, { sender: 'ai', text: '' }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: textToSend });
      for await (const chunk of stream) {
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          const updatedText = lastMessage.text + chunk.text;
          return [...prev.slice(0, -1), { ...lastMessage, text: updatedText }];
        });
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: Message = { sender: 'ai', text: "I'm sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleComplianceCheck = () => {
    const compliancePrompt = "Analyze my provided health data summary and check for potential GDPR compliance issues a user should be aware of. For example, mention sensitive data categories and the importance of explicit consent for sharing.";
    handleSendMessage(compliancePrompt);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-blue-600" />
          AI Assistant
        </h2>
        <p className="text-[var(--text-secondary)] mt-1">Ask questions about your health records</p>
      </div>

      <div className="bg-[var(--card-background)] rounded-xl border border-[var(--border-color)] flex flex-col h-[70vh] shadow-xl">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-[var(--primary-foreground)]" />
                </div>
              )}
              <div className={`max-w-xl p-4 rounded-xl shadow-sm ${msg.sender === 'user' ? 'bg-[var(--primary)] text-[var(--primary-foreground)] rounded-br-none' : 'bg-[var(--muted-background)] text-[var(--text-primary)] rounded-bl-none'}`}>
                 <p className="text-sm whitespace-pre-wrap">{msg.text}{isLoading && msg.sender === 'ai' && index === messages.length - 1 && <span className="inline-block w-2 h-4 bg-[var(--text-primary)] ml-1 animate-pulse"></span>}</p>
              </div>
              {msg.sender === 'user' && (
                <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
          ))}
          {messages.length === 1 && !isLoading && (
            <div className="pt-4">
              <h4 className="text-sm font-semibold text-center text-[var(--text-secondary)] mb-3">Or try one of these suggestions:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="w-full text-left text-sm p-3 bg-[var(--muted-background)] hover:bg-[var(--border-color)] rounded-lg transition-colors text-[var(--text-secondary)]"
                  >
                    {prompt}
                  </button>
                ))}
                 <button
                    onClick={handleComplianceCheck}
                    className="w-full text-left text-sm p-3 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg transition-colors text-yellow-700 dark:text-yellow-400 col-span-1 sm:col-span-2"
                  >
                    Run Compliance Check (GDPR)
                  </button>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--card-background)] rounded-b-xl">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your medications, allergies, records..."
              className="w-full pl-4 pr-12 py-3 border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-shadow bg-[var(--background)] text-[var(--text-primary)]"
              disabled={isLoading || messages.length === 0}
              aria-label="Ask the AI assistant a question"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || inputValue.trim() === '' || messages.length === 0}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;