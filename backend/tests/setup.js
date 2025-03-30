const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { beforeAll, afterEach, afterAll } = require('@jest/globals');

let mongoServer;

// Setup before all tests - increased timeout
beforeAll(async () => {
  try {
    // Increase timeout for MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create({
      instance: {
        args: ['--setParameter', 'enableTestCommands=1'],
        debug: true,
        ipFamily: 4 // Use IPv4 explicitly
      }
    });
    
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log('Connected to the in-memory database');
  } catch (error) {
    console.error('Failed to start MongoDB Memory Server:', error);
    // Provide a fallback to prevent undefined mongoServer
    if (!mongoServer) {
      throw new Error('Failed to initialize MongoDB Memory Server');
    }
  }
}, 30000); // 30 second timeout

// Clear database between tests
afterEach(async () => {
  if (mongoose.connection) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}, 10000); // 10 second timeout

// Teardown after all tests
afterAll(async () => {
  if (mongoose.connection) {
    await mongoose.disconnect();
    console.log('Disconnected from the in-memory database');
  }
  
  if (mongoServer) {
    await mongoServer.stop();
    console.log('Stopped MongoDB Memory Server');
  }
}, 30000); // 30 second timeout