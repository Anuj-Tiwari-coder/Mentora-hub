import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, Play, Pause, RotateCcw, History } from "lucide-react";
import { toast } from "sonner";

interface BreathingSession {
  id: string;
  duration: number;
  type: string;
  date: Date;
  completed: boolean;
}

const Breathing = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [totalTime, setTotalTime] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(5); // minutes
  const [breathingPattern, setBreathingPattern] = useState('4-7-8');
  const [sessions, setSessions] = useState<BreathingSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const patterns = {
    '4-7-8': { inhale: 4, hold: 7, exhale: 8, name: 'Relaxation (4-7-8)' },
    '4-4-4': { inhale: 4, hold: 4, exhale: 4, name: 'Box Breathing (4-4-4)' },
    '6-2-6': { inhale: 6, hold: 2, exhale: 6, name: 'Calm Focus (6-2-6)' }
  };

  const currentPattern = patterns[breathingPattern as keyof typeof patterns];

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = localStorage.getItem('breathingSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions).map((s: any) => ({
        ...s,
        date: new Date(s.date)
      })));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        setTotalTime(prev => prev + 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Move to next phase
      if (currentPhase === 'inhale') {
        setCurrentPhase('hold');
        setTimeLeft(currentPattern.hold);
      } else if (currentPhase === 'hold') {
        setCurrentPhase('exhale');
        setTimeLeft(currentPattern.exhale);
      } else {
        setCurrentPhase('inhale');
        setTimeLeft(currentPattern.inhale);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentPhase, currentPattern]);

  const startSession = () => {
    setIsActive(true);
    setTimeLeft(currentPattern.inhale);
    setCurrentPhase('inhale');
    setTotalTime(0);
    toast("Breathing session started. Follow the rhythm!");
  };

  const pauseSession = () => {
    setIsActive(!isActive);
  };

  const endSession = () => {
    const session: BreathingSession = {
      id: Date.now().toString(),
      duration: totalTime,
      type: currentPattern.name,
      date: new Date(),
      completed: totalTime >= selectedDuration * 60
    };

    const newSessions = [session, ...sessions].slice(0, 10); // Keep last 10 sessions
    setSessions(newSessions);
    localStorage.setItem('breathingSessions', JSON.stringify(newSessions));

    setIsActive(false);
    setTimeLeft(currentPattern.inhale);
    setCurrentPhase('inhale');
    setTotalTime(0);

    if (session.completed) {
      toast("Congratulations! Session completed successfully! 🌟");
    } else {
      toast("Session ended. Take care of yourself! 💙");
    }
  };

  const progress = ((selectedDuration * 60 - (selectedDuration * 60 - totalTime)) / (selectedDuration * 60)) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'therapeutic-blue';
      case 'hold': return 'therapeutic-purple';
      case 'exhale': return 'therapeutic-green';
      default: return 'therapeutic-blue';
    }
  };

  const getInstructions = () => {
    switch (currentPhase) {
      case 'inhale': return 'Breathe In...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
      default: return 'Get Ready...';
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-therapeutic-green rounded-full flex items-center justify-center">
            <Timer className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-poppins font-bold mb-2 gradient-text">Breathing Exercises</h1>
          <p className="text-lg text-muted-foreground">Guided breathing & meditation for inner peace</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Exercise */}
          <div className="lg:col-span-2">
            <Card className="card-therapeutic p-8 text-center">
              {/* Breathing Circle */}
              <div className="relative mb-8">
                <div 
                  className={`w-48 h-48 mx-auto rounded-full bg-${getPhaseColor()}/20 border-4 border-${getPhaseColor()} flex items-center justify-center transition-all duration-1000 ${
                    isActive && currentPhase === 'inhale' ? 'scale-125' : 
                    isActive && currentPhase === 'exhale' ? 'scale-75' : 'scale-100'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl font-bold text-foreground mb-2">{timeLeft}</div>
                    <div className={`text-lg font-medium text-${getPhaseColor()}`}>
                      {getInstructions()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>{formatTime(totalTime)} / {selectedDuration}:00</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                {!isActive && totalTime === 0 ? (
                  <Button onClick={startSession} className="btn-therapeutic">
                    <Play className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                ) : (
                  <>
                    <Button onClick={pauseSession} variant="outline">
                      {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button onClick={endSession} variant="outline">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Settings & History */}
          <div className="space-y-6">
            {/* Settings */}
            <Card className="card-therapeutic p-6">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[3, 5, 10].map(duration => (
                      <Button
                        key={duration}
                        variant={selectedDuration === duration ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDuration(duration)}
                        disabled={isActive}
                      >
                        {duration}m
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Breathing Pattern</label>
                  <div className="space-y-2 mt-2">
                    {Object.entries(patterns).map(([key, pattern]) => (
                      <Button
                        key={key}
                        variant={breathingPattern === key ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setBreathingPattern(key)}
                        disabled={isActive}
                      >
                        {pattern.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick History */}
            <Card className="card-therapeutic p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Sessions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="h-4 w-4" />
                </Button>
              </div>

              {showHistory && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {sessions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No sessions yet</p>
                  ) : (
                    sessions.slice(0, 5).map(session => (
                      <div key={session.id} className="flex justify-between text-sm">
                        <span>{session.type}</span>
                        <span className={session.completed ? 'text-success' : 'text-muted-foreground'}>
                          {formatTime(session.duration)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Breathing;