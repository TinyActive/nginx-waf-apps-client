import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Download, Upload, Play, Trash2, Calendar, FileArchive, Database, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { backupService, BackupSchedule } from "@/services/backup.service";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Backup = () => {
  const { toast } = useToast();
  const [backups, setBackups] = useState<BackupSchedule[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importWarningOpen, setImportWarningOpen] = useState(false);
  const [importConfirmOpen, setImportConfirmOpen] = useState(false);
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    schedule: "0 2 * * *",
    enabled: true
  });

  // Load backup schedules
  useEffect(() => {
    loadBackupSchedules();
  }, []);

  const loadBackupSchedules = async () => {
    try {
      const data = await backupService.getSchedules();
      setBackups(data);
    } catch (error: any) {
      toast({ 
        title: "Error loading backups",
        description: error.response?.data?.message || "Failed to load backup schedules",
        variant: "destructive"
      });
    }
  };

  const handleAddBackup = async () => {
    if (!formData.name.trim()) {
      toast({ 
        title: "Validation error",
        description: "Please enter a backup name",
        variant: "destructive"
      });
      return;
    }

    try {
      await backupService.createSchedule({
        name: formData.name,
        schedule: formData.schedule,
        enabled: formData.enabled
      });
      
      setIsDialogOpen(false);
      resetForm();
      loadBackupSchedules();
      
      toast({ 
        title: "Success",
        description: "Backup schedule created successfully"
      });
    } catch (error: any) {
      toast({ 
        title: "Error",
        description: error.response?.data?.message || "Failed to create backup schedule",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      schedule: "0 2 * * *",
      enabled: true
    });
  };

  const handleToggle = async (id: string) => {
    try {
      await backupService.toggleSchedule(id);
      loadBackupSchedules();
      toast({ 
        title: "Success",
        description: "Backup schedule updated"
      });
    } catch (error: any) {
      toast({ 
        title: "Error",
        description: error.response?.data?.message || "Failed to toggle backup schedule",
        variant: "destructive"
      });
    }
  };

  const confirmDelete = (id: string) => {
    setScheduleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!scheduleToDelete) return;

    try {
      await backupService.deleteSchedule(scheduleToDelete);
      setDeleteDialogOpen(false);
      setScheduleToDelete(null);
      loadBackupSchedules();
      toast({ 
        title: "Success",
        description: "Backup schedule deleted"
      });
    } catch (error: any) {
      toast({ 
        title: "Error",
        description: error.response?.data?.message || "Failed to delete backup schedule",
        variant: "destructive"
      });
    }
  };

  const handleRunNow = async (id: string) => {
    try {
      toast({ 
        title: "Backup started",
        description: "Manual backup is running..."
      });
      
      const result = await backupService.runNow(id);
      loadBackupSchedules();
      
      toast({ 
        title: "Backup completed",
        description: `Backup file created: ${result.filename} (${result.size})`
      });
    } catch (error: any) {
      toast({ 
        title: "Backup failed",
        description: error.response?.data?.message || "Failed to run backup",
        variant: "destructive"
      });
    }
  };

  const handleExportConfig = async () => {
    try {
      setExportLoading(true);
      const blob = await backupService.exportConfig();
      
      const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
      const filename = `nginx-config-${timestamp}.json`;
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast({ 
        title: "Success",
        description: "Configuration exported successfully"
      });
    } catch (error: any) {
      toast({ 
        title: "Export failed",
        description: error.response?.data?.message || "Failed to export configuration",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleImportConfig = () => {
    // Open warning dialog first
    setImportWarningOpen(true);
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.json')) {
      toast({
        title: "Invalid file type",
        description: "Please select a JSON backup file",
        variant: "destructive"
      });
      return;
    }
    
    setPendingImportFile(file);
    setImportWarningOpen(false);
    setImportConfirmOpen(true);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const openFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    };
    
    input.click();
  };

  const confirmImport = async () => {
    if (!pendingImportFile) return;

    try {
      setImportLoading(true);
      setImportConfirmOpen(false);
      
      const text = await pendingImportFile.text();
      const data = JSON.parse(text);
      
      const result = await backupService.importConfig(data);
      
      toast({ 
        title: "✅ Restore successful!",
        description: `Restored: ${result.domains} domains, ${result.vhostConfigs} vhost configs, ${result.upstreams} upstreams, ${result.loadBalancers} LB configs, ${result.ssl} SSL certs (${result.sslFiles} files), ${result.modsecCRS + result.modsecCustom} ModSec rules, ${result.acl} ACL rules, ${result.alertChannels} channels, ${result.alertRules} alerts, ${result.users} users, ${result.nginxConfigs} configs. Nginx has been reloaded.`,
        duration: 10000
      });
      
      // Reload data
      loadBackupSchedules();
      setPendingImportFile(null);
    } catch (error: any) {
      toast({ 
        title: "❌ Restore failed",
        description: error.response?.data?.message || "Failed to restore configuration. Please check the file format.",
        variant: "destructive",
        duration: 8000
      });
    } finally {
      setImportLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'default';
      case 'failed': return 'destructive';
      case 'running': return 'secondary';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Backup & Restore</h1>
            <p className="text-muted-foreground">Manage configuration backups and restore points</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Export Configuration</CardTitle>
            <CardDescription>Download current system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export all domains, SSL certificates, ModSecurity rules, and system settings to a JSON file.
            </p>
            <Button onClick={handleExportConfig} className="w-full" disabled={exportLoading}>
              {exportLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Configuration
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Configuration</CardTitle>
            <CardDescription>Restore from a backup file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Import and restore configuration from a previously exported backup file.
            </p>
            <Button onClick={handleImportConfig} variant="outline" className="w-full" disabled={importLoading}>
              {importLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Configuration
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Scheduled Backups</CardTitle>
            <CardDescription>Automated backup schedules</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Backup Schedule</DialogTitle>
                <DialogDescription>
                  Configure automatic backup schedule using cron syntax
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Backup Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Daily Full Backup"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="schedule">Cron Schedule</Label>
                  <Input
                    id="schedule"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    placeholder="0 2 * * *"
                  />
                  <p className="text-xs text-muted-foreground">
                    Examples: "0 2 * * *" (daily at 2 AM), "0 */6 * * *" (every 6 hours)
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    checked={formData.enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                  />
                  <Label htmlFor="enabled">Enable schedule</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddBackup}>Create Schedule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">{backup.name}</TableCell>
                    <TableCell className="font-mono text-sm">{backup.schedule}</TableCell>
                    <TableCell className="text-sm">
                      {backup.lastRun ? new Date(backup.lastRun).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {backup.nextRun ? new Date(backup.nextRun).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(backup.status)}>
                        {backup.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{backup.size || '-'}</TableCell>
                    <TableCell>
                      <Switch
                        checked={backup.enabled}
                        onCheckedChange={() => handleToggle(backup.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleRunNow(backup.id)}>
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => confirmDelete(backup.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup Information</CardTitle>
          <CardDescription>Important notes about backup and restore</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <FileArchive className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">What gets backed up?</p>
              <p className="text-sm text-muted-foreground">
                All domain configurations, SSL certificates, ModSecurity rules, ACL rules, alert settings, and system preferences.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FileArchive className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Restore Process</p>
              <p className="text-sm text-muted-foreground">
                Importing a backup will merge configurations. Existing items with the same ID will be updated.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FileArchive className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Best Practices</p>
              <p className="text-sm text-muted-foreground">
                Keep multiple backup versions, test restore procedures regularly, and store backups in a secure location.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Backup Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this backup schedule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Warning Dialog with File Upload */}
      <Dialog open={importWarningOpen} onOpenChange={setImportWarningOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Upload className="h-6 w-6 text-orange-500" />
              Import Configuration Backup
            </DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <div className="bg-red-50 dark:bg-red-950 border-2 border-red-300 dark:border-red-800 rounded-lg p-4">
                <p className="font-bold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  CRITICAL WARNING - ALL DATA WILL BE REPLACED
                </p>
                <p className="text-sm text-red-800 dark:text-red-200">
                  Importing a backup will <strong className="font-bold underline">COMPLETELY REPLACE</strong> all existing configurations on this server.
                  This action is <strong className="font-bold">IRREVERSIBLE</strong> without a prior backup.
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  📦 What will be replaced:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-orange-800 dark:text-orange-200">
                  <div>• All domain configurations</div>
                  <div>• Load balancer settings</div>
                  <div>• SSL certificates & files</div>
                  <div>• ModSecurity rules</div>
                  <div>• ACL access rules</div>
                  <div>• Alert configurations</div>
                  <div>• User accounts</div>
                  <div>• Nginx vhost files</div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-sm text-yellow-900 dark:text-yellow-100 font-semibold mb-2">
                  💡 Before you proceed:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200 pl-2">
                  <li>Export your current configuration as a safety backup</li>
                  <li>Ensure the backup file is from a trusted source</li>
                  <li>Verify the backup file is not corrupted</li>
                  <li>Notify other administrators about the restore</li>
                </ul>
              </div>

              {/* File Upload Zone */}
              <div className="pt-4">
                <Label className="text-base font-semibold mb-3 block">
                  Select Backup File to Import
                </Label>
                <div
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={openFileDialog}
                  className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    transition-all duration-200 ease-in-out
                    ${isDragging 
                      ? 'border-primary bg-primary/5 scale-[1.02]' 
                      : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`p-4 rounded-full ${isDragging ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Upload className={`h-8 w-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="text-base font-medium">
                        {isDragging ? 'Drop file here' : 'Click to browse or drag & drop'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Accepts .json backup files only
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <FileArchive className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Maximum file size: 50MB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportWarningOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import/Restore Confirmation Dialog */}
      <AlertDialog open={importConfirmOpen} onOpenChange={setImportConfirmOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl">
              <FileArchive className="h-6 w-6 text-orange-500" />
              ⚠️ Confirm Configuration Restore
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-4">
              <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  🚨 CRITICAL WARNING - Data Replacement
                </p>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Restoring this backup will <strong className="font-bold">REPLACE ALL existing data</strong> on this server with data from the backup file.
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <p className="font-semibold text-foreground">The following will be REPLACED:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                  <li><strong>Domains</strong>: All domain configurations, upstreams, load balancers</li>
                  <li><strong>Nginx Configs</strong>: Virtual host files in /etc/nginx/sites-available/</li>
                  <li><strong>SSL Certificates</strong>: Certificate files (.crt, .key) in /etc/nginx/ssl/</li>
                  <li><strong>ModSecurity Rules</strong>: CRS rules and custom security rules</li>
                  <li><strong>ACL Rules</strong>: All access control configurations</li>
                  <li><strong>Alert Settings</strong>: Notification channels and alert rules</li>
                  <li><strong>Users</strong>: User accounts with passwords (can login immediately)</li>
                  <li><strong>System Configs</strong>: Global nginx configurations</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  ✅ After Restore:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200 pl-2">
                  <li>Nginx will be automatically reloaded</li>
                  <li>Domains will be immediately accessible with restored configurations</li>
                  <li>SSL certificates will be active and functional</li>
                  <li>Users can login with their original passwords from backup</li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-sm text-yellow-900 dark:text-yellow-100">
                  💡 <strong>Recommendation:</strong> Create a backup of your current configuration before proceeding with the restore.
                </p>
              </div>

              <p className="text-sm font-semibold text-foreground pt-2">
                Do you want to proceed with the restore?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingImportFile(null)}>
              Cancel - Keep Current Data
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmImport}
              className="bg-orange-600 text-white hover:bg-orange-700"
              disabled={importLoading}
            >
              {importLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  Confirm - Restore Backup
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Backup;
