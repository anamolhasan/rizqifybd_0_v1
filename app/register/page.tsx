import { LoginForm } from "@/components/forms/LoginForm";

export const metadata = {
  title: "Login | Telecom App",
  description: "Login to your telecom account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
