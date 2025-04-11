
import { supabase } from "@/integrations/supabase/client";

export interface FarmingTask {
  id?: string;
  user_id: string;
  title: string;
  date: string;
  task_type: string;
  notes?: string;
  is_completed?: boolean;
  created_at?: string;
}

export const createTask = async (task: FarmingTask) => {
  const { data, error } = await supabase
    .from('farming_tasks')
    .insert([task])
    .select()
    .single();
  
  if (error) throw error;
  return data as FarmingTask;
};

export const getUserTasks = async (userId: string) => {
  const { data, error } = await supabase
    .from('farming_tasks')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });
  
  if (error) throw error;
  return data as FarmingTask[];
};

export const updateTaskCompletion = async (taskId: string, isCompleted: boolean) => {
  const { data, error } = await supabase
    .from('farming_tasks')
    .update({ is_completed: isCompleted })
    .eq('id', taskId)
    .select()
    .single();
  
  if (error) throw error;
  return data as FarmingTask;
};

export const deleteTask = async (taskId: string) => {
  const { error } = await supabase
    .from('farming_tasks')
    .delete()
    .eq('id', taskId);
  
  if (error) throw error;
  return true;
};
