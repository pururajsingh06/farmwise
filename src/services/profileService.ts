
import { supabase } from "@/integrations/supabase/client";

export interface FarmProfile {
  id?: string;
  user_id: string;
  farm_location: string;
  land_area: number;
  area_unit: string;
  soil_type: string;
  crops?: string[];
  created_at?: string;
}

export const createFarmProfile = async (profile: FarmProfile) => {
  const { data, error } = await supabase
    .from('farm_profiles')
    .insert([profile])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getFarmProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('farm_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const updateFarmProfile = async (profile: Partial<FarmProfile>) => {
  const { data, error } = await supabase
    .from('farm_profiles')
    .update(profile)
    .eq('user_id', profile.user_id!)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
