import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, Timer, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-wellness.jpg";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const features = [
    {
      icon: Heart,
      title: "Daily Mood Tracking",
      description: "Track your emotional journey with AI-powered insights",
      color: "therapeutic-blue"
    },
    {
      icon: MessageCircle,
      title: "AI Companion",
      description: "Get empathetic support and personalized recommendations",
      color: "therapeutic-purple"
    },
    {
      icon: Timer,
      title: "Breathing Exercises",
      description: "Guided meditation and mindfulness practices",
      color: "therapeutic-green"
    },
    {
      icon: Calendar,
      title: "Anonymous Journal",
      description: "Express yourself freely in a safe, private space",
      color: "therapeutic-orange"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-5"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      
      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-therapeutic-blue/20 rounded-full blur-xl float"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-therapeutic-purple/20 rounded-full blur-xl float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-therapeutic-green/20 rounded-full blur-xl float" style={{ animationDelay: '2s' }}></div>

          <div className="inline-block mb-6">
            <div className="flex items-center space-x-2 bg-primary-soft/50 px-4 py-2 rounded-full border border-primary/20">
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">Mental Health Campaign</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6 leading-tight">
            <span className="gradient-text">Mentora</span>
            <br />
            <span className="text-foreground">Your Wellness Journey</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            A compassionate platform that guides you through daily mood tracking, 
            AI-powered support, mindfulness exercises, and personal growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="btn-therapeutic text-lg px-8 py-4 h-auto"
            >
              Start Your Journey
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 h-auto border-2 border-primary hover:bg-primary-soft"
            >
              Learn More
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full pulse-gentle"></div>
              <span>100% Anonymous</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full pulse-gentle"></div>
              <span>AI-Powered Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full pulse-gentle"></div>
              <span>24/7 Available</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title}
                className="card-therapeutic group hover:scale-105 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-${feature.color}/10 flex items-center justify-center group-hover:shadow-glow transition-all duration-300`}>
                    <Icon className={`h-8 w-8 text-${feature.color}`} />
                  </div>
                  <h3 className="text-heading text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-body text-sm">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Call to Action Section */}
        <div className="mt-20 text-center">
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-8 md:p-12 shadow-medium">
            <h2 className="text-3xl md:text-4xl font-poppins font-semibold mb-4 gradient-text">
              Take the First Step Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your mental health journey starts with understanding your emotions. 
              Begin with a simple mood check-in and discover personalized insights.
            </p>
            <Button 
              size="lg" 
              className="btn-therapeutic text-lg px-12 py-4 h-auto"
            > <Link to="/mood">
                  Check Your Mood Now
               </Link>
           </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
