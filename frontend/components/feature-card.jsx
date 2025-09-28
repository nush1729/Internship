export function FeatureCard({ feature }) {
  return (
    <div className="relative w-full h-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 hover:border-blue-300 hover:-translate-y-1 rounded-xl p-8 flex flex-col items-start">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100 border border-blue-200 mb-5">
        {feature.icon}
      </div>
      <h3 className="text-slate-800 font-semibold text-lg mb-2">{feature.title}</h3>
      <p className="text-base text-slate-600 mt-1">{feature.description}</p>
    </div>
  );
}