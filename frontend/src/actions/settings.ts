"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function getSettings() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectDB();
    const user = await User.findById(session.user.id).select("settings academicDetails name email");

    if (!user) return { error: "User not found" };

    // Ensure default settings if they don't exist
    if (!user.settings) {
        user.settings = {
            pomodoroFocus: 25,
            pomodoroShortBreak: 5,
            pomodoroLongBreak: 15,
            aiSummaryLength: "medium",
            theme: "system",
            notifications: true
        };
        await user.save();
    }

    return {
        settings: JSON.parse(JSON.stringify(user.settings)),
        academicDetails: JSON.parse(JSON.stringify(user.academicDetails || {})),
        name: user.name,
        email: user.email
    };
}

export async function updateSettings(settings: any) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectDB();

    try {
        await User.findByIdAndUpdate(session.user.id, {
            $set: { settings }
        });
        revalidatePath("/dashboard/settings");
        return { success: "Settings updated successfully" };
    } catch (error) {
        console.error("Update Settings Error:", error);
        return { error: "Failed to update settings" };
    }
}

export async function updateProfile(data: { name: string, academicDetails: any }) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await connectDB();

    try {
        await User.findByIdAndUpdate(session.user.id, {
            $set: {
                name: data.name,
                academicDetails: data.academicDetails
            }
        });
        revalidatePath("/dashboard/settings");
        revalidatePath("/dashboard/profile");
        return { success: "Profile updated successfully" };
    } catch (error) {
        console.error("Update Profile Error:", error);
        return { error: "Failed to update profile" };
    }
}
