
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

interface FarmHeaderProps {
  showUserMenu?: boolean;
}

const FarmHeader = ({ showUserMenu = true }: FarmHeaderProps) => {
  return (
    <header className="h-14 border-b flex items-center px-6 justify-between bg-white">
      <Link to="/" className="text-xl font-bold text-farm-green-dark flex items-center gap-2">
        <span className="bg-farm-green text-white p-1 rounded">
          <Wheat size={18} />
        </span>
        SMART FARM ADVISOR
      </Link>
      
      {showUserMenu && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <User size={20} />
              <span>User</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Farm Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/" className="w-full">Log Out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};

export default FarmHeader;

import { Wheat } from "lucide-react";
