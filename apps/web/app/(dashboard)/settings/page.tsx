import { Settings, Bell, Palette, Key, User } from "lucide-react";

export const metadata = { title: "Settings – RNDR" };

const settingsSections = [
  {
    icon: User,
    title: "Profile",
    description: "Manage your account details and preferences.",
    status: "Coming soon",
  },
  {
    icon: Key,
    title: "API Keys",
    description: "Configure your own API keys for different providers.",
    status: "Coming soon",
  },
  {
    icon: Palette,
    title: "Appearance",
    description: "Customize the look and feel of your studio.",
    status: "Coming soon",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Control how and when you receive updates.",
    status: "Coming soon",
  },
];

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8 bg-bg-deep min-h-full">
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-text-primary mb-2">Settings</h1>
          <p className="text-text-muted">Configure your RNDR experience.</p>
        </div>
        
        <div className="space-y-4">
          {settingsSections.map((section) => (
            <div
              key={section.title}
              className="card p-5 flex items-start gap-4 opacity-60 cursor-not-allowed"
            >
              <div className="w-10 h-10 rounded-xl bg-bg-surface border border-border flex items-center justify-center shrink-0">
                <section.icon className="w-5 h-5 text-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-medium text-text-primary">{section.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-bg-surface border border-border text-text-muted">
                    {section.status}
                  </span>
                </div>
                <p className="text-sm text-text-muted">{section.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
