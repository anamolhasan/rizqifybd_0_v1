const stats = [
  { value: "100,000+", label: "ব্যবহারকারি" },
  { value: "5M+", label: "প্রেরিত SMS" },
  { value: "99.9%", label: "সেবা আপটাইম" },
  { value: "24/7", label: "গ্রাহক সাপোর্ট" },
];

export default function StatsSection() {
  return (
    <section className="bg-slate-950 py-20 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-semibold text-sky-400">{stat.value}</p>
              <p className="mt-3 text-sm uppercase text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
