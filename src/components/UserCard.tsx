import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Clock, User, Monitor } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserCardProps {
  user: {
    id: number;
    username: string;
    timestamp: string;
    hasScreenshot?: boolean;
  };
  onViewDetails: (id: number) => void;
}

export function UserCard({ user, onViewDetails }: UserCardProps) {
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return timestamp;
    }
  };

  return (
    <Card className="cyber-card group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display gradient-text">
            {user.username}
          </CardTitle>
          <Badge variant="secondary" className="status-online">
            Online
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>ID: {user.id}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-neon-cyan" />
          <span>{formatTime(user.timestamp)}</span>
        </div>
        
        {user.hasScreenshot && (
          <div className="flex items-center gap-2 text-sm text-neon-green">
            <Monitor className="h-4 w-4" />
            <span>Screenshot available</span>
          </div>
        )}
        
        <Button 
          onClick={() => onViewDetails(user.id)} 
          className="cyber-button w-full"
          size="sm"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}