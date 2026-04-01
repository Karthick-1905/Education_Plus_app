"use client";

import { useEffect, useState } from "react";
import {
    getSettings,
    updateSettings,
    updateProfile
} from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import {
    User as UserIcon,
    Settings as SettingsIcon,
    Timer,
    Sparkles,
    Bell,
    Moon,
    Sun,
    Monitor,
    Loader2,
    CheckCircle2,
    BookOpen,
    Shield,
    Smartphone,
    Globe,
    ChevronRight,
    Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
    { id: "profile", label: "My Profile", icon: UserIcon, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "academic", label: "Academic Info", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
    { id: "timer", label: "Study Timer", icon: Timer, color: "text-rose-600", bg: "bg-rose-50" },
    { id: "ai", label: "AI Preferences", icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50" },
    { id: "appearance", label: "Appearance", icon: Moon, color: "text-purple-600", bg: "bg-purple-50" },
];

export default function SettingsPage() {
    const { toast } = useToast();
    const [activeCategory, setActiveCategory] = useState("profile");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<any>(null);
    const [settings, setSettings] = useState<any>({
        pomodoroFocus: 25,
        pomodoroShortBreak: 5,
        pomodoroLongBreak: 15,
        aiSummaryLength: "medium",
        theme: "system",
        notifications: true
    });
    const [profile, setProfile] = useState<any>({
        name: "",
        academicDetails: {
            school: "",
            grade: "",
            stream: ""
        }
    });

    useEffect(() => {
        async function fetch() {
            try {
                const res = await getSettings();
                if (res.settings) {
                    setSettings(res.settings);
                    setData({ email: res.email });
                    setProfile({
                        name: res.name || "",
                        academicDetails: {
                            school: res.academicDetails?.school || "",
                            grade: res.academicDetails?.grade || "",
                            stream: res.academicDetails?.stream || ""
                        }
                    });
                }
            } catch (err) {
                toast({ title: "Error", description: "Failed to load settings", type: "error" });
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, [toast]);

    const handleSaveSettings = async () => {
        setSaving(true);
        const res = await updateSettings(settings);
        setSaving(false);
        if (res.success) {
            toast({ title: "Success", description: "Your preferences have been saved.", type: "success" });
        } else {
            toast({ title: "Error", description: "Could not update settings.", type: "error" });
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        const res = await updateProfile(profile);
        setSaving(false);
        if (res.success) {
            toast({ title: "Profile Updated", description: "Your information is now up to date.", type: "success" });
        } else {
            toast({ title: "Update Failed", description: "Please try again later.", type: "error" });
        }
    };

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                    <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Preferences</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-10">
                <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-2">Settings</h1>
                <p className="text-slate-500 font-medium text-lg">Manage your account and app preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Lateral Navigation Sidebar */}
                <aside className="w-full lg:w-72 flex-shrink-0 space-y-2 sticky top-8">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            placeholder="Search settings..."
                            className="pl-11 h-12 rounded-2xl bg-white border-slate-100 shadow-sm focus:ring-indigo-600"
                        />
                    </div>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all group",
                                activeCategory === cat.id
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]"
                                    : "text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-md"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                                    activeCategory === cat.id ? "bg-white/20" : "bg-white group-hover:bg-indigo-50"
                                )}>
                                    <cat.icon size={20} className={cn(activeCategory === cat.id ? "text-white" : cat.color)} />
                                </div>
                                <span>{cat.label}</span>
                            </div>
                            <ChevronRight size={18} className={cn("transition-transform", activeCategory === cat.id ? "translate-x-1" : "opacity-0")} />
                        </button>
                    ))}
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 w-full min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {activeCategory === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-sm">
                                    <CardHeader className="p-10 pb-6 border-b border-slate-50">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                                                {profile.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <CardTitle className="text-3xl font-black text-slate-900">Personal Details</CardTitle>
                                                <CardDescription className="text-slate-500 font-medium">Update your public profile and identity.</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-10 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label htmlFor="name" className="text-sm font-black uppercase tracking-widest text-slate-400">Display Name</Label>
                                                <Input
                                                    id="name"
                                                    value={profile.name}
                                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-lg font-bold"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm font-black uppercase tracking-widest text-slate-400">Academic Email</Label>
                                                <Input
                                                    disabled
                                                    value={data?.email || "loading..."}
                                                    className="h-14 rounded-2xl border-slate-100 bg-slate-100/50 text-slate-400 font-bold"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-10 bg-slate-50/30 flex justify-end">
                                        <Button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="h-14 px-12 rounded-[1.5rem] bg-indigo-600 hover:bg-slate-900 text-white font-black text-lg transition-all shadow-xl shadow-indigo-100 active:scale-95"
                                        >
                                            {saving ? <Loader2 className="animate-spin mr-2" /> : <Shield className="mr-2 w-5 h-5" />}
                                            Update Profile
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}

                        {activeCategory === "academic" && (
                            <motion.div
                                key="academic"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-sm">
                                    <CardHeader className="p-10 pb-6 border-b border-slate-50">
                                        <CardTitle className="text-3xl font-black text-slate-900">Institutional Info</CardTitle>
                                        <CardDescription className="text-slate-500 font-medium">Helping us personalize your study materials.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-10 space-y-8">
                                        <div className="space-y-3">
                                            <Label className="text-sm font-black uppercase tracking-widest text-slate-400">School / University</Label>
                                            <Input
                                                value={profile.academicDetails.school}
                                                onChange={(e) => setProfile({ ...profile, academicDetails: { ...profile.academicDetails, school: e.target.value } })}
                                                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white font-bold"
                                                placeholder="e.g. Stanford University"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-black uppercase tracking-widest text-slate-400">Current Grade/Level</Label>
                                                <Input
                                                    value={profile.academicDetails.grade}
                                                    onChange={(e) => setProfile({ ...profile, academicDetails: { ...profile.academicDetails, grade: e.target.value } })}
                                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white font-bold"
                                                    placeholder="e.g. Sophomore"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-sm font-black uppercase tracking-widest text-slate-400">Major / Stream</Label>
                                                <Input
                                                    value={profile.academicDetails.stream}
                                                    onChange={(e) => setProfile({ ...profile, academicDetails: { ...profile.academicDetails, stream: e.target.value } })}
                                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white font-bold"
                                                    placeholder="e.g. Computer Science"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-10 bg-slate-50/30 flex justify-end">
                                        <Button onClick={handleSaveProfile} className="h-14 px-12 rounded-[1.5rem] bg-indigo-600 font-black">Save Institutional Info</Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}

                        {activeCategory === "timer" && (
                            <motion.div
                                key="timer"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden bg-white">
                                    <CardHeader className="p-10 pb-6">
                                        <CardTitle className="text-3xl font-black">Pomodoro Config</CardTitle>
                                        <CardDescription>Custom durations for your focus sessions.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-10 space-y-12">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                            {[
                                                { key: "pomodoroFocus", label: "Focus", color: "bg-rose-50 text-rose-600 icon-bg-rose-100" },
                                                { key: "pomodoroShortBreak", label: "Short Break", color: "bg-emerald-50 text-emerald-600 icon-bg-emerald-100" },
                                                { key: "pomodoroLongBreak", label: "Long Break", color: "bg-blue-50 text-blue-600 icon-bg-blue-100" },
                                            ].map((t) => (
                                                <div key={t.key} className="space-y-4">
                                                    <div className={cn("p-4 rounded-3xl flex flex-col items-center gap-2", t.color)}>
                                                        <Timer size={24} />
                                                        <span className="text-xs font-black uppercase tracking-tighter">{t.label}</span>
                                                    </div>
                                                    <Input
                                                        type="number"
                                                        value={settings[t.key]}
                                                        onChange={(e) => setSettings({ ...settings, [t.key]: parseInt(e.target.value) })}
                                                        className="h-14 rounded-2xl text-center text-2xl font-black border-slate-100"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-10 bg-slate-50/50 flex justify-end">
                                        <Button onClick={handleSaveSettings} className="h-14 px-12 rounded-[1.5rem] bg-rose-600 hover:bg-rose-700 text-white font-black">Update Sessions</Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}

                        {activeCategory === "ai" && (
                            <motion.div
                                key="ai"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden bg-white">
                                    <CardHeader className="p-10 pb-6">
                                        <div className="flex items-center gap-4 mb-2">
                                            <Sparkles className="text-amber-500 w-8 h-8" />
                                            <CardTitle className="text-3xl font-black">AI Intelligence</CardTitle>
                                        </div>
                                        <CardDescription>Configure how our algorithms process your notes.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-10 space-y-10">
                                        <div className="space-y-6">
                                            <Label className="text-sm font-black uppercase tracking-widest text-slate-400">Summarization Length</Label>
                                            <div className="grid grid-cols-3 gap-6">
                                                {["short", "medium", "long"].map((len) => (
                                                    <button
                                                        key={len}
                                                        onClick={() => setSettings({ ...settings, aiSummaryLength: len })}
                                                        className={cn(
                                                            "p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3",
                                                            settings.aiSummaryLength === len
                                                                ? "border-amber-500 bg-amber-50 text-amber-700 shadow-lg shadow-amber-100"
                                                                : "border-slate-50 text-slate-400 hover:border-slate-200"
                                                        )}
                                                    >
                                                        <span className="text-xl font-black capitalize">{len}</span>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-10 bg-slate-50/50 flex justify-end">
                                        <Button onClick={handleSaveSettings} className="h-14 px-12 rounded-[1.5rem] bg-slate-900 text-white font-black italic">Optimize AI Flow</Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}

                        {activeCategory === "appearance" && (
                            <motion.div
                                key="appearance"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden bg-white">
                                    <CardHeader className="p-10 pb-6">
                                        <CardTitle className="text-3xl font-black">UI & Experience</CardTitle>
                                        <CardDescription>Choose your environment's look.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-10">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {[
                                                { id: "light", label: "Light", icon: Sun, color: "text-amber-500" },
                                                { id: "dark", label: "Dark", icon: Moon, color: "text-indigo-600" },
                                                { id: "system", label: "System", icon: Monitor, color: "text-slate-600" },
                                            ].map((mode) => (
                                                <button
                                                    key={mode.id}
                                                    onClick={() => setSettings({ ...settings, theme: mode.id })}
                                                    className={cn(
                                                        "group relative p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 overflow-hidden",
                                                        settings.theme === mode.id
                                                            ? "border-indigo-600 bg-indigo-50/30 text-indigo-700 shadow-2xl"
                                                            : "border-slate-50 text-slate-400 hover:border-slate-200"
                                                    )}
                                                >
                                                    <mode.icon size={32} className={cn("transition-transform group-hover:scale-110", mode.color)} />
                                                    <span className="font-black text-sm uppercase tracking-widest">{mode.label}</span>
                                                    {settings.theme === mode.id && (
                                                        <motion.div layoutId="mode-check" className="absolute top-4 right-4">
                                                            <CheckCircle2 size={24} className="text-indigo-600" />
                                                        </motion.div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-10 bg-slate-50/50 flex justify-end">
                                        <Button onClick={handleSaveSettings} className="h-14 px-12 rounded-[1.5rem] bg-indigo-600 font-black">Apply Visuals</Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}