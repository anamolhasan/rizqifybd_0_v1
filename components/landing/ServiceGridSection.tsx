
import {
  Wifi,
  PhoneCall,
  MessageSquareText,
  ReceiptText,
  TicketCheck,
  Layers3,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    title: "MB রিচার্জ",
    description: "দ্রুত ও নিরাপদভাবে ইন্টারনেট প্যাক চালু করুন।",
    icon: Wifi,
    tag: "Internet",
  },
  {
    title: "মিনিট রিচার্জ",
    description: "ভয়েস প্যাক ও মিনিট প্ল্যান সহজেই পরিচালনা করুন।",
    icon: PhoneCall,
    tag: "Voice",
  },
  {
    title: "SMS প্যাক",
    description: "ব্যক্তিগত ও ব্যবসায়িক প্রয়োজনে SMS প্যাক ব্যবহার করুন।",
    icon: MessageSquareText,
    tag: "Messaging",
  },
  {
    title: "Utility Bill",
    description: "বিদ্যুৎ, পানি, গ্যাসসহ বিভিন্ন ইউটিলিটি বিল পরিশোধ করুন।",
    icon: ReceiptText,
    tag: "Payments",
  },
  {
    title: "টিকিট সাপোর্ট",
    description: "সাপোর্ট টিকিটের মাধ্যমে গ্রাহকের সমস্যার সমাধান করুন।",
    icon: TicketCheck,
    tag: "Support",
  },
  {
    title: "অফার ম্যানেজমেন্ট",
    description: "টেলিকম অফার পরিচালনা করুন এবং গ্রাহকদের কাছে পৌঁছে দিন।",
    icon: Layers3,
    tag: "Management",
  },
];

export default function ServiceGridSection() {
  return (
    <section
      id="services"
      className="relative isolate overflow-hidden bg-background py-16 sm:py-20 lg:py-28"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 -z-10 size-80 rounded-full bg-emerald-300/20 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 size-96 rounded-full bg-teal-200/25 blur-[110px]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-xl">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/40 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            আমাদের সেবাসমূহ
          </div>

          <h2 className="mt-6 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            আপনার সব সেবা,
            <span className="mt-2 block bg-gradient-to-r from-primary via-emerald-600 to-teal-500 bg-clip-text text-transparent">
              একটি প্ল্যাটফর্মে
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            রিচার্জ থেকে বিল পেমেন্ট—RizqifyBD-এর সহজ ও নির্ভরযোগ্য
            সেবাগুলোর মাধ্যমে আপনার ডিজিটাল ব্যবসা পরিচালনা করুন।
          </p>
        </div>

        {/* Services grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="group relative flex min-h-[245px] flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/55 p-6 shadow-lg shadow-primary/[0.04] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:bg-white/70 hover:shadow-xl hover:shadow-primary/[0.09] sm:rounded-3xl sm:p-7"
              >
                {/* Card ambient blur */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/0 blur-3xl transition-colors duration-500 group-hover:bg-primary/15"
                />

                {/* Decorative number */}
                <span className="pointer-events-none absolute right-5 top-4 select-none text-4xl font-bold tabular-nums text-primary/[0.07] transition-colors duration-300 group-hover:text-primary/[0.13]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Card top */}
                <div className="relative flex items-start justify-between gap-4">
                  <div className="grid size-14 place-items-center rounded-2xl border border-primary/15 bg-primary/[0.08] text-primary transition-all duration-300 group-hover:border-primary/25 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20">
                    <Icon
                      size={25}
                      strokeWidth={1.7}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  <span className="relative z-10 rounded-full border border-primary/10 bg-white/65 px-3 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground backdrop-blur-md">
                    {service.tag}
                  </span>
                </div>

                {/* Card content */}
                <div className="relative mt-6 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-xl">
                      {service.title}
                    </h3>

                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100"
                    />
                  </div>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {service.description}
                  </p>
                </div>

                {/* Card footer */}
                <div className="relative mt-6 flex items-center justify-between border-t border-primary/10 pt-4">
                  <span className="rounded-full bg-white/40 px-2 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md">
                    RizqifyBD Services
                  </span>

                  <span className="flex size-9 items-center justify-center rounded-full border border-primary/15 bg-white/70 text-primary shadow-sm backdrop-blur-md transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/20">
                    <ArrowUpRight
                      size={17}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>

                {/* Bottom accent */}
                <div className="absolute inset-x-8 bottom-0 h-0.5 origin-center scale-x-0 rounded-full bg-gradient-to-r from-transparent via-primary/70 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              </article>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:mt-12">
          {[
            "সহজ ব্যবহার",
            "এক প্ল্যাটফর্মে একাধিক সেবা",
            "ব্যবসাবান্ধব অভিজ্ঞতা",
          ].map((item) => (
            <div
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur-lg"
            >
              <CheckCircle2 size={16} className="shrink-0 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}