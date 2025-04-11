
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FarmHeader from "@/components/FarmHeader";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createFarmProfile } from "@/services/profileService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [landArea, setLandArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("acres");
  const [soilType, setSoilType] = useState("");
  const [crops, setCrops] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password);
      setStep(2);
    } catch (error) {
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!farmLocation || !landArea || !soilType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You need to be logged in to complete your profile",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await createFarmProfile({
        user_id: user.id,
        farm_location: farmLocation,
        land_area: Number(landArea),
        area_unit: areaUnit,
        soil_type: soilType,
        crops: crops.length > 0 ? crops : undefined
      });
      
      toast({
        title: "Profile Complete",
        description: "Your farm profile has been created successfully!",
      });
      
      // Navigate to the dashboard
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FarmHeader showUserMenu={false} />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          {step === 1 ? (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
                <p className="text-gray-600">
                  Join Smart Farm Advisor for personalized farming recommendations
                </p>
              </div>
              
              <form className="space-y-6" onSubmit={handleSignUp}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "SIGNING UP..." : "CONTINUE"}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-farm-green hover:underline">
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">SMART FARM ADVISOR</h1>
                <p className="text-gray-600">
                  Tell us about your farm to get personalized advice
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="farm-location">Farm Location</Label>
                  <div className="relative">
                    <Input
                      id="farm-location"
                      placeholder="Enter your farm location"
                      value={farmLocation}
                      onChange={(e) => setFarmLocation(e.target.value)}
                      className="pl-10"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-500">
                      <MapPin size={18} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="land-area">Land Area</Label>
                    <Input
                      id="land-area"
                      placeholder="Enter size"
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
                  <Label>Current Crops (optional)</Label>
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

                <Button className="w-full" onClick={handleCompleteProfile} disabled={isLoading}>
                  {isLoading ? "COMPLETING PROFILE..." : "COMPLETE PROFILE"}
                </Button>

                <div className="text-center">
                  <Link to="/" className="text-sm text-farm-green hover:underline">
                    Back to welcome page
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
