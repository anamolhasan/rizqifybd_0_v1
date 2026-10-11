
const stats = [
  { value: "100,000+", label: "ব্যবহারকারী", detail: "আপনার ডিজিটাল যাত্রা" },
  { value: "5M+", label: "প্রেরিত SMS", detail: "দ্রুত যোগাযোগ ব্যবস্থা" },
  { value: "99.9%", label: "সেবা আপটাইম", detail: "নির্ভরযোগ্য অভিজ্ঞতা" },
  { value: "24/7", label: "গ্রাহক সাপোর্ট", detail: "সহায়তা যখনই প্রয়োজন" },
];

export default function StatsSection() {
  return (
    <section className="relative isolate overflow-hidden bg-background py-16 sm:py-20">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 size-80 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats glass panel */}
        <div className="relative isolate overflow-hidden rounded-3xl border border-white/80 bg-white/55 p-6 shadow-xl shadow-primary/[0.05] backdrop-blur-2xl sm:p-8 lg:p-10">
          {/* Decorative gradient */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 -z-10 size-64 rounded-full bg-emerald-200/30 blur-[80px]"
          />

          <div className="grid grid-cols-1 divide-y divide-primary/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`group relative flex flex-col items-center px-4 py-7 text-center transition-all duration-300 sm:px-5 lg:py-5 ${
                  index >= 2 ? "lg:border-l-0" : ""
                }`}
              >
                {/* Number glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/0 blur-2xl transition-colors duration-500 group-hover:bg-primary/10"
                />

                <p className="bg-gradient-to-r from-primary via-emerald-600 to-teal-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent transition-transform duration-300 group-hover:-translate-y-1 sm:text-4xl lg:text-[2.5rem]">
                  {stat.value}
                </p>

                <p className="mt-3 text-sm font-bold text-foreground sm:text-base">
                  {stat.label}
                </p>

                <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                  {stat.detail}
                </p>

                {/* Bottom accent */}
                <div className="mt-5 h-0.5 w-8 rounded-full bg-primary/20 transition-all duration-300 group-hover:w-14 group-hover:bg-primary/70" />
              </div>
            ))}
          </div>

          {/* Bottom border accent */}
          <div
            aria-hidden="true"
            className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />
        </div>
      </div>
    </section>
  );
}