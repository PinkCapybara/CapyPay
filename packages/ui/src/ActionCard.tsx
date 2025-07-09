import { Button } from "./button";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface ActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  action: string;
  path: string;
}

export const ActionCard = ({
  icon,
  title,
  description,
  action,
  path,
}: ActionCardProps) => {
  return (
    <div className="transform rounded-xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="p-6">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-purple-100 p-4 text-purple-700">
            {icon}
          </div>
        </div>
        <h3 className="mb-2 text-center text-xl font-bold text-gray-800">
          {title}
        </h3>
        <div className="mb-6 text-center text-gray-600">{description}</div>
        {/* <button onClick={()=> {redirect(path)}} className="w-full bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-2 rounded-lg font-medium hover:cursor-pointer">
          {action}
        </button> */}
        <div className="flex justify-center">
          <Button
            onClick={() => {
              redirect(path);
            }}
            className="bg-gradient-to-r from-purple-700 to-indigo-800"
          >
            {action}
          </Button>
        </div>
      </div>
    </div>
  );
};
