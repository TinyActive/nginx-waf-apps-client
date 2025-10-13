import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import * as domainService from '@/services/domain.service';

interface InstallationProgressProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onComplete?: () => void;
}

const STEP_PROGRESS = {
  dependencies: 10,
  modsecurity_download: 20,
  modsecurity_build: 40,
  connector_download: 50,
  nginx_download: 60,
  nginx_build: 75,
  modsecurity_config: 90,
  nginx_config: 95,
  completed: 100,
  error: 0,
};

const STEP_NAMES = {
  dependencies: 'Installing Dependencies',
  modsecurity_download: 'Downloading ModSecurity',
  modsecurity_build: 'Building ModSecurity',
  connector_download: 'Downloading Nginx Connector',
  nginx_download: 'Downloading Nginx',
  nginx_build: 'Building Nginx',
  modsecurity_config: 'Configuring ModSecurity',
  nginx_config: 'Configuring Nginx',
  completed: 'Installation Completed',
  error: 'Installation Failed',
};

export function InstallationProgressDialog({ open, onOpenChange, onComplete }: InstallationProgressProps) {
  const [status, setStatus] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!open) return;

    const checkStatus = async () => {
      try {
        const installStatus = await domainService.getInstallationStatus();
        
        if (installStatus) {
          setStatus(installStatus);
          const stepProgress = STEP_PROGRESS[installStatus.step as keyof typeof STEP_PROGRESS] || 0;
          setProgress(stepProgress);

          if (installStatus.status === 'success' || installStatus.step === 'completed') {
            setIsComplete(true);
            if (onComplete) {
              setTimeout(onComplete, 2000);
            }
          }

          if (installStatus.status === 'failed') {
            setHasError(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch installation status:', error);
      }
    };

    // Initial check
    checkStatus();

    // Poll every 3 seconds
    const interval = setInterval(checkStatus, 3000);

    return () => clearInterval(interval);
  }, [open, onComplete]);

  if (!status) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Checking Installation Status</DialogTitle>
            <DialogDescription>
              Please wait while we check the nginx and modsecurity installation status...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {hasError ? (
              <>
                <AlertCircle className="h-5 w-5 text-destructive" />
                Installation Failed
              </>
            ) : isComplete ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Installation Complete
              </>
            ) : (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                Installing Nginx + ModSecurity
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {hasError
              ? 'An error occurred during installation. Please check the logs.'
              : isComplete
              ? 'Nginx and ModSecurity have been successfully installed and configured.'
              : 'This process may take 15-30 minutes. Please do not close this window.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {STEP_NAMES[status.step as keyof typeof STEP_NAMES] || status.step}
              </span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {status.message && (
            <Alert variant={hasError ? 'destructive' : 'default'}>
              <AlertDescription className="text-sm">
                {status.message}
              </AlertDescription>
            </Alert>
          )}

          {!hasError && !isComplete && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Dependencies installation (Step 1/8)</p>
              <p>• ModSecurity download and build (Steps 2-3)</p>
              <p>• Nginx connector download (Step 4)</p>
              <p>• Nginx download and build (Steps 5-6)</p>
              <p>• Configuration setup (Steps 7-8)</p>
            </div>
          )}

          {hasError && (
            <div className="text-sm space-y-2">
              <p className="font-medium">To view detailed error logs:</p>
              <code className="block bg-muted p-2 rounded text-xs">
                tail -f /var/log/nginx-modsecurity-install.log
              </code>
            </div>
          )}

          {isComplete && (
            <div className="space-y-2">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm text-green-800">
                  You can now manage domains and configure nginx through the portal.
                </AlertDescription>
              </Alert>
              <div className="text-xs text-muted-foreground">
                <p>Nginx status: <code>systemctl status nginx</code></p>
                <p>Logs: <code>/var/log/nginx/</code></p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
