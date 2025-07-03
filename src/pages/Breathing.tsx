import Layout from "@/components/Layout";
import { Timer } from "lucide-react";

const Breathing = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-therapeutic-green rounded-full flex items-center justify-center">
            <Timer className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-poppins font-bold mb-4 gradient-text">Breathing Exercises</h1>
          <p className="text-lg text-muted-foreground mb-8">Coming soon - Guided breathing & meditation</p>
        </div>
      </div>
    </Layout>
  );
};

export default Breathing;