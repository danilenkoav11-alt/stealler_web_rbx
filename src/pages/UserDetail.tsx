import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Clock, RefreshCw } from "lucide-react";
import { DataViewer } from "@/components/DataViewer";
import { ScreenshotViewer } from "@/components/ScreenshotViewer";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  cookies: Array<{
    name: string;
    value: string;
    domain?: string;
    path?: string;
    expires?: string;
  }>;
  history: Array<{
    url: string;
    title?: string;
    visitTime?: string;
    visitCount?: number;
  }>;
  system_info: {
    platform?: string;
    userAgent?: string;
    screenResolution?: string;
    timezone?: string;
    language?: string;
    [key: string]: any;
  };
  timestamp: string;
}

export default function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userMeta, setUserMeta] = useState<{
    id: number;
    username: string;
    timestamp: string;
    hasScreenshot: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      
      // Mock data for demo - in real app this would be API calls
      const mockUserMeta = {
        id: parseInt(userId),
        username: `user_${userId}`,
        timestamp: "2024-01-20 15:30:00",
        hasScreenshot: true
      };
      
      const mockUserData: UserData = {
        cookies: [
          {
            name: "session_token",
            value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            domain: ".example.com",
            path: "/",
            expires: "2024-12-31T23:59:59Z"
          },
          {
            name: "user_preferences",
            value: "theme=dark&lang=en&notifications=true",
            domain: "app.example.com",
            path: "/dashboard"
          },
          {
            name: "analytics_id",
            value: "GA1.2.1234567890.1234567890",
            domain: ".google-analytics.com",
            path: "/"
          }
        ],
        history: [
          {
            url: "https://github.com/user/project",
            title: "GitHub - Project Repository",
            visitTime: "2024-01-20 15:25:00",
            visitCount: 15
          },
          {
            url: "https://stackoverflow.com/questions/12345/how-to-fix",
            title: "How to fix this issue - Stack Overflow",
            visitTime: "2024-01-20 15:20:00",
            visitCount: 3
          },
          {
            url: "https://docs.example.com/api/reference",
            title: "API Reference - Documentation",
            visitTime: "2024-01-20 15:15:00",
            visitCount: 8
          },
          {
            url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
            title: "Never Gonna Give You Up - YouTube",
            visitTime: "2024-01-20 15:10:00",
            visitCount: 1
          }
        ],
        system_info: {
          platform: "Windows 10",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          screenResolution: "1920x1080",
          timezone: "UTC+3",
          language: "en-US",
          memory: "16GB",
          processor: "Intel Core i7-9700K",
          browserVersion: "Chrome 120.0.6099.199",
          ipAddress: "192.168.1.100",
          macAddress: "AA:BB:CC:DD:EE:FF"
        },
        timestamp: "2024-01-20 15:30:00"
      };
      
      setUserMeta(mockUserMeta);
      setUserData(mockUserData);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleRefresh = () => {
    fetchUserData();
    toast({
      title: "Refreshed",
      description: "User data has been updated",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 mx-auto mb-4 text-neon-cyan animate-spin" />
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!userMeta || !userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <p className="text-destructive mb-4">User not found</p>
          <Button onClick={() => navigate("/")} className="cyber-button">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="cyber-button"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold gradient-text">
                {userMeta.username}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary" className="status-online">
                  Online
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>ID: {userMeta.id}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Last seen: {userMeta.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Button onClick={handleRefresh} className="cyber-button">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Screenshot */}
        {userMeta.hasScreenshot && (
          <ScreenshotViewer userId={userMeta.id} />
        )}

        {/* Data Viewer */}
        <DataViewer data={userData} userId={userMeta.id} />
      </div>
    </div>
  );
}