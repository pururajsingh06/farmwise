
import { useState, useEffect } from "react";
import FarmLayout from "@/components/FarmLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, Sun, CloudRain } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getFarmProfile, FarmProfile } from "@/services/profileService";

const DashboardPage = () => {
  const { user } = useAuth();
  const [farmData, setFarmData] = useState<FarmProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFarmProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const profile = await getFarmProfile(user.id);
        setFarmData(profile);
      } catch (error) {
        console.error("Error loading farm profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFarmProfile();
  }, [user]);

  return (
    <FarmLayout>
      <h1 className="text-2xl font-bold mb-6">Welcome to your Farm Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">CURRENT WEATHER</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Sun size={48} className="mr-4 text-yellow-500" />
              <div>
                <div className="text-xl font-semibold">24°C</div>
                <div className="text-muted-foreground">Partly cloudy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">7-DAY FORECAST</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground">{day}</span>
                  {i === 2 || i === 3 ? (
                    <CloudRain size={20} className="my-2 text-farm-sky" />
                  ) : (
                    <Sun size={20} className="my-2 text-yellow-500" />
                  )}
                  <span className="text-xs font-medium">
                    {22 + Math.floor(Math.random() * 5)}°
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">ALERTS:</h2>
        <div className="alert-item">
          <AlertTriangle size={18} className="text-farm-alert" />
          <p>Light rainfall expected in 2 days</p>
        </div>
        <div className="alert-item">
          <AlertTriangle size={18} className="text-farm-alert" />
          <p>Optimal planting window for corn</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">YOUR FARM SUMMARY:</h2>
        <div className="bg-white p-4 rounded-lg border">
          {isLoading ? (
            <p>Loading farm data...</p>
          ) : !farmData ? (
            <div className="text-center py-4">
              <p className="mb-2">No farm profile found.</p>
              <Link to="/profile">
                <Button variant="outline">Create your farm profile</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Location</p>
                <p className="font-medium">{farmData.farm_location}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Land area</p>
                <p className="font-medium">{farmData.land_area} {farmData.area_unit}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Soil type</p>
                <p className="font-medium">{farmData.soil_type}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/crops">
          <Button size="lg">GET CROP RECOMMENDATIONS</Button>
        </Link>
      </div>
    </FarmLayout>
  );
};

export default DashboardPage;
