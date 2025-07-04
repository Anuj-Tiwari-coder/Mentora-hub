import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Clock, Heart, Calendar, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Reminder {
  id: string;
  title: string;
  type: 'mood' | 'breathing' | 'journal' | 'meditation' | 'custom';
  time: string;
  frequency: 'daily' | 'weekly' | 'weekdays' | 'weekends';
  isActive: boolean;
  lastTriggered?: Date;
  message: string;
}

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    type: 'mood' as const,
    time: '09:00',
    frequency: 'daily' as const,
    message: ''
  });

  const reminderTypes = [
    { value: 'mood', label: 'Mood Check-in', icon: Heart, color: 'therapeutic-blue' },
    { value: 'breathing', label: 'Breathing Exercise', icon: Clock, color: 'therapeutic-green' },
    { value: 'journal', label: 'Journal Entry', icon: Calendar, color: 'therapeutic-orange' },
    { value: 'meditation', label: 'Meditation Time', icon: Bell, color: 'therapeutic-purple' },
    { value: 'custom', label: 'Custom Reminder', icon: Bell, color: 'therapeutic-pink' }
  ];

  const defaultMessages = {
    mood: "Time for your daily mood check-in! How are you feeling today? 💙",
    breathing: "Take a moment to breathe. A quick breathing exercise can help center your mind 🌸",
    journal: "Your thoughts matter. Take a few minutes to write in your journal 📝",
    meditation: "Time to find your inner peace. A few minutes of meditation awaits 🧘‍♀️",
    custom: "Gentle reminder to take care of yourself today ✨"
  };

  useEffect(() => {
    // Load reminders from localStorage
    const savedReminders = localStorage.getItem('wellnessReminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders).map((r: any) => ({
        ...r,
        lastTriggered: r.lastTriggered ? new Date(r.lastTriggered) : undefined
      })));
    }

    // Check notification permission
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }

    // Set up default reminders if none exist
    const hasDefaultReminders = localStorage.getItem('hasDefaultReminders');
    if (!hasDefaultReminders) {
      const defaultReminders: Reminder[] = [
        {
          id: '1',
          title: 'Morning Mood Check',
          type: 'mood',
          time: '09:00',
          frequency: 'daily',
          isActive: true,
          message: defaultMessages.mood
        },
        {
          id: '2',
          title: 'Evening Reflection',
          type: 'journal',
          time: '20:00',
          frequency: 'daily',
          isActive: true,
          message: defaultMessages.journal
        }
      ];
      setReminders(defaultReminders);
      localStorage.setItem('wellnessReminders', JSON.stringify(defaultReminders));
      localStorage.setItem('hasDefaultReminders', 'true');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
      if (permission === "granted") {
        toast("Notifications enabled! We'll remind you to take care of yourself 💙");
      } else {
        toast("Notifications disabled. You can still use reminders without notifications.");
      }
    }
  };

  const scheduleNotification = (reminder: Reminder) => {
    if (!notificationsEnabled) return;

    const now = new Date();
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      if (notificationsEnabled && reminder.isActive) {
        new Notification(reminder.title, {
          body: reminder.message,
          icon: '/favicon.ico',
          tag: reminder.id
        });
      }
    }, timeUntilNotification);
  };

  const createReminder = () => {
    if (!newReminder.title.trim()) {
      toast("Please enter a title for your reminder");
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      ...newReminder,
      isActive: true,
      message: newReminder.message || defaultMessages[newReminder.type]
    };

    const updatedReminders = [...reminders, reminder];
    setReminders(updatedReminders);
    localStorage.setItem('wellnessReminders', JSON.stringify(updatedReminders));

    if (notificationsEnabled) {
      scheduleNotification(reminder);
    }

    setNewReminder({
      title: '',
      type: 'mood',
      time: '09:00',
      frequency: 'daily',
      message: ''
    });
    setIsCreating(false);
    toast("Reminder created successfully! 🌟");
  };

  const toggleReminder = (id: string) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === id ? { ...reminder, isActive: !reminder.isActive } : reminder
    );
    setReminders(updatedReminders);
    localStorage.setItem('wellnessReminders', JSON.stringify(updatedReminders));
    toast("Reminder updated!");
  };

  const deleteReminder = (id: string) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
    localStorage.setItem('wellnessReminders', JSON.stringify(updatedReminders));
    toast("Reminder deleted");
  };

  const triggerReminder = (reminder: Reminder) => {
    // Update last triggered time
    const updatedReminders = reminders.map(r =>
      r.id === reminder.id ? { ...r, lastTriggered: new Date() } : r
    );
    setReminders(updatedReminders);
    localStorage.setItem('wellnessReminders', JSON.stringify(updatedReminders));

    // Navigate based on reminder type
    switch (reminder.type) {
      case 'mood':
        window.location.href = '/mood';
        break;
      case 'breathing':
        window.location.href = '/breathing';
        break;
      case 'journal':
        window.location.href = '/journal';
        break;
      default:
        toast(reminder.message);
    }
  };

  const getReminderTypeInfo = (type: string) => {
    return reminderTypes.find(t => t.value === type) || reminderTypes[0];
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-therapeutic-pink rounded-full flex items-center justify-center">
            <Bell className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-poppins font-bold mb-2 gradient-text">Smart Reminders</h1>
          <p className="text-lg text-muted-foreground">Gentle nudges for your wellness journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings */}
          <div className="lg:col-span-1">
            <Card className="card-therapeutic p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Browser Notifications</label>
                    <p className="text-xs text-muted-foreground">Get notified even when the app is closed</p>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        requestNotificationPermission();
                      } else {
                        setNotificationsEnabled(false);
                      }
                    }}
                  />
                </div>

                <Button 
                  onClick={() => setIsCreating(true)}
                  className="btn-therapeutic w-full"
                  disabled={isCreating}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Reminder
                </Button>

                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/mood'}
                    >
                      <Heart className="h-4 w-4 mr-2 text-therapeutic-blue" />
                      Check Mood Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => window.location.href = '/breathing'}
                    >
                      <Clock className="h-4 w-4 mr-2 text-therapeutic-green" />
                      Start Breathing
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Reminders List */}
          <div className="lg:col-span-2">
            {isCreating ? (
              <Card className="card-therapeutic p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Create Reminder</h3>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>

                <div className="space-y-4">
                  <Input
                    placeholder="Reminder title..."
                    value={newReminder.title}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Type</label>
                      <Select
                        value={newReminder.type}
                        onValueChange={(value: any) => setNewReminder(prev => ({ 
                          ...prev, 
                          type: value,
                          message: defaultMessages[value as keyof typeof defaultMessages]
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {reminderTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Time</label>
                      <Input
                        type="time"
                        value={newReminder.time}
                        onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Frequency</label>
                    <Select
                      value={newReminder.frequency}
                      onValueChange={(value: any) => setNewReminder(prev => ({ ...prev, frequency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekdays">Weekdays</SelectItem>
                        <SelectItem value="weekends">Weekends</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Custom Message (optional)</label>
                    <Input
                      placeholder={defaultMessages[newReminder.type]}
                      value={newReminder.message}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>

                  <Button onClick={createReminder} className="btn-therapeutic w-full">
                    Create Reminder
                  </Button>
                </div>
              </Card>
            ) : null}

            <Card className="card-therapeutic p-6">
              <h3 className="text-lg font-semibold mb-4">Your Reminders</h3>

              {reminders.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No reminders yet. Create your first one!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reminders.map(reminder => {
                    const typeInfo = getReminderTypeInfo(reminder.type);
                    const Icon = typeInfo.icon;
                    
                    return (
                      <div
                        key={reminder.id}
                        className={`p-4 rounded-lg border transition-all ${
                          reminder.isActive 
                            ? 'border-primary bg-primary-soft' 
                            : 'border-border bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <Icon className={`h-5 w-5 text-${typeInfo.color}`} />
                            <div className="flex-1">
                              <h4 className="font-medium">{reminder.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{reminder.time}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {reminder.frequency}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => triggerReminder(reminder)}
                              className="text-primary"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Switch
                              checked={reminder.isActive}
                              onCheckedChange={() => toggleReminder(reminder.id)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteReminder(reminder.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-2 ml-8">
                          {reminder.message}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reminders;