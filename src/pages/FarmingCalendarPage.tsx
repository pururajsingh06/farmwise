
import { useState, useEffect } from "react";
import { format } from "date-fns";
import FarmLayout from "@/components/FarmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CornIcon } from "@/components/CropIcons";
import { 
  CalendarDays, 
  Plus, 
  ArrowRight, 
  Check,
  Trash,
  CheckCircle2,
  CalendarIcon,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { FarmingTask, createTask, getUserTasks, updateTaskCompletion, deleteTask } from "@/services/calendarService";
import { cn } from "@/lib/utils";

const FarmingCalendarPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [taskTitle, setTaskTitle] = useState("");
  const [taskType, setTaskType] = useState("planting");
  const [taskNotes, setTaskNotes] = useState("");
  const [tasks, setTasks] = useState<FarmingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [highlightDates, setHighlightDates] = useState<Date[]>([]);
  
  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      if (user) {
        const userTasks = await getUserTasks(user.id);
        setTasks(userTasks);
        
        // Extract all task dates for highlighting on calendar
        const dates = userTasks.map(task => new Date(task.date));
        setHighlightDates(dates);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your farming tasks."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to add tasks to your calendar."
      });
      return;
    }
    
    if (!taskTitle || !selectedDate) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide a task title and date."
      });
      return;
    }

    setSubmitting(true);
    try {
      const newTask: FarmingTask = {
        user_id: user.id,
        title: taskTitle,
        date: selectedDate.toISOString().split('T')[0],
        task_type: taskType,
        notes: taskNotes,
        is_completed: false
      };
      
      await createTask(newTask);
      
      // Reset form
      setTaskTitle("");
      setTaskType("planting");
      setTaskNotes("");
      
      // Reload tasks
      await loadTasks();
      
      toast({
        title: "Task added",
        description: "Your farming task has been added to the calendar.",
      });
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add your task to the calendar."
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTaskCompletion = async (taskId: string, currentState: boolean) => {
    try {
      await updateTaskCompletion(taskId, !currentState);
      await loadTasks();
      
      toast({
        title: !currentState ? "Task completed" : "Task reopened",
        description: !currentState ? "Task marked as completed." : "Task marked as not completed.",
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task status."
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      await loadTasks();
      
      toast({
        title: "Task deleted",
        description: "Your task has been deleted from the calendar.",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the task."
      });
    }
  };

  const getTaskIcon = (taskType: string) => {
    switch(taskType) {
      case "planting":
        return <CornIcon />;
      case "harvesting":
        return <CheckCircle2 size={20} className="text-farm-green" />;
      default:
        return <CalendarDays size={20} className="text-farm-green" />;
    }
  };

  return (
    <FarmLayout>
      <h1 className="text-2xl font-bold mb-6">Farming Calendar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">CALENDAR</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border pointer-events-auto"
                modifiers={{
                  highlighted: highlightDates
                }}
                modifiersStyles={{
                  highlighted: { 
                    backgroundColor: "rgb(226, 232, 240)", 
                    borderRadius: "50%" 
                  }
                }}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">ADD TASK</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Task Title</label>
                  <Input 
                    type="text" 
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Enter task name" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Task Type</label>
                  <Select value={taskType} onValueChange={setTaskType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planting">Planting</SelectItem>
                      <SelectItem value="harvesting">Harvesting</SelectItem>
                      <SelectItem value="fertilizing">Fertilizing</SelectItem>
                      <SelectItem value="pest_control">Pest Control</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <Textarea 
                    value={taskNotes}
                    onChange={(e) => setTaskNotes(e.target.value)}
                    className="w-full p-2 border rounded" 
                    rows={3}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={16} className="mr-2" />
                      Add to Calendar
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">UPCOMING TASKS</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <p>Loading tasks...</p>
                </div>
              ) : tasks.length > 0 ? (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "flex items-center border rounded-lg p-3",
                        task.is_completed && "bg-gray-50"
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-farm-green-light flex items-center justify-center mr-3">
                        {getTaskIcon(task.task_type)}
                      </div>
                      <div className="flex-1">
                        <div className={cn(
                          "font-medium",
                          task.is_completed && "line-through text-gray-500"
                        )}>
                          {task.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(task.date), "PPP")}
                          {task.is_completed && " · Completed"}
                        </div>
                        {task.notes && (
                          <div className="text-xs text-muted-foreground mt-1 italic">
                            {task.notes}
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleTaskCompletion(task.id!, task.is_completed || false)}
                        className="mr-1"
                      >
                        <Check 
                          size={16} 
                          className={cn(
                            "text-muted-foreground",
                            task.is_completed && "text-green-500"
                          )} 
                        />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteTask(task.id!)}
                      >
                        <Trash size={16} className="text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium">No tasks yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new task.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">SEASONAL OVERVIEW</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium text-lg mb-2">Spring (Current Season)</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Complete corn planting by May 10</li>
                    <li>Initial fertilizer application</li>
                    <li>Set up irrigation systems</li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium text-lg mb-2">Summer</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Regular irrigation monitoring</li>
                    <li>Secondary fertilizer application mid-July</li>
                    <li>Pest monitoring and control as needed</li>
                  </ul>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium text-lg mb-2">Fall</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Harvest corn (expected: late September)</li>
                    <li>Soil testing and amendments</li>
                    <li>Plant cover crops</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FarmLayout>
  );
};

export default FarmingCalendarPage;
