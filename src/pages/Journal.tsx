import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Plus, BookOpen, Search, Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: Date;
  tags: string[];
}

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral',
    tags: [] as string[]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const moods = [
    { value: 'happy', label: '😊 Happy', color: 'therapeutic-green' },
    { value: 'sad', label: '😢 Sad', color: 'therapeutic-blue' },
    { value: 'anxious', label: '😰 Anxious', color: 'therapeutic-orange' },
    { value: 'angry', label: '😠 Angry', color: 'therapeutic-red' },
    { value: 'peaceful', label: '😌 Peaceful', color: 'therapeutic-purple' },
    { value: 'neutral', label: '😐 Neutral', color: 'gray-500' }
  ];

  const journalPrompts = [
    "What am I grateful for today?",
    "How do I feel right now and why?",
    "What challenged me today and how did I handle it?",
    "What brought me joy or comfort today?",
    "What would I like to let go of?",
    "What are three things I learned about myself today?"
  ];

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      })));
    }
  }, []);

  const saveEntry = () => {
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) {
      toast("Please add a title and content to your entry");
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      ...currentEntry,
      date: new Date()
    };

    const newEntries = [newEntry, ...entries];
    setEntries(newEntries);
    localStorage.setItem('journalEntries', JSON.stringify(newEntries));

    setCurrentEntry({ title: '', content: '', mood: 'neutral', tags: [] });
    setIsWriting(false);
    toast("Your thoughts have been saved safely 💙");
  };

  const deleteEntry = (id: string) => {
    const newEntries = entries.filter(entry => entry.id !== id);
    setEntries(newEntries);
    localStorage.setItem('journalEntries', JSON.stringify(newEntries));
    setSelectedEntry(null);
    toast("Entry deleted");
  };

  const addTag = (tag: string) => {
    if (tag && !currentEntry.tags.includes(tag)) {
      setCurrentEntry(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getMoodColor = (mood: string) => {
    return moods.find(m => m.value === mood)?.color || 'gray-500';
  };

  const getMoodLabel = (mood: string) => {
    return moods.find(m => m.value === mood)?.label || '😐 Neutral';
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-therapeutic-orange rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-poppins font-bold mb-2 gradient-text">Anonymous Journal</h1>
          <p className="text-lg text-muted-foreground">Your private safe space for thoughts and feelings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Entry List */}
          <div className="lg:col-span-1">
            <Card className="card-therapeutic p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Your Entries</h3>
                <Button 
                  onClick={() => setIsWriting(true)}
                  className="btn-therapeutic"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Entries List */}
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {filteredEntries.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        {searchTerm ? 'No entries found' : 'Start your first entry'}
                      </p>
                    </div>
                  ) : (
                    filteredEntries.map(entry => (
                      <div
                        key={entry.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedEntry?.id === entry.id 
                            ? 'border-primary bg-primary-soft' 
                            : 'border-border hover:bg-primary-soft'
                        }`}
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium truncate flex-1 mr-2">{entry.title}</h4>
                          <div className={`w-3 h-3 rounded-full bg-${getMoodColor(entry.mood)}`}></div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {entry.content}
                        </p>
                        <div className="text-xs text-muted-foreground mt-2">
                          {entry.date.toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {isWriting ? (
              <Card className="card-therapeutic p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">New Entry</h3>
                  <Button variant="outline" onClick={() => setIsWriting(false)}>
                    Cancel
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <Input
                    placeholder="Give your entry a title..."
                    value={currentEntry.title}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                  />

                  {/* Mood */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">How are you feeling?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {moods.map(mood => (
                        <Button
                          key={mood.value}
                          variant={currentEntry.mood === mood.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentEntry(prev => ({ ...prev, mood: mood.value }))}
                          className="justify-start"
                        >
                          {mood.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <Textarea
                    placeholder="What's on your mind? Express yourself freely..."
                    value={currentEntry.content}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[300px] resize-none"
                  />

                  {/* Tags */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags (press Enter to add)</label>
                    <Input
                      placeholder="Add tags to categorize your entry..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    {currentEntry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentEntry.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Journal Prompts */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Need inspiration?</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {journalPrompts.slice(0, 4).map(prompt => (
                        <Button
                          key={prompt}
                          variant="ghost"
                          size="sm"
                          className="text-left justify-start h-auto py-2 text-xs"
                          onClick={() => setCurrentEntry(prev => ({ 
                            ...prev, 
                            content: prev.content ? `${prev.content}\n\n${prompt}\n` : `${prompt}\n`
                          }))}
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={saveEntry} className="btn-therapeutic w-full">
                    <Heart className="h-4 w-4 mr-2" />
                    Save Entry
                  </Button>
                </div>
              </Card>
            ) : selectedEntry ? (
              <Card className="card-therapeutic p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-${getMoodColor(selectedEntry.mood)}`}></div>
                    <h3 className="text-lg font-semibold">{selectedEntry.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedEntry(null)}>
                      Back
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteEntry(selectedEntry.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{selectedEntry.date.toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{getMoodLabel(selectedEntry.mood)}</span>
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{selectedEntry.content}</p>
                  </div>

                  {selectedEntry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="card-therapeutic p-8 text-center">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Welcome to Your Safe Space</h3>
                <p className="text-muted-foreground mb-6">
                  This is your private journal where you can express your thoughts and feelings freely. 
                  Everything stays on your device - completely anonymous and secure.
                </p>
                <Button onClick={() => setIsWriting(true)} className="btn-therapeutic">
                  <Plus className="h-4 w-4 mr-2" />
                  Start Writing
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Journal;