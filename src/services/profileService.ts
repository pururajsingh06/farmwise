
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

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
  return data as FarmProfile;
};

export const getFarmProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('farm_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data as FarmProfile | null;
};

export const updateFarmProfile = async (profile: Partial<FarmProfile>) => {
  // Check if profile exists first
  const { data: existingProfile } = await supabase
    .from('farm_profiles')
    .select('id')
    .eq('user_id', profile.user_id!)
    .maybeSingle();
  
  // If profile exists, update it
  if (existingProfile) {
    const { data, error } = await supabase
      .from('farm_profiles')
      .update(profile)
      .eq('user_id', profile.user_id!)
      .select()
      .single();
    
    if (error) throw error;
    return data as FarmProfile;
  } 
  // If profile doesn't exist, create it
  else {
    return createFarmProfile({
      user_id: profile.user_id!,
      farm_location: profile.farm_location || '',
      land_area: profile.land_area || 0,
      area_unit: profile.area_unit || 'acres',
      soil_type: profile.soil_type || 'loamy',
      crops: profile.crops || []
    });
  }
};
