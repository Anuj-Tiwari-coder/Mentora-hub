import { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, TrendingUp, Heart, Smile, Meh, Frown, AlertTriangle } from "lucide-react";

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);

  const moods = [
    { id: "excellent", label: "Excellent", icon: Heart, color: "mood-excellent", emoji: "😊" },
    { id: "good", label: "Good", icon: Smile, color: "mood-good", emoji: "🙂" },
    { id: "okay", label: "Okay", icon: Meh, color: "mood-okay", emoji: "😐" },
    { id: "poor", label: "Poor", icon: Frown, color: "mood-poor", emoji: "🙁" },
    { id: "terrible", label: "Terrible", icon: AlertTriangle, color: "mood-terrible", emoji: "😢" }
  ];

  const getRecommendation = (moodId: string) => {
    const recommendations = {
      excellent: {
        title: "You're shining bright! ✨",
        message: "Your positive energy is wonderful. Consider sharing this joy with others or engaging in activities that bring you fulfillment.",
        activities: ["Share gratitude with someone", "Try a new hobby", "Help someone in need"]
      },
      good: {
        title: "Keep up the positive momentum! 🌟",
        message: "You're doing well. This is a great time to focus on maintaining your mental wellness.",
        activities: ["Practice gratitude journaling", "Take a mindful walk", "Connect with friends"]
      },
      okay: {
        title: "It's okay to feel neutral 🌤️",
        message: "Neutral feelings are normal. Consider small activities that might boost your mood gently.",
        activities: ["Light breathing exercises", "Listen to uplifting music", "Do something creative"]
      },
      poor: {
        title: "I understand you're struggling 🤗",
        message: "It's brave of you to check in. Small steps toward self-care can help. You're not alone.",
        activities: ["Deep breathing exercises", "Reach out to a friend", "Practice self-compassion"]
      },
      terrible: {
        title: "I'm here for you 💙",
        message: "Your feelings are valid. Please consider reaching out for support. You deserve care and understanding.",
        activities: ["Contact a mental health professional", "Call a support helpline", "Practice grounding techniques"],
        helpline: "Indian Mental Health Helpline: 9152987821"
      }
    };
    return recommendations[moodId as keyof typeof recommendations];
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setShowRecommendation(true);
  };

  const mockMoodHistory = [
    { date: "Today", mood: "good", score: 4 },
    { date: "Yesterday", mood: "okay", score: 3 },
    { date: "2 days ago", mood: "excellent", score: 5 },
    { date: "3 days ago", mood: "good", score: 4 },
    { date: "4 days ago", mood: "poor", score: 2 }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-poppins font-bold mb-4 gradient-text">
            How are you feeling today?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a moment to check in with yourself. Your emotions matter, and tracking them helps us provide better support.
          </p>
        </div>

        {/* Mood Selection */}
        {!showRecommendation && (
          <Card className="card-therapeutic mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">Choose your current mood</h2>
              <p className="text-muted-foreground">Select the option that best describes how you're feeling right now</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {moods.map((mood) => {
                const Icon = mood.icon;
                return (
                  <div
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.id)}
                    className={`
                      card-mood p-6 text-center group hover:scale-105 transition-all duration-300
                      ${selectedMood === mood.id ? 'ring-2 ring-primary shadow-glow' : ''}
                    `}
                  >
                    <div className="text-4xl mb-2">{mood.emoji}</div>
                    <Icon className={`h-8 w-8 mx-auto mb-3 text-${mood.color}`} />
                    <h3 className="font-semibold text-foreground">{mood.label}</h3>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* AI Recommendation */}
        {showRecommendation && selectedMood && (
          <Card className="card-therapeutic mb-8 bg-gradient-to-br from-primary-soft to-accent-soft">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                {getRecommendation(selectedMood).title}
              </h2>
              <p className="text-muted-foreground text-lg">
                {getRecommendation(selectedMood).message}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recommended activities:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getRecommendation(selectedMood).activities.map((activity, index) => (
                  <div key={index} className="bg-card rounded-xl p-4 shadow-soft">
                    <p className="text-sm font-medium">{activity}</p>
                  </div>
                ))}
              </div>

              {selectedMood === 'terrible' && (
                <div className="bg-therapeutic-orange/10 border border-therapeutic-orange/20 rounded-xl p-4 mt-6">
                  <p className="text-therapeutic-orange font-medium">
                    Indian Mental Health Helpline: 9152987821
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-6 space-x-4">
              <Button 
                onClick={() => setShowRecommendation(false)}
                variant="outline"
              >
                Track Another Mood
              </Button>
              <Button className="btn-therapeutic">
                Save & Continue
              </Button>
            </div>
          </Card>
        )}

        {/* Mood History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="card-therapeutic">
            <div className="flex items-center space-x-2 mb-6">
              <Calendar className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Recent Mood History</h3>
            </div>
            
            <div className="space-y-4">
              {mockMoodHistory.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div>
                    <p className="font-medium">{entry.date}</p>
                    <p className="text-sm text-muted-foreground capitalize">{entry.mood}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={entry.score * 20} className="w-16" />
                    <span className="text-sm font-medium">{entry.score}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="card-therapeutic">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-6 w-6 text-therapeutic-green" />
              <h3 className="text-xl font-semibold">Weekly Insights</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-therapeutic-green/10 rounded-xl p-4">
                <h4 className="font-semibold text-therapeutic-green mb-2">Average Mood Score</h4>
                <p className="text-2xl font-bold text-therapeutic-green">3.6/5</p>
                <p className="text-sm text-muted-foreground">↑ 0.4 from last week</p>
              </div>
              
              <div className="bg-therapeutic-blue/10 rounded-xl p-4">
                <h4 className="font-semibold text-therapeutic-blue mb-2">Most Common Mood</h4>
                <p className="text-lg font-medium">Good 😊</p>
                <p className="text-sm text-muted-foreground">4 out of 7 days</p>
              </div>

              <div className="bg-therapeutic-purple/10 rounded-xl p-4">
                <h4 className="font-semibold text-therapeutic-purple mb-2">Suggestion</h4>
                <p className="text-sm">You're doing great! Consider maintaining your current self-care routine.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MoodTracker;