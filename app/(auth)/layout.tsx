import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { BrandLogo } from "@/components/auth/BrandLogo";
import { ModeToggle } from "@/components/theme/ModeToggle";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AuthBrandPanel />

      <div className="flex w-full flex-col lg:w-1/2 xl:w-[45%]">
        <header className="flex items-center justify-end gap-3 p-6 lg:justify-between">
          <BrandLogo className="lg:hidden" />
          <ModeToggle />
        </header>

        <div className="flex flex-1 items-center justify-center px-6 pb-10 lg:px-10">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <footer className="p-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} RizqifyBD. সর্বস্বত্ব সংরক্ষিত।
        </footer>
      </div>
    </div>
  );
}
