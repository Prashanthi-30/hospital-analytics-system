import { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';
import api from '../lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I am HealthSense AI. I can help you analyze hospital data, predict attendance trends, and monitor doctor workload. How can I assist you today?',
    timestamp: new Date(),
  }
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue;
    
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await api.post('/chatbot', userMessage, {
        headers: { 'Content-Type': 'text/plain' }
      });
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error in chatbot:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error connecting to the hospital data brain. Please ensure the backend is running.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuery = (query: string) => {
    setInputValue(query);
    // Use timeout to allow state update if needed, or just call handleSend with query
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary-500" />
          AI Analytics Assistant
        </h1>
        <p className="text-slate-500 mt-1">Query hospital data and get predictive insights in natural language</p>
      </div>

      <Card className="flex-1 flex flex-col min-h-0 bg-white shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 py-4 bg-slate-50/50">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-700">
            <Bot className="w-5 h-5 text-primary-600" /> HealthSense Model v1.0
          </CardTitle>
          <CardDescription>Powered by your secure hospital dataset</CardDescription>
        </CardHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                msg.role === 'user' ? "bg-slate-200 text-slate-600" : "bg-primary-100 text-primary-700"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={cn(
                "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                msg.role === 'user' ? "bg-primary-600 text-white rounded-tr-sm" : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-sm"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl text-sm italic text-slate-400">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-3 relative"
          >
            <Input 
              placeholder="Ask about attendance trends, doctor workload..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="py-6 pl-4 pr-14 shadow-sm rounded-full bg-slate-50 border-slate-200 focus-visible:ring-primary-400"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-2 rounded-full w-10 h-10 shadow-md bg-primary-600 hover:bg-primary-700 transition-all"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </Button>
          </form>
          <div className="mt-3 flex justify-center gap-2">
            <Badge 
              className="cursor-pointer hover:bg-slate-200 transition-colors"
              onClick={() => quickQuery("What is the hospital attendance rate?")}
            >
              What is the hospital attendance rate?
            </Badge>
            <Badge 
              className="cursor-pointer hover:bg-slate-200 transition-colors"
              onClick={() => quickQuery("How many patients are registered?")}
            >
              How many patients are registered?
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
