const testimonials = [
  {
    quote: "RizqifyBD-এ আমাদের SMS ও রিচার্জ সেবা দ্রুত এবং ঝামেলাহীন হয়েছে।",
    name: "মোহসীন আলম",
    role: "ব্যবসা উন্নয়ন, টেলিসার্ভ",
  },
  {
    quote: "আমরা utility bill ও ticket দ্রুতভাবে পরিচালনা করতে পেরেছি, আর কোনো বাহ্যিক API provider দরকার হয় না।",
    name: "সাইফুল ইসলাম",
    role: "সেবা ব্যবস্থাপক, নেটলাইন",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-slate-950 py-20 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            গ্রাহকদের মতামত
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            যারা RizqifyBD ব্যবহার করছে, তাদের কথায়।
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg shadow-slate-950/20">
              <p className="text-base leading-7 text-slate-300">“{testimonial.quote}”</p>
              <div className="mt-6">
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-slate-400">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
