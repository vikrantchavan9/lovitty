
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellOff, Trash2, User, KeyRound, Loader2 } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

export default function SettingsPage() {
    const { toast } = useToast();
    const { pushNotification } = useNotification();
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState({
        pushNotifications: true,
        emailNotifications: false,
        newFollowerAlerts: true,
        messageAlerts: true,
    });

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call to save settings
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        pushNotification("Your settings have been saved!");
    };

    const handleSettingChange = (id: keyof typeof settings, checked: boolean) => {
        setSettings(prev => ({ ...prev, [id]: checked }));
    };

    return (
        <div className="grid gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Manage how you receive notifications from Lovekitty.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                        <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                            <span className="font-medium flex items-center gap-2"><Bell /> Push Notifications</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Receive push notifications on your device.
                            </span>
                        </Label>
                        <Switch id="push-notifications" checked={settings.pushNotifications} onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)} />
                    </div>
                     <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                        <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                            <span className="font-medium flex items-center gap-2"><Bell /> Email Notifications</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Get important notifications sent to your email.
                            </span>
                        </Label>
                        <Switch id="email-notifications" checked={settings.emailNotifications} onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)} />
                    </div>
                    <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                        <Label htmlFor="new-follower" className="flex flex-col space-y-1">
                           <span className="font-medium flex items-center gap-2"><User /> New Follower Alerts</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Get notified when someone follows you.
                            </span>
                        </Label>
                        <Switch id="new-follower" checked={settings.newFollowerAlerts} onCheckedChange={(checked) => handleSettingChange('newFollowerAlerts', checked)} />
                    </div>
                     <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                        <Label htmlFor="message-alerts" className="flex flex-col space-y-1">
                           <span className="font-medium flex items-center gap-2"><Bell /> New Message Alerts</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Get notified when you receive a new message.
                            </span>
                        </Label>
                        <Switch id="message-alerts" checked={settings.messageAlerts} onCheckedChange={(checked) => handleSettingChange('messageAlerts', checked)} />
                    </div>
                </CardContent>
                <CardContent>
                     <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                        {isSaving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Manage your account settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Button variant="outline"><KeyRound/> Change Password</Button>
                </CardContent>
            </Card>

             <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive"><Trash2/> Delete Account</Button>
                </CardContent>
            </Card>
        </div>
    );
}
