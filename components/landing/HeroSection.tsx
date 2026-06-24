import Link from "next/link";

export default function HeroSection() {
  return (
    <section className=" text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-20 lg:flex-row lg:items-center lg:px-8">
        <div className="max-w-2xl space-y-8">
          <span className="inline-flex rounded-full bg-sky-500/10 px-4 py-1 text-sm font-semibold text-sky-300 leading-5">
            সততায় ব্যবসার মূলধন
          </span>
          <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl ">
            RizqifyBD - তে আপনার পার্ট টাইম উপার্জন
            <span className="text-sky-400"> এখনই শুরু করুন।</span>
          </h1>
          <p className="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            আমাদের লক্ষ্য: দ্রুত এবং নির্ভরযোগ্য MB, মিনিট, SMS, utility bill ও ticket সেবা প্রদান করা।
            এখানে কোনো তৃতীয় পক্ষের API provider নেই — সবকিছুই আপনাদের খেদমতের জন্য নির্মিত।
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              সাইন আপ করুন
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-8 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
            >
              লগ ইন করুন
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:mx-0">
          <div className="absolute inset-x-0 top-12 h-52 rounded-[2rem] bg-sky-500/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/20">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-center transition duration-500 hover:-translate-y-1 hover:border-sky-500/50">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">১</p>
                <h3 className="mt-4 text-lg font-semibold text-white">আপনার অ্যাকাউন্ট</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">ব্যবহারকারীর তথ্য ও ব্যালান্স ম্যানেজ করুন।</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-center transition duration-500 hover:-translate-y-1 hover:border-sky-500/50">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">২</p>
                <h3 className="mt-4 text-lg font-semibold text-white">RizqifyBD API</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">সহজ ইন্টিগ্রেশন, প্যানেল ভুমি-উপযোগী।</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-center transition duration-500 hover:-translate-y-1 hover:border-sky-500/50">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">৩</p>
                <h3 className="mt-4 text-lg font-semibold text-white">SIM কোম্পানি</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">বিভিন্ন অপারেটরের সঙ্গে সিম সংযোগ।</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-center transition duration-500 hover:-translate-y-1 hover:border-sky-500/50">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">৪</p>
                <h3 className="mt-4 text-lg font-semibold text-white">আপনার অফার</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">প্ল্যান তৈরি করে গ্রাহকদের সেরা অফার দিন।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
