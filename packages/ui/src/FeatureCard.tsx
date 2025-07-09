export const FeatureCard = ({ icon, title, description }: any) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full transform transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="bg-purple-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center text-purple-700 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
    </div>
  );
};
