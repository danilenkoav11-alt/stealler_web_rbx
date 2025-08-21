import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cookie, History, Monitor, Globe, Clock, Database } from "lucide-react";

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

interface DataViewerProps {
  data: UserData;
  userId: number;
}

export function DataViewer({ data, userId }: DataViewerProps) {
  const formatCookieValue = (value: string) => {
    if (value.length > 50) {
      return value.substring(0, 50) + "...";
    }
    return value;
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="font-display gradient-text flex items-center gap-2">
            <Database className="h-5 w-5" />
            User Data Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-display neon-text">{data.cookies?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Cookies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display neon-text">{data.history?.length || 0}</div>
              <div className="text-sm text-muted-foreground">History Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display neon-text">#{userId}</div>
              <div className="text-sm text-muted-foreground">User ID</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display neon-text">
                {data.system_info?.platform || "Unknown"}
              </div>
              <div className="text-sm text-muted-foreground">Platform</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="cookies" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/20">
          <TabsTrigger value="cookies" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Cookie className="h-4 w-4 mr-2" />
            Cookies
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Monitor className="h-4 w-4 mr-2" />
            System Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cookies" className="mt-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="font-display">Browser Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {data.cookies?.map((cookie, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-neon-cyan">{cookie.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {cookie.domain || "Unknown"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground font-mono break-all">
                        {formatCookieValue(cookie.value)}
                      </div>
                      {cookie.expires && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Expires: {cookie.expires}
                        </div>
                      )}
                    </div>
                  )) || (
                    <div className="text-center text-muted-foreground py-8">
                      No cookies found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="font-display">Browser History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {data.history?.map((item, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-start gap-3">
                        <Globe className="h-4 w-4 text-neon-cyan mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {item.title || "Untitled Page"}
                          </div>
                          <div className="text-xs text-neon-cyan font-mono break-all">
                            {formatUrl(item.url)}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            {item.visitTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {item.visitTime}
                              </div>
                            )}
                            {item.visitCount && (
                              <div>
                                Visits: {item.visitCount}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center text-muted-foreground py-8">
                      No history found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="font-display">System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(data.system_info || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-border">
                    <span className="font-medium capitalize text-neon-cyan">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm text-muted-foreground font-mono text-right max-w-md truncate">
                      {String(value)}
                    </span>
                  </div>
                ))}
                {(!data.system_info || Object.keys(data.system_info).length === 0) && (
                  <div className="text-center text-muted-foreground py-8">
                    No system information available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}