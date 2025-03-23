// Custom Prisma client for PartyKit that works with Yarn PnP
// Using dynamic import to avoid direct dependency on @prisma/client

// Define a type for the global object with our Prisma client
declare global {
  var prismaClient: any | undefined;
}

// This function will be used to get the Prisma client instance
export async function getPrismaClient() {
  try {
    // If we already have a client instance in the global object, return it
    if (globalThis.prismaClient) {
      try {
        // Test the connection before returning the cached client
        await globalThis.prismaClient.$connect();
        return globalThis.prismaClient;
      } catch (error) {
        console.warn('Cached client connection failed, creating new instance');
        // Connection failed, clear the cached client
        globalThis.prismaClient = undefined;
      }
    }

    // Dynamically import PrismaClient to avoid Yarn PnP issues
    const { PrismaClient } = await import('@prisma/client');

    // Create a new PrismaClient instance with logging and datasources config
    const prisma = new PrismaClient({
      log: ['error', 'warn'],
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });

    // Test the connection
    await prisma.$connect();

    // Store the client in the global object for reuse
    globalThis.prismaClient = prisma;

    return prisma;
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    throw new Error('Could not initialize Prisma client');
  }
}