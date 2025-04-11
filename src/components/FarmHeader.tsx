
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
import { User, Wheat } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface FarmHeaderProps {
  showUserMenu?: boolean;
}

const FarmHeader = ({ showUserMenu = true }: FarmHeaderProps) => {
  const { user, signOut, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="h-14 border-b flex items-center px-6 justify-between bg-white">
      <Link to="/" className="text-xl font-bold text-farm-green-dark flex items-center gap-2">
        <span className="bg-farm-green text-white p-1 rounded">
          <Wheat size={18} />
        </span>
        FarmWise AI
      </Link>
      
      {showUserMenu && (
        isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <User size={20} />
                <span>{user?.email?.split('@')[0] || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="w-full">{t('profile')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="w-full">{t('settings')}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <span className="w-full">{t('logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm">{t('login')}</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">{t('signup')}</Button>
            </Link>
          </div>
        )
      )}
    </header>
  );
};

export default FarmHeader;
