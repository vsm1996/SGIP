import Image from "next/image";
import RegisterForm from "./components/registerForm";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-w-dvw min-h-dvh items-center justify-center prose prose-slate lg:prose-md max-lg:flex-col px-16 pt-36 pb-16">
      <div className="max-lg:mb-6 xl:w-1/2 w-full text-pretty text-base-content group">
        <h1 className=" mb-8">Welcome to SGip <span className="inline-block group-hover:animate-wiggle">🦁 </span>
          <br /> — an online Buddhist practice group, dedicated to the teachings of Nichiren Daishonin.
        </h1>
        <h2 className="group-hover:underline mb-8">
          The purpose of this group is to provide an open and inclusive community to facilitate the propagation of Nam-Myoho-Renge-Kyo in the Latter Day of the law.
        </h2>
        <h3 className="group-hover:underline">
          Each of us possesses an inherent Buddha nature awaiting to be realized to its fullest potential. As such we hope to encourage the propagation of Nichiren's Daimoku for this purpose.
        </h3>
      </div>
      <div className="divider lg:divider-horizontal max-lg:mb-10" />
      <RegisterForm />
    </main>
  );
}