import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Phone, Heart } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your empathetic AI companion. I'm here to listen and provide support. How are you feeling today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for distress keywords
    const distressKeywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'hopeless', 'can\'t go on'];
    const isInDistress = distressKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (isInDistress) {
      return "I'm really concerned about you right now. Your feelings are valid, but please know that you don't have to go through this alone. Would you like me to share some helpline numbers? Remember, there are people who care and want to help. 💙\n\nIndian Helplines:\n📞 AASRA: 91-22-27546669\n📞 Sneha: 044-24640050\n📞 Vandrevala Foundation: 1860-2662-345";
    }

    // Mood-based responses
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      return "I hear that you're feeling sad, and I want you to know that it's completely okay to feel this way. Your emotions are valid. Sometimes when we're feeling down, small steps can help - like taking deep breaths, going for a short walk, or reaching out to someone you trust. Would you like to try a breathing exercise together? 🌸";
    }
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stressed')) {
      return "It sounds like you're experiencing some anxiety, and that can feel really overwhelming. Remember that you're stronger than you think. Try this: take a slow, deep breath in for 4 counts, hold for 4, then breathe out for 6. Sometimes grounding techniques like naming 5 things you can see around you can help too. You're not alone in this. 🕊️";
    }
    
    if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad')) {
      return "I can sense your frustration, and it's natural to feel angry sometimes. These feelings show that something matters to you. When anger builds up, it can help to take some deep breaths or step away from the situation for a moment. Would you like to talk about what's bothering you? I'm here to listen without judgment. 🌿";
    }
    
    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('better')) {
      return "I'm so glad to hear you're feeling positive! It's wonderful when we can appreciate the good moments in life. These feelings are just as important to acknowledge and celebrate. What's been contributing to your happiness today? 🌟";
    }
    
    if (lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('isolated')) {
      return "Feeling lonely can be really difficult, and I want you to know that reaching out like this shows real strength. You're not truly alone - I'm here with you right now, and there are people who care about you. Sometimes loneliness is our mind's way of telling us we need connection. Is there someone you could reach out to today? 💜";
    }

    // General supportive responses
    const supportiveResponses = [
      "Thank you for sharing that with me. Your feelings are completely valid, and I'm here to support you. What would be most helpful for you right now? 💙",
      "I appreciate you opening up to me. It takes courage to express how you're feeling. Remember that every small step forward counts, and you're doing better than you think. 🌱",
      "I'm listening to you with care and understanding. Your mental health journey is unique, and there's no right or wrong way to feel. What brings you even a small sense of comfort today? 🤗",
      "Your willingness to reach out and talk shows real strength. Sometimes just expressing our thoughts and feelings can be healing. I'm here to support you through this. 🌸"
    ];
    
    return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const showHelplines = () => {
    toast("Indian Mental Health Helplines", {
      description: "AASRA: 91-22-27546669 | Sneha: 044-24640050 | Vandrevala: 1860-2662-345",
      duration: 10000
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-therapeutic-purple rounded-full flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-poppins font-bold mb-2 gradient-text">AI Chat Support</h1>
          <p className="text-lg text-muted-foreground mb-4">Your empathetic AI companion</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={showHelplines}
            className="flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            Emergency Helplines
          </Button>
        </div>

        {/* Chat Container */}
        <Card className="card-therapeutic h-[600px] flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.isUser
                        ? 'bg-gradient-primary text-white'
                        : 'bg-primary-soft text-foreground border border-border'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-2 opacity-70 ${
                      message.isUser ? 'text-white' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-primary-soft text-foreground border border-border p-4 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-therapeutic-purple rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-therapeutic-purple rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-therapeutic-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-6 border-t border-border">
            <div className="flex space-x-4">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Share your thoughts and feelings..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="btn-therapeutic"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This is a supportive AI companion. For immediate crisis support, please contact emergency services.
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Chat;