import Layout from "@/components/Layout";
import { Calendar } from "lucide-react";

const Journal = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-therapeutic-orange rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-poppins font-bold mb-4 gradient-text">Anonymous Journal</h1>
          <p className="text-lg text-muted-foreground mb-8">Coming soon - Your private safe space</p>
        </div>
      </div>
    </Layout>
  );
};

export default Journal;