import Image from "next/image";
import RegisterForm from "./components/registerForm";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="mb-9">
        Eat, Sleep, Chant, Repeat
      </div>
      <RegisterForm />
    </main>
  );
}
