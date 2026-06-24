import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-slate-950 py-20 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-10 text-center shadow-xl shadow-slate-950/20 sm:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
            এখনই শুরু করুন
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            MB, মিনিট, SMS, utility bill ও ticket সেবা দিন সরাসরি আপনার ব্যবসায়
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400">
            RizqifyBD ব্যবহার করে আপনার গ্রাহকসেবা উন্নত করুন, কোনো বাহ্যিক API provider ছাড়াই।
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              সাইন আপ করুন
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-400"
            >
              লগ ইন করুন
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
