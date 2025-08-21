import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Monitor, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: number;
  username: string;
  timestamp: string;
  hasScreenshot?: boolean;
}

interface UserTableProps {
  users: User[];
  onViewDetails: (id: number) => void;
}

export function UserTable({ users, onViewDetails }: UserTableProps) {
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="data-grid">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="text-neon-cyan font-display">ID</TableHead>
            <TableHead className="text-neon-cyan font-display">Username</TableHead>
            <TableHead className="text-neon-cyan font-display">Status</TableHead>
            <TableHead className="text-neon-cyan font-display">Last Seen</TableHead>
            <TableHead className="text-neon-cyan font-display">Screenshot</TableHead>
            <TableHead className="text-neon-cyan font-display">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow 
              key={user.id} 
              className="border-border hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-mono text-neon-cyan">
                #{user.id}
              </TableCell>
              <TableCell className="font-medium">
                {user.username}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="status-online">
                  Online
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatTime(user.timestamp)}
                </div>
              </TableCell>
              <TableCell>
                {user.hasScreenshot ? (
                  <div className="flex items-center gap-2 text-neon-green">
                    <Monitor className="h-4 w-4" />
                    <span className="text-sm">Available</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">None</span>
                )}
              </TableCell>
              <TableCell>
                <Button 
                  onClick={() => onViewDetails(user.id)} 
                  className="cyber-button"
                  size="sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}