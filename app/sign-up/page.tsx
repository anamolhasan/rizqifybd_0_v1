import { SigninForm } from "@/components/forms/SigninForm";

export const metadata = {
  title: "Sign Up | Telecom App",
  description: "Create a new telecom account",
};

export default function SigninPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        <SigninForm />
      </div>
    </div>
  );
}
