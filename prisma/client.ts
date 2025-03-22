// Custom Prisma client implementation that works with Yarn PnP
import { PrismaClient } from '@prisma/client';

// Define a type for the global object with our Prisma client
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton function that initializes the Prisma client
const prismaClientSingleton = async () => {
  try {
    // Create a new PrismaClient instance with connection handling
    const prisma = new PrismaClient({
      log: ['error', 'warn'],
      errorFormat: 'pretty'
    });

    // Test the connection
    await prisma.$connect();
    return prisma;
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    throw error;
  }
};

// Initialize the client if it doesn't exist in the global object
let prismaPromise: Promise<PrismaClient>;

if (!globalThis.prisma) {
  prismaPromise = prismaClientSingleton().then(client => {
    // Store the client in the global object for reuse
    globalThis.prisma = client;
    return client;
  }).catch(error => {
    console.error('Error initializing Prisma client:', error);
    throw error;
  });
} else {
  // If we already have a client instance in the global object, use it
  prismaPromise = Promise.resolve(globalThis.prisma);
}

// Export the promise that resolves to the Prisma client
export default await prismaPromise;