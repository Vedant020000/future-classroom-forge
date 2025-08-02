
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Shield,
  Key,
  Save
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const SettingsPage = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setApiKey(profile.gemini_api_key || "");
      if (!profile.gemini_api_key) {
        setShowApiKeyModal(true);
      }
    }
  }, [profile]);

  const handleSaveApiKey = async () => {
    setIsLoading(true);
    try {
      const { error } = await updateProfile({
        gemini_api_key: apiKey,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "API Key saved successfully!",
      });
      setShowApiKeyModal(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save API Key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Account Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Account Type</span>
                  <Badge variant="secondary">
                    {profile?.user_type === 'organization' ? 'Organization' : 'Individual'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Key
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Gemini API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API Key"
                />
              </div>
              <Button onClick={handleSaveApiKey} disabled={isLoading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save API Key"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showApiKeyModal} onOpenChange={setShowApiKeyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Your Gemini API Key</DialogTitle>
            <DialogDescription>
              Please add your Gemini API key to continue using the AI features.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="w-full h-64 bg-black rounded-md flex items-center justify-center">
              <p className="text-white">Video tutorial on how to get your API key</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-api-key">Gemini API Key</Label>
              <Input
                id="modal-api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API Key"
              />
            </div>
            <Button onClick={handleSaveApiKey} disabled={isLoading} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save API Key"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
