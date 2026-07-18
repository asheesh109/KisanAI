import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { User as UserIcon, Settings, Bell, Leaf } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await dbConnect();
  
  // Fetch detailed user info
  const user = await User.findById(session.user.id).lean();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-6 py-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-100 dark:bg-gray-700 p-4 rounded-full">
              <UserIcon className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.name}!
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email} &bull; Role: {user.role}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-6 py-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Settings className="h-6 w-6 text-emerald-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Preferences</h2>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400 block">Default Location</span>
                <span className="font-medium dark:text-white">{user.preferences?.location || "Not set"}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400 block">Preferred Language</span>
                <span className="font-medium dark:text-white uppercase">{user.preferences?.language || "EN"}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400 block">Interested Crops</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.preferences?.crops && user.preferences.crops.length > 0 ? (
                    user.preferences.crops.map((crop, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-medium">
                        {crop}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No crops saved</span>
                  )}
                </div>
              </div>
              <button className="mt-4 w-full text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 py-2 rounded-md transition-colors">
                Edit Preferences
              </button>
            </div>
          </div>

          {/* Saved Alerts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-6 py-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Bell className="h-6 w-6 text-emerald-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Alerts</h2>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {user.savedAlerts?.length || 0} Total
              </span>
            </div>
            
            {user.savedAlerts && user.savedAlerts.length > 0 ? (
              <div className="space-y-3">
                {user.savedAlerts.slice(0, 3).map((alert, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <p className="font-semibold text-sm dark:text-white">{alert.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(alert.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Leaf className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No alerts saved yet.</p>
              </div>
            )}
            
            <button className="mt-4 w-full text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 py-2 rounded-md transition-colors">
              View All Alerts
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
