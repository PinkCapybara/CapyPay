export const FeatureCard = ({ icon, title, description }: any) => {
  return (
    <div className="flex h-full transform flex-col rounded-xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 p-3 text-purple-700">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-gray-800">{title}</h3>
      <p className="flex-grow text-gray-600">{description}</p>
    </div>
  );
};
