"use client";

import { ActionCard } from "@repo/ui/ActionCard";
import { FeatureCard } from "@repo/ui/FeatureCard";
import { Button } from "@repo/ui/button";
import { actionCards } from "../../lib/actions";
import { features } from "../../lib/features";

export default function Dashboard() {
  return (
    <div className="min-h-screen overflow-y-auto max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 mt-6">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-900 mb-4">
          Your All-in-One Payment Solution
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Send, receive, and manage money effortlessly with our secure and fast
          payment platform. Experience banking reimagined.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Why Choose Our Platform
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
