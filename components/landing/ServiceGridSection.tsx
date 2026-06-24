const services = [
  {
    title: "MB রিচার্জ",
    description: "দ্রুত এবং নিরাপদভাবে ইন্টারনেট প্যাক চালু করুন।",
  },
  {
    title: "মিনিট রিচার্জ",
    description: "ভয়েস প্যাক ও মিনিট প্ল্যান সহজেই সংরক্ষণ করুন।",
  },
  {
    title: "SMS প্যাক",
    description: "ব্যবসায়িক ও গ্রাহক নোটিফিকেশন SMS পাঠান।",
  },
  {
    title: "Utility bill",
    description: "বিদ্যুৎ, পানি, গ্যাস ও ইন্টারনেট বিল পরিশোধ করুন।",
  },
  {
    title: "টিকিট সাপোর্ট",
    description: "গ্রাহকের সমস্যার দ্রুত সমাধানের জন্য টিকিট পরিচালনা করুন।",
  },
  {
    title: "অফার ম্যানেজ",
    description: "নিজের অফার তৈরি করে গ্রাহককে আকর্ষণ করুন।",
  },
];

export default function ServiceGridSection() {
  return (
    <section id="services" className="bg-slate-950 py-20 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
            আমাদের সেবা
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            এক প্ল্যাটফর্মে MB, মিনিট, SMS, utility bill ও ticket
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-400">
            RizqifyBD-তে সব টেলিকম সেবা আপনার ব্যবসার জন্য একত্রিত করা হয়েছে।
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40 transition duration-300 hover:-translate-y-1 hover:border-sky-500/50">
              <p className="text-sm uppercase tracking-[0.25em] text-sky-300">সেবা</p>
              <h3 className="mt-4 text-xl font-semibold text-white">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
