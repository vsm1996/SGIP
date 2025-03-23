import 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
      firstName?: string;
      lastName?: string;
      username?: string;
    };
    sub: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string | null;
    firstName?: string;
    lastName?: string;
    username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    email: string;
    image: string | null;
    firstName?: string;
    lastName?: string;
    username?: string;
  }
}