const features = [
  {
    title: "MB রিচার্জ",
    description: "দ্রুত ও নিরাপদভাবে গ্রাহকের ইন্টারনেট প্যাকেজ রিচার্জ করুন।",
  },
  {
    title: "মিনিট রিচার্জ",
    description: "ভয়েস প্যাক ও মিনিট প্ল্যান সহজেই ম্যানেজ করুন।",
  },
  {
    title: "SMS সেবা",
    description: "ব্যবসায়িক SMS পাঠান এবং গ্রাহকের নোটিফিকেশন ট্র্যাক করুন।",
  },
  {
    title: "Utility bill প্রদান",
    description: "বিদ্যুৎ, পানি ও ইন্টারনেট বিল প্রদানের সেবা সরাসরি অর্ডার করুন।",
  },
  {
    title: "টিকিট সাপোর্ট",
    description: "গ্রাহক সমস্যার দ্রুত সমাধানের জন্য টিকিট ব্যবস্থা সরবরাহ করুন।",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-slate-950 py-20 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
            আমাদের সেবা
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            MB, মিনিট, SMS, utility bill ও ticket — এক প্ল্যাটফর্মে
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-400">
            আপনার ব্যবসার সব টেলিকম সেবা একসাথে ম্যানেজ করুন, কোন বাহ্যিক API provider ছাড়াই।
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300">সেবা</p>
              <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
