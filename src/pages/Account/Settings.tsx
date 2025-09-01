import { useState } from "react";
import {
  Settings,
  Shield,
  Save,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    security: {
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: "24h",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editSettings, setEditSettings] = useState(settings);

  // Change Password Modal State
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");

  // Delete Account Modal State
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = () => {
    setSettings(editSettings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditSettings(settings);
    setIsEditing(false);
  };

  const handleSettingChange = (category: string, key: string, value: any) => {
    setEditSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  // Change Password Functions
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    setPasswordError("");
  };

  const handleChangePassword = async () => {
    // Validation
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    try {
      // Here you would typically make an API call to change the password
      // await changePassword(passwordData.currentPassword, passwordData.newPassword);

      // For now, we'll just simulate success
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordError("");
      // You could show a success toast here
    } catch (error) {
      setPasswordError("Failed to change password. Please try again.");
    }
  };

  const resetPasswordForm = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setShowPasswords({ current: false, new: false, confirm: false });
  };

  // Delete Account Functions
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      return;
    }

    setIsDeleting(true);
    try {
      // Here you would typically make an API call to delete the account
      // await deleteAccount();

      // For now, we'll just simulate success
      setShowDeleteAccount(false);
      setDeleteConfirmation("");
      // You could redirect to logout or show a success message
    } catch (error) {
      // Handle error
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account security settings
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-primary hover:bg-primary-foreground"
          >
            <Settings className="h-4 w-4 mr-2" />
            Edit Settings
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary-foreground"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Two-Factor Authentication
                </Label>
                <p className="text-xs text-gray-600">
                  Add an extra layer of security
                </p>
              </div>
              <Switch
                checked={editSettings.security.twoFactorAuth}
                onCheckedChange={(checked) =>
                  handleSettingChange("security", "twoFactorAuth", checked)
                }
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Login Notifications
                </Label>
                <p className="text-xs text-gray-600">
                  Get notified of new logins
                </p>
              </div>
              <Switch
                checked={editSettings.security.loginNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("security", "loginNotifications", checked)
                }
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Session Timeout</Label>
              <Select
                value={editSettings.security.sessionTimeout}
                onValueChange={(value) =>
                  handleSettingChange("security", "sessionTimeout", value)
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="6h">6 Hours</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => setShowChangePassword(true)}
            >
              Change Password
            </Button>
            <Button
              variant="outline"
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              Export Data
            </Button>
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setShowDeleteAccount(true)}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    handlePasswordChange("currentPassword", e.target.value)
                  }
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    handlePasswordChange("newPassword", e.target.value)
                  }
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    handlePasswordChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {passwordError && (
              <p className="text-sm text-red-600">{passwordError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowChangePassword(false);
                resetPasswordForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>Change Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Modal */}
      <AlertDialog open={showDeleteAccount} onOpenChange={setShowDeleteAccount}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label
              htmlFor="delete-confirmation"
              className="text-sm font-medium"
            >
              Type "DELETE" to confirm
            </Label>
            <Input
              id="delete-confirmation"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="DELETE"
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== "DELETE" || isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsPage;
