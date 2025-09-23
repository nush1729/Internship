export function FeatureCard({ feature }) {
  return (
    <div className="relative w-44 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 py-6 flex flex-col justify-center items-center text-center border border-gray-200">
        <div className="mb-2">{feature.icon}</div>
        <h3 className="text-gray-800 font-semibold text-sm">{feature.title}</h3>
        <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
      </div>
    </div>
  );
}