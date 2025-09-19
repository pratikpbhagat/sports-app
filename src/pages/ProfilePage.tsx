// app/(routes)/profile/page.tsx
"use client";

import { useCallback, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Upload } from "lucide-react";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  dob?: string; // ISO date
  duprId?: string;
  role?: string;
  subscription?: string;
  avatarUrl?: string | null;
};

const INITIAL_USER: UserProfile = {
  id: "user_12345",
  name: "Casey Novak",
  email: "casey@example.com",
  dob: "1990-07-12",
  duprId: "DU123-456-789",
  role: "Player",
  subscription: "Player (Free)",
  avatarUrl: null,
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [dob, setDob] = useState(user.dob ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl ?? null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const onSelectFile = useCallback((file?: File) => {
    console.log(avatarFile);
    if (!file) {
      setAvatarPreview(null);
      setAvatarFile(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(String(reader.result));
    };
    reader.readAsDataURL(file);
    setAvatarFile(file);
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onSelectFile(f);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // In a real app: upload avatarFile to storage, send form to API, handle errors
      // For this demo we simulate async save and update local state
      await new Promise((res) => setTimeout(res, 700));

      setUser((prev) => ({
        ...prev,
        name: name.trim(),
        email: email.trim(),
        dob: dob || undefined,
        avatarUrl: avatarPreview,
      }));

      // Simple feedback — replace with toast system in production
      alert("Profile saved (demo). Wire this to your backend.");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile. See console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // reset form to current user state
    setName(user.name);
    setEmail(user.email);
    setDob(user.dob ?? "");
    setAvatarPreview(user.avatarUrl ?? null);
    setAvatarFile(null);
  };

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Profile</h1>
        <p className="text-sm text-slate-500">View and edit your profile details.</p>
      </header>

      <section className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg font-semibold text-[#0f172a]">Account</CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Left column: avatar + meta */}
              <div className="flex flex-col items-center md:items-start gap-4">
                <Avatar className="h-28 w-28">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} />
                  ) : user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} />
                  ) : (
                    <AvatarFallback className="bg-[#7c3aed] text-white">
                      {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex items-center gap-2">
                  <label
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white text-sm shadow-sm cursor-pointer hover:opacity-95 transition border border-slate-100"
                  >
                    <Upload className="w-4 h-4 text-slate-600" />
                    <span className="text-xs text-slate-600">Change</span>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>

                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-3 py-2 rounded-md text-sm bg-red-50 text-red-700 hover:bg-red-100 transition"
                  >
                    Remove
                  </button>
                </div>

                <div className="text-xs text-slate-500">
                  Recommended: square image, up to 2MB.
                </div>
              </div>

              {/* Right column: fields */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-xs text-slate-600">Full name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-xs text-slate-600">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dob" className="text-xs text-slate-600">Date of birth</Label>
                    <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600">DUPr ID</Label>
                    <div className="mt-1 text-sm text-slate-700">{user.duprId ?? "—"}</div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-slate-600">Role</Label>
                    <div className="mt-1 text-sm text-slate-700">{user.role}</div>
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600">Subscription</Label>
                    <div className="mt-1 text-sm text-slate-700">{user.subscription}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end mt-2">
                  <Button variant="ghost" onClick={handleCancel} type="button" disabled={saving}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg font-semibold text-[#0f172a]">Security</CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-xs text-slate-600">Change password</Label>
                <div className="mt-2 text-sm text-slate-700">Use the password change flow to secure your account. (Not implemented in demo.)</div>
                <div className="mt-3">
                  <Button variant="outline" size="sm" onClick={() => alert("Open change password flow (demo)")}>
                    Change password
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-xs text-slate-600">Connected accounts</Label>
                <div className="mt-2 text-sm text-slate-700">GitHub, Google, etc. (Not implemented in demo.)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
