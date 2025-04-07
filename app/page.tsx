import Image from "next/image";
import RegisterForm from "./components/registerForm";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-w-dvw min-h-dvh items-center justify-center max-lg:flex-col px-8 md:px-16 py-16 bg-gradient-to-b from-base-300 to-base-100">
      <div className="max-lg:mb-10 xl:w-1/2  text-pretty text-neutral-content group backdrop-blur-sm bg-neutral/25 backdrop-opacity-10 p-8 rounded-xl shadow-lg border border-neutral animate-fade-in  hover:bg-neutral/40 transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
            <span className="inline-block h-2/3 text-3xl group-hover:animate-wiggle">🦁</span>
          </div>
          <h1 className="text-4xl font-bold text-primary">
            Welcome to SGip
          </h1>
        </div>

        <div className="prose prose-slate lg:prose-lg">
          <h2 className="mb-6 text-xl font-medium leading-relaxed">
            An online Buddhist practice group, dedicated to the teachings of Nichiren Daishonin.
          </h2>

          <p className="mb-6 group-hover:text-neutral-content/60 transition-all duration-300">
            The purpose of this group is to provide an open and inclusive community to facilitate the propagation of Nam-Myoho-Renge-Kyo in the Latter Day of the law.
          </p>

          <p className="group-hover:text-neutral-content/60 transition-all duration-300">
            Each of us possesses an inherent Buddha nature awaiting to be realized to its fullest potential. As such we hope to encourage the propagation of Nichiren's Daimoku for this purpose.
          </p>
        </div>
      </div>

      <div className="divider lg:divider-horizontal max-lg:my-8 animate-fade-in-up" />

      <div className="w-full xl:w-1/2 animate-fade-in-right">
        <RegisterForm />
      </div>
    </main>
  );
}
