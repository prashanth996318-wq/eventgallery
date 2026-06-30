import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Quick inline seeder for in-memory DB
import User from '../models/User.js';
import Student from '../models/Student.js';

const seedInMemoryDB = async () => {
  console.log('Seeding in-memory database...');
  
  // Admin
  await User.create({
    name: 'Intellitots Admin',
    email: 'admin@firstcry.com',
    password: 'admin123',
    role: 'admin',
  });
  
  // Teacher
  await User.create({
    name: 'Miss Clara Smith',
    email: 'teacher@firstcry.com',
    password: 'teacher123',
    role: 'teacher',
  });

  // Parent 1 (Aanya's Parent)
  await User.create({
    name: 'Rohan Verma',
    email: 'parent1@firstcry.com',
    password: 'parent123',
    role: 'parent',
  });

  // Parent 2 (Kabir's Parent)
  await User.create({
    name: 'Sunita Malhotra',
    email: 'parent2@firstcry.com',
    password: 'parent123',
    role: 'parent',
  });

  console.log('✅ Users created: admin@firstcry.com | teacher@firstcry.com | parent1@firstcry.com | parent2@firstcry.com (all passwords end in 123)');
};

const connectDB = async () => {
  try {
    // 1. First try connecting to the regular URI
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event-photo-gallery',
      { serverSelectionTimeoutMS: 2000 }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('⚠️ Could not connect to regular MongoDB. Setting up In-Memory database...');
    
    // 2. If it fails, spin up an in-memory database
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`🚀 In-Memory MongoDB Connected at ${mongoUri}`);
      console.log('   (Note: Data will be lost when you restart the server)');
      
      // Automatically seed when using in-memory so you can log in
      await seedInMemoryDB();
    } catch (inMemError) {
      console.error('❌ Failed to start In-Memory MongoDB:', inMemError.message);
      process.exitCode = 1;
    }
  }
};

export default connectDB;
