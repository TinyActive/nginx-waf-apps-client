import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useCreateNLB, useUpdateNLB } from '@/queries/nlb.query-options';
import { NetworkLoadBalancer, CreateNLBInput, NLBUpstream } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NLBFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  nlb?: NetworkLoadBalancer | null;
  mode: 'create' | 'edit';
}

type FormData = CreateNLBInput;

export default function NLBFormDialog({ isOpen, onClose, nlb, mode }: NLBFormDialogProps) {
  const { toast } = useToast();
  const createMutation = useCreateNLB();
  const updateMutation = useUpdateNLB();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      port: 10000,
      protocol: 'tcp',
      algorithm: 'round_robin',
      upstreams: [{ host: '', port: 80, weight: 1, maxFails: 3, failTimeout: 10, maxConns: 0, backup: false, down: false }],
      proxyTimeout: 3,
      proxyConnectTimeout: 1,
      proxyNextUpstream: true,
      proxyNextUpstreamTimeout: 0,
      proxyNextUpstreamTries: 0,
      healthCheckEnabled: true,
      healthCheckInterval: 10,
      healthCheckTimeout: 5,
      healthCheckRises: 2,
      healthCheckFalls: 3,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'upstreams',
  });

  const protocol = watch('protocol');

  useEffect(() => {
    if (isOpen && nlb && mode === 'edit') {
      reset({
        name: nlb.name,
        description: nlb.description || '',
        port: nlb.port,
        protocol: nlb.protocol,
        algorithm: nlb.algorithm,
        upstreams: nlb.upstreams.map(u => ({
          host: u.host,
          port: u.port,
          weight: u.weight,
          maxFails: u.maxFails,
          failTimeout: u.failTimeout,
          maxConns: u.maxConns,
          backup: u.backup,
          down: u.down,
        })),
        proxyTimeout: nlb.proxyTimeout,
        proxyConnectTimeout: nlb.proxyConnectTimeout,
        proxyNextUpstream: nlb.proxyNextUpstream,
        proxyNextUpstreamTimeout: nlb.proxyNextUpstreamTimeout,
        proxyNextUpstreamTries: nlb.proxyNextUpstreamTries,
        healthCheckEnabled: nlb.healthCheckEnabled,
        healthCheckInterval: nlb.healthCheckInterval,
        healthCheckTimeout: nlb.healthCheckTimeout,
        healthCheckRises: nlb.healthCheckRises,
        healthCheckFalls: nlb.healthCheckFalls,
      });
    } else if (isOpen && mode === 'create') {
      reset({
        name: '',
        description: '',
        port: 10000,
        protocol: 'tcp',
        algorithm: 'round_robin',
        upstreams: [{ host: '', port: 80, weight: 1, maxFails: 3, failTimeout: 10, maxConns: 0, backup: false, down: false }],
        proxyTimeout: 3,
        proxyConnectTimeout: 1,
        proxyNextUpstream: true,
        proxyNextUpstreamTimeout: 0,
        proxyNextUpstreamTries: 0,
        healthCheckEnabled: true,
        healthCheckInterval: 10,
        healthCheckTimeout: 5,
        healthCheckRises: 2,
        healthCheckFalls: 3,
      });
    }
  }, [isOpen, nlb, mode, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      // Convert all string numbers to actual numbers
      const processedData = {
        ...data,
        port: Number(data.port),
        proxyTimeout: Number(data.proxyTimeout),
        proxyConnectTimeout: Number(data.proxyConnectTimeout),
        proxyNextUpstream: Boolean(data.proxyNextUpstream),
        proxyNextUpstreamTimeout: Number(data.proxyNextUpstreamTimeout),
        proxyNextUpstreamTries: Number(data.proxyNextUpstreamTries),
        healthCheckEnabled: Boolean(data.healthCheckEnabled),
        healthCheckInterval: Number(data.healthCheckInterval),
        healthCheckTimeout: Number(data.healthCheckTimeout),
        healthCheckRises: Number(data.healthCheckRises),
        healthCheckFalls: Number(data.healthCheckFalls),
        upstreams: data.upstreams.map(upstream => ({
          ...upstream,
          port: Number(upstream.port),
          weight: Number(upstream.weight),
          maxFails: Number(upstream.maxFails),
          failTimeout: Number(upstream.failTimeout),
          maxConns: Number(upstream.maxConns),
          backup: Boolean(upstream.backup),
          down: Boolean(upstream.down),
        })),
      };

      if (mode === 'create') {
        await createMutation.mutateAsync(processedData);
        toast({
          title: 'Success',
          description: 'NLB created successfully',
        });
      } else if (nlb) {
        await updateMutation.mutateAsync({ id: nlb.id, data: processedData });
        toast({
          title: 'Success',
          description: 'NLB updated successfully',
        });
      }
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.message;
      let description = `Failed to ${mode} NLB`;
      
      if (message?.includes('already exists')) {
        description = 'An NLB with this name already exists';
      } else if (message) {
        description = message;
      }

      toast({
        title: 'Error',
        description,
        variant: 'destructive',
      });
    }
  };

  const addUpstream = () => {
    append({ host: '', port: 80, weight: 1, maxFails: 3, failTimeout: 10, maxConns: 0, backup: false, down: false });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create' : 'Edit'} Network Load Balancer</DialogTitle>
          <DialogDescription>
            Configure a Layer 4 load balancer for TCP/UDP traffic distribution.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="upstreams">Upstreams</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="my-nlb"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Description of this load balancer"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="port">Port * (≥ 10000)</Label>
                  <Input
                    id="port"
                    type="number"
                    {...register('port', {
                      required: 'Port is required',
                      min: { value: 10000, message: 'Port must be ≥ 10000' },
                      max: { value: 65535, message: 'Port must be ≤ 65535' },
                    })}
                  />
                  {errors.port && (
                    <p className="text-sm text-destructive">{errors.port.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="protocol">Protocol *</Label>
                  <Select
                    value={protocol}
                    onValueChange={(value) => setValue('protocol', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tcp">TCP</SelectItem>
                      <SelectItem value="udp">UDP</SelectItem>
                      <SelectItem value="tcp_udp">TCP + UDP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="algorithm">Load Balancing Algorithm</Label>
                <Select
                  defaultValue="round_robin"
                  onValueChange={(value) => setValue('algorithm', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round_robin">Round Robin</SelectItem>
                    <SelectItem value="least_conn">Least Connections</SelectItem>
                    <SelectItem value="ip_hash">IP Hash</SelectItem>
                    <SelectItem value="hash">Hash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="upstreams" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Label>Backend Servers *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addUpstream}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Upstream
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium">Upstream {index + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Host *</Label>
                          <Input
                            {...register(`upstreams.${index}.host`, {
                              required: 'Host is required',
                            })}
                            placeholder="192.168.1.100"
                          />
                          {errors.upstreams?.[index]?.host && (
                            <p className="text-sm text-destructive">
                              {errors.upstreams[index]?.host?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Port *</Label>
                          <Input
                            type="number"
                            {...register(`upstreams.${index}.port`, {
                              required: 'Port is required',
                              min: 1,
                              max: 65535,
                            })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Weight</Label>
                          <Input
                            type="number"
                            {...register(`upstreams.${index}.weight`, {
                              min: 1,
                              max: 100,
                            })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Max Fails</Label>
                          <Input
                            type="number"
                            {...register(`upstreams.${index}.maxFails`, { min: 0 })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Fail Timeout (s)</Label>
                          <Input
                            type="number"
                            {...register(`upstreams.${index}.failTimeout`, { min: 1 })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Max Connections</Label>
                          <Input
                            type="number"
                            {...register(`upstreams.${index}.maxConns`, { min: 0 })}
                            placeholder="0 = unlimited"
                          />
                        </div>

                        <TooltipProvider>
                          <div className="flex items-center space-x-2">
                            <Controller
                              name={`upstreams.${index}.backup`}
                              control={control}
                              render={({ field }) => (
                                <Switch
                                  id={`backup-${index}`}
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />
                            <Label htmlFor={`backup-${index}`}>Backup</Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Server chỉ được dùng khi tất cả server chính đều down</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>

                        <TooltipProvider>
                          <div className="flex items-center space-x-2">
                            <Controller
                              name={`upstreams.${index}.down`}
                              control={control}
                              render={({ field }) => (
                                <Switch
                                  id={`down-${index}`}
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />
                            <Label htmlFor={`down-${index}`}>Mark Down</Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Đánh dấu server này không khả dụng (maintenance/error)</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {errors.upstreams && (
                <p className="text-sm text-destructive">
                  At least one upstream is required
                </p>
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-4">Proxy Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Proxy Timeout (s)</Label>
                    <Input type="number" {...register('proxyTimeout', { min: 1 })} />
                  </div>

                  <div className="space-y-2">
                    <Label>Proxy Connect Timeout (s)</Label>
                    <Input type="number" {...register('proxyConnectTimeout', { min: 1 })} />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="proxyNextUpstream"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="proxyNextUpstream"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label htmlFor="proxyNextUpstream">Enable Proxy Next Upstream</Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Next Upstream Timeout (s)</Label>
                    <Input
                      type="number"
                      {...register('proxyNextUpstreamTimeout', { min: 0 })}
                      placeholder="0 = disabled"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Next Upstream Tries</Label>
                    <Input
                      type="number"
                      {...register('proxyNextUpstreamTries', { min: 0 })}
                      placeholder="0 = unlimited"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-4">Health Check Settings</h4>
                <div className="flex items-center space-x-2 mb-4">
                  <Controller
                    name="healthCheckEnabled"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="healthCheckEnabled"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor="healthCheckEnabled">Enable Health Checks</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Check Interval (s)</Label>
                    <Input
                      type="number"
                      {...register('healthCheckInterval', { min: 5 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Check Timeout (s)</Label>
                    <Input type="number" {...register('healthCheckTimeout', { min: 1 })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Rises (successful checks)</Label>
                    <Input type="number" {...register('healthCheckRises', { min: 1 })} />
                  </div>

                  <div className="space-y-2">
                    <Label>Falls (failed checks)</Label>
                    <Input type="number" {...register('healthCheckFalls', { min: 1 })} />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : mode === 'create'
                ? 'Create'
                : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
