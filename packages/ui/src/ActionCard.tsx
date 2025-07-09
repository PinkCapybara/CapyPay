import { Button } from "./button";
import { redirect } from "next/navigation";

export const ActionCard = ({ icon, title, description, action, path }: any) => {
  return (
    <div className="bg-white rounded-xl shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="p-6">
        <div className="flex justify-center mb-4">
          <div className="bg-purple-100 p-4 rounded-full text-purple-700">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
          {title}
        </h3>
        <div className="text-gray-600 text-center mb-6">{description}</div>
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
