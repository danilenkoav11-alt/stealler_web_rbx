import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCard } from "@/components/UserCard";
import { UserTable } from "@/components/UserTable";
import { 
  Users, 
  Search, 
  Grid, 
  List, 
  RefreshCw, 
  Database,
  Activity,
  Monitor,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  timestamp: string;
  hasScreenshot?: boolean;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    onlineUsers: 0,
    withScreenshots: 0,
    lastUpdate: ""
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate data
      const mockUsers: User[] = [
        { id: 1, username: "angel0chek", timestamp: "2024-01-20 15:30:00", hasScreenshot: true },
        { id: 2, username: "winter", timestamp: "2024-01-20 14:45:00", hasScreenshot: false },
        { id: 3, username: "user123", timestamp: "2024-01-20 13:20:00", hasScreenshot: true },
        { id: 4, username: "guest_user", timestamp: "2024-01-20 12:10:00", hasScreenshot: true },
        { id: 5, username: "cyber_ninja", timestamp: "2024-01-20 11:30:00", hasScreenshot: false },
      ];
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      
      setStats({
        totalUsers: mockUsers.length,
        onlineUsers: mockUsers.length,
        withScreenshots: mockUsers.filter(u => u.hasScreenshot).length,
        lastUpdate: new Date().toLocaleString()
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toString().includes(searchQuery)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleViewDetails = (userId: number) => {
    navigate(`/user/${userId}`);
  };

  const handleRefresh = () => {
    fetchUsers();
    toast({
      title: "Refreshed",
      description: "Data has been updated",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold gradient-text glow-effect">
              Cyber Panel
            </h1>
            <p className="text-muted-foreground mt-2">
              Advanced user monitoring and data analytics
            </p>
          </div>
          <Button onClick={handleRefresh} className="cyber-button">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-display neon-text">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Online Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-display text-neon-green">{stats.onlineUsers}</div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Screenshots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-display text-neon-purple">{stats.withScreenshots}</div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last Update
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono text-neon-cyan">{stats.lastUpdate}</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="cyber-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-border focus:border-neon-cyan"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  {filteredUsers.length} users
                </Badge>
                
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Display */}
        {isLoading ? (
          <div className="text-center py-12">
            <Database className="h-12 w-12 mx-auto mb-4 text-neon-cyan animate-pulse" />
            <p className="text-muted-foreground">Loading users data...</p>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <UserTable users={filteredUsers} onViewDetails={handleViewDetails} />
            )}

            {filteredUsers.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No users found matching your search</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}