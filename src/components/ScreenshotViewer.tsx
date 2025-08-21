import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Monitor, ZoomIn } from "lucide-react";
import { useState } from "react";

interface ScreenshotViewerProps {
  userId: number;
  onDownload?: () => void;
}

export function ScreenshotViewer({ userId, onDownload }: ScreenshotViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const screenshotUrl = `/api/screenshot/${userId}`;

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = screenshotUrl;
    link.download = `screenshot-${userId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onDownload?.();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="relative max-w-full max-h-full">
          <Button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-10 cyber-button"
            size="sm"
          >
            Close
          </Button>
          <img
            src={screenshotUrl}
            alt={`Screenshot for user ${userId}`}
            className="max-w-full max-h-full object-contain rounded-lg"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      </div>
    );
  }

  return (
    <Card className="cyber-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-display gradient-text flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Screenshot
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={toggleFullscreen} className="cyber-button" size="sm">
              <ZoomIn className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
            <Button onClick={handleDownload} className="cyber-button" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {isLoading && !error && (
            <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Monitor className="h-12 w-12 mx-auto mb-2 text-neon-cyan animate-pulse" />
                <p className="text-muted-foreground">Loading screenshot...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Monitor className="h-12 w-12 mx-auto mb-2 text-destructive" />
                <p className="text-destructive">Failed to load screenshot</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Screenshot may not be available for this user
                </p>
              </div>
            </div>
          )}

          <img
            src={screenshotUrl}
            alt={`Screenshot for user ${userId}`}
            className={`w-full rounded-lg shadow-lg transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            } ${error ? 'hidden' : 'block'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      </CardContent>
    </Card>
  );
}