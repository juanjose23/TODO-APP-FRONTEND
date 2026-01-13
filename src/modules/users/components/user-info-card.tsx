"use client";

import { UserDto } from "@/modules/auth/dto/user.dto";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";

interface UserInfoCardProps {
  user: UserDto;
  className?: string;
}

export const UserInfoCard = ({ user, className }: UserInfoCardProps) => {
  const userName = user?.name || "User";
  const userEmail = user?.email || "";

  return (
    <Card className={cn("h-full border-none shadow-none bg-transparent flex flex-col items-center justify-center p-6", className)}>
      <CardHeader className="flex flex-col items-center justify-center space-y-4 pb-2 w-full">
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt blur"></div>
            <Avatar className="h-32 w-32 relative border-4 border-background shadow-xl">
            <AvatarImage src={user?.avatar} alt={userName} />
            <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                {userName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
            </Avatar>
        </div>
        <div className="text-center space-y-1 w-full">
          <h2 className="text-2xl font-bold tracking-tight truncate w-full px-4">{userName}</h2>
          <p className="text-sm text-muted-foreground truncate w-full px-4">{userEmail}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 pt-4 w-full">
         <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Active User
        </div>
      </CardContent>
    </Card>
  );
};
