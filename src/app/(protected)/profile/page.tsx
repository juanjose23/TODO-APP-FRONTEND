import { UserInfoCard } from "@/modules/users/components/user-info-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { UserProfile } from "@/modules/users/components/user-profile";
import { ChangePassword } from "@/modules/users/components/change-password";
import { AuthService } from "@/modules/auth/services/auth.service";
import { UserService } from "@/modules/users/services/user.service";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

const ProfilePage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  let user = null;
  try {
    console.log("[ProfilePage] Token present:", !!token);
    if (token) {
        user = await AuthService.getCurrentUser(token);
        console.log("[ProfilePage] User fetch success:", user?.email);
    } else {
        console.log("[ProfilePage] No token found in cookies");
    }
  } catch (err: any) {
    console.error("[ProfilePage] Error loading user:", err.message);
    if (err.response) {
        console.error("[ProfilePage] API Error Status:", err.response.status);
        console.error("[ProfilePage] API Error Data:", err.response.data);
    }
  }

  if (!user) {
    return (
        <div className="container mx-auto py-10 animate-in fade-in zoom-in duration-500 h-[80vh] flex items-center justify-center">
            <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p>You need to be logged in to view this page.</p>
                <a href="/login" className="text-primary hover:underline font-medium">Go to Login</a>
            </div>
        </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] w-full py-6 pr-6 pl-6 lg:pl-0 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col md:flex-row gap-6 overflow-hidden">
      
      {/* Left Column: User Identity */}
      <div className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col gap-4 animate-in slide-in-from-left-8 duration-700 delay-150 fill-mode-backwards shrink-0">
         <div className="bg-background/60 backdrop-blur-xl border rounded-xl h-full shadow-sm p-4 flex flex-col items-center justify-center relative overflow-hidden">
             {/* Decorative background element */}
             <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent"></div>
             <UserInfoCard user={user} className="relative z-10" />
         </div>
      </div>

      {/* Right Column: Settings Tabs */}
      <div className="w-full md:w-2/3 lg:w-3/4 h-full animate-in slide-in-from-right-8 duration-700 delay-300 fill-mode-backwards min-h-0">
        <div className="bg-background/60 backdrop-blur-xl border rounded-xl h-full shadow-sm p-6 flex flex-col overflow-hidden">
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
                <p className="text-muted-foreground">Manage your profile and security preferences.</p>
            </div>

            <Tabs defaultValue="general" className="w-full h-full flex flex-col">
                <TabsList className="w-full justify-start mb-6 bg-muted/50 p-1">
                    <TabsTrigger value="general" className="flex-1 md:flex-none min-w-[120px]">General</TabsTrigger>
                    <TabsTrigger value="security" className="flex-1 md:flex-none min-w-[120px]">Security</TabsTrigger>
                </TabsList>
                
                <div className="flex-1 overflow-y-auto pr-2 pb-10">
                    <TabsContent value="general" className="mt-0 space-y-6 focus-visible:ring-0">
                         <div className="space-y-6">
                            <UserProfile user={user} className="border-none shadow-none p-0 max-w-2xl" />
                         </div>
                    </TabsContent>
                    
                    <TabsContent value="security" className="mt-0 space-y-6 focus-visible:ring-0">
                         <div className="space-y-6">
                            <ChangePassword className="border-none shadow-none mt-0 p-0 max-w-2xl" />
                         </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
