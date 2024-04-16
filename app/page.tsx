import Image from "next/image";
import RegisterForm from "./components/registerForm";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex  min-h-dvh items-center max-lg:flex-col justify-center lg:justify-around px-16 pt-36 pb-16">
      <div className="max-lg:mb-6 prose">
        <h1>SGip 🦁</h1>
        <h3> Welcome in! </h3>
      </div>
      <div className="divider lg:divider-horizontal max-lg:mb-10" />
      <RegisterForm />
    </main>
  );
}
