
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getFarmProfile, updateFarmProfile, FarmProfile } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";
import FarmLayout from "@/components/FarmLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [farmLocation, setFarmLocation] = useState("");
  const [landArea, setLandArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("acres");
  const [soilType, setSoilType] = useState("");
  const [crops, setCrops] = useState<string[]>([]);
  const [profile, setProfile] = useState<FarmProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const profileData = await getFarmProfile(user.id);
        if (profileData) {
          setProfile(profileData);
          setFarmLocation(profileData.farm_location);
          setLandArea(profileData.land_area.toString());
          setAreaUnit(profileData.area_unit);
          setSoilType(profileData.soil_type);
          setCrops(profileData.crops || []);
        }
      } catch (error: any) {
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, toast]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    if (!farmLocation || !landArea || !soilType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      await updateFarmProfile({
        user_id: user.id,
        farm_location: farmLocation,
        land_area: Number(landArea),
        area_unit: areaUnit,
        soil_type: soilType,
        crops: crops.length > 0 ? crops : undefined
      });
      
      toast({
        title: "Profile Updated",
        description: "Your farm profile has been updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <FarmLayout>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input readOnly value={user?.email || ""} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Farm Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading profile information...</div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="farm-location">Farm Location</Label>
                  <Input
                    id="farm-location"
                    value={farmLocation}
                    onChange={(e) => setFarmLocation(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="land-area">Land Area</Label>
                    <Input
                      id="land-area"
                      type="number"
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area-unit">Unit</Label>
                    <Select value={areaUnit} onValueChange={setAreaUnit}>
                      <SelectTrigger id="area-unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acres">Acres</SelectItem>
                        <SelectItem value="hectares">Hectares</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soil-type">Primary Soil Type</Label>
                  <Select value={soilType} onValueChange={setSoilType}>
                    <SelectTrigger id="soil-type">
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clay">Clay</SelectItem>
                      <SelectItem value="sandy">Sandy</SelectItem>
                      <SelectItem value="loamy">Loamy</SelectItem>
                      <SelectItem value="silty">Silty</SelectItem>
                      <SelectItem value="peaty">Peaty</SelectItem>
                      <SelectItem value="chalky">Chalky</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Current Crops</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Corn", "Wheat", "Soybeans", "Rice", "Barley"].map((crop) => (
                      <Button
                        key={crop}
                        type="button"
                        variant={crops.includes(crop) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (crops.includes(crop)) {
                            setCrops(crops.filter((c) => c !== crop));
                          } else {
                            setCrops([...crops, crop]);
                          }
                        }}
                      >
                        {crop}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </FarmLayout>
  );
};

export default ProfilePage;
