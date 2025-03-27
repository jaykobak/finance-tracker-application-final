import React from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/40 transition-colors duration-300">
      <div className={cn(
        "container mx-auto px-4 py-8 max-w-5xl animate-fade-in",
        className
      )}>
        <header className="mb-8">
          {/* Mobile layout: stack elements vertically */}
          <div className="md:hidden flex flex-col gap-4">
            {/* App title and subtitle */}
            <div className="text-center">
              <h1 className="text-2xl font-light tracking-tight mb-2">
                <span className="font-medium">Finance</span>Tracker
              </h1>
              <p className="text-muted-foreground text-sm">
                Track your financial life with elegance and simplicity
              </p>
            </div>
            
            {/* User info and theme toggle in a row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User size={16} />
                  <span>{user?.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={logout} 
                  className="rounded-full"
                  aria-label="Logout"
                >
                  <LogOut className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
              <ThemeToggle />
            </div>
          </div>
          
          {/* Desktop layout: remains the same */}
          <div className="hidden md:flex justify-between items-center">
            {/* User information moved to the left */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <User size={16} />
                <span>{user?.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout} 
                className="rounded-full"
                aria-label="Logout"
              >
                <LogOut className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
            
            {/* Center title */}
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-light tracking-tight mb-2">
                <span className="font-medium">Finance</span>Tracker
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Track your financial life with elegance and simplicity
              </p>
            </div>
            
            {/* Theme toggle moved to the right */}
            <div>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-20 mb-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FinanceTracker. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}