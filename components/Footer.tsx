import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-white">
              RizqifyBD
            </Link>
            <p className="max-w-sm text-sm leading-6 text-slate-400">
              MB, মিনিট, SMS, utility bill ও ticket সেবা সরাসরি আপনার ব্যবসার জন্য।
            </p>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              সেবা
            </p>
            <div className="space-y-3 text-sm text-slate-300">
              <Link href="#services" className="block hover:text-white">
                MB রিচার্জ
              </Link>
              <Link href="#features" className="block hover:text-white">
                utility bill
              </Link>
              <Link href="#faq" className="block hover:text-white">
                টিকিট সাপোর্ট
              </Link>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              কোম্পানি
            </p>
            <div className="space-y-3 text-sm text-slate-300">
              <Link href="/" className="block hover:text-white">
                হোম
              </Link>
              <Link href="/register" className="block hover:text-white">
                লগ ইন
              </Link>
              <Link href="/sign-up" className="block hover:text-white">
                সাইন আপ
              </Link>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              যোগাযোগ
            </p>
            <div className="space-y-3 text-sm text-slate-300">
              <p>info@rizqifybd.com</p>
              <p>+880 1607 950556</p>
              <p>ব্রাহ্মণবাড়িয়া, বাংলাদেশ</p>
            </div>
          </div> 
        </div>

        <div className="mt-10 border-t border-slate-800/70 pt-6 text-sm text-slate-500 sm:flex sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RizqifyBD. সর্বস্বত্ব সংরক্ষিত আলেমদের দারা পরিচালিত একটি কমিউনিটি।</p>
          <p>সর্বশেষ আপডেট ২০২৬</p>
        </div>
      </div>
    </footer>
  );
}
