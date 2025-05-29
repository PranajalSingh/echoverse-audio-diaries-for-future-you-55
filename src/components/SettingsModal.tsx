
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Timer, Info } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeCapsuleMode: boolean;
  onTimeCapsuleModeChange: (enabled: boolean) => void;
}

export const SettingsModal = ({ 
  isOpen, 
  onClose, 
  timeCapsuleMode, 
  onTimeCapsuleModeChange 
}: SettingsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Time Capsule Mode */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-purple-400" />
                <Label htmlFor="time-capsule" className="text-white font-medium">
                  Time Capsule Mode
                </Label>
              </div>
              <Switch
                id="time-capsule"
                checked={timeCapsuleMode}
                onCheckedChange={onTimeCapsuleModeChange}
              />
            </div>
            
            <div className="bg-white/5 rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-purple-200">
                  <p className="font-medium text-white mb-1">What is Time Capsule Mode?</p>
                  <p>
                    When enabled, all entries (even those with past unlock dates) will remain hidden 
                    until exactly one year has passed since they were recorded. This creates a true 
                    "time capsule" experience where you're guaranteed to meet your past self after 
                    significant time has passed.
                  </p>
                </div>
              </div>
            </div>
            
            {timeCapsuleMode && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <p className="text-amber-200 text-sm">
                  <strong>Active:</strong> Your entries will only unlock after one full year, 
                  regardless of their individual unlock dates.
                </p>
              </div>
            )}
          </div>

          {/* Future Settings Placeholder */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-purple-300 text-sm text-center">
              More settings coming soon...
            </p>
          </div>

          {/* Close Button */}
          <div className="pt-4">
            <Button
              onClick={onClose}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
