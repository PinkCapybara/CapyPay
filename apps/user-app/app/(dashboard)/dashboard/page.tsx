"use client";

import { ActionCard } from "@repo/ui/ActionCard";
import { FeatureCard } from "@repo/ui/FeatureCard";
import { actionCards } from "../../lib/actions";
import { features } from "../../lib/features";

export default function Dashboard() {
  return (
    <div className="mx-auto min-h-screen max-w-7xl overflow-y-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mt-6 mb-12 text-center">
        <h1 className="mb-4 bg-gradient-to-r from-purple-700 to-indigo-900 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Your All-in-One Payment Solution
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-600 md:text-xl">
          Send, receive, and manage money effortlessly with our secure and fast
          payment platform. Experience banking reimagined.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-20">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-800">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {actionCards.map((card, index) => (
            <ActionCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              action={card.action}
              path={card.path}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-800">
          Why Choose Our Platform
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
