import Layout from "@/components/Layout";
import { Bell } from "lucide-react";

const Reminders = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-therapeutic-pink rounded-full flex items-center justify-center">
            <Bell className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-poppins font-bold mb-4 gradient-text">Smart Reminders</h1>
          <p className="text-lg text-muted-foreground mb-8">Coming soon - Wellness notifications & reminders</p>
        </div>
      </div>
    </Layout>
  );
};

export default Reminders;