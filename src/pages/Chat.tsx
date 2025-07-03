import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const Chat = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-therapeutic-purple rounded-full flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-poppins font-bold mb-4 gradient-text">AI Chat Support</h1>
          <p className="text-lg text-muted-foreground mb-8">Coming soon - Your empathetic AI companion</p>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;