"use client";
import { Button } from "@repo/ui/button";
import { redirect } from "next/navigation";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          404 - Page Not Found
        </h1>
        <p className="mb-6 text-gray-600">
          The page you&#39;re looking for doesn&#39;t exist or has been moved.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <div>
            <Button
              onClick={() => {
                redirect("/");
              }}
            >
              Go Back Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
