import Image from "next/image";
import RegisterForm from "./components/registerForm";
import Link from "next/link";

export default function Home() {
  return (

    <main className="flex min-h-dvh items-center max-lg:flex-col justify-center lg:justify-around px-16 pt-36 pb-16">
      <div className="max-lg:mb-6 xl:w-1/2 prose text-pretty text-base-content group">
        <h1 className="font-bold text-2xl mb-8">
          Welcome to SGip <span className="inline-block group-hover:animate-wiggle">🦁 </span> <br /> &mdash; an online Buddhist practice group, dedicated to the teachings of Nichiren Daishonin.
        </h1>
        <h2 className="group-hover:underline font-light text-xl mb-8">
          The purpose of this group is to provide an open and inclusive community to facilitate the propagation of Nam-Myoho-Renge-Kyo in the Latter Day of the law.
        </h2>
        <h3 className="group-hover:underline font-light text-xl">
          Each of us possesses an inherent Buddha nature awaiting to be realized to its fullest potential. As such we hope to encourage the propagation of Nichiren's Daimoku for this purpose.
        </h3>
      </div>
      <div className="divider lg:divider-horizontal max-lg:mb-10" />
      <RegisterForm />
    </main>
  );
}
