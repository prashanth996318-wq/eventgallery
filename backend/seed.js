import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from './models/User.js';
import Student from './models/Student.js';
import Album from './models/Album.js';
import Photo from './models/Photo.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event-photo-gallery';

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected. Cleaning up existing database records...');

    // Clear existing data
    await User.deleteMany();
    await Student.deleteMany();
    await Album.deleteMany();
    await Photo.deleteMany();

    console.log('Database cleared. Generating sample data...');

    // 1. Create Users (passwords will be hashed automatically by userSchema pre-save hook)
    const admin = await User.create({
      name: 'Intellitots Admin',
      email: 'admin@firstcry.com',
      password: 'admin123', // Will be hashed by pre-save
      role: 'admin',
    });

    const teacher = await User.create({
      name: 'Miss Clara Smith',
      email: 'teacher@firstcry.com',
      password: 'teacher123', // Will be hashed by pre-save
      role: 'teacher',
    });

    const parent1 = await User.create({
      name: 'Rohan Verma (Aanya\'s Parent)',
      email: 'parent1@firstcry.com',
      password: 'parent123', // Will be hashed by pre-save
      role: 'parent',
    });

    const parent2 = await User.create({
      name: 'Sunita Malhotra (Kabir\'s Parent)',
      email: 'parent2@firstcry.com',
      password: 'parent123', // Will be hashed by pre-save
      role: 'parent',
    });

    console.log('Users seeded successfully.');

    // 2. Create Students
    const student1 = await Student.create({
      name: 'Aanya Verma',
      class: 'Nursery',
      section: 'A',
      admissionNumber: 'FC1001',
      parentId: parent1._id,
      studentPhoto: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=200',
    });

    const student2 = await Student.create({
      name: 'Kabir Malhotra',
      class: 'Playgroup',
      section: 'B',
      admissionNumber: 'FC1002',
      parentId: parent2._id,
      studentPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200',
    });

    const student3 = await Student.create({
      name: 'Myra Sen',
      class: 'Nursery',
      section: 'A',
      admissionNumber: 'FC1003',
      parentId: null, // Unlinked parent initially
      studentPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
    });

    console.log('Students seeded successfully.');

    // 3. Create Albums
    const album1 = await Album.create({
      eventName: 'Sports Day Extravaganza 2026',
      eventDate: new Date('2026-02-15'),
      category: 'Sports Day',
      description: 'Annual sports activities, races, and awards ceremony at the play arena.',
      approvalStatus: 'approved',
      createdBy: teacher._id,
    });

    const album2 = await Album.create({
      eventName: 'Diwali Festival Celebrations',
      eventDate: new Date('2026-03-20'),
      category: 'Festival Celebrations',
      description: 'Traditional outfit display, clay lamp lighting, and rangoli artwork drawing.',
      approvalStatus: 'approved',
      createdBy: teacher._id,
    });

    const album3 = await Album.create({
      eventName: 'Creative Art Day Display',
      eventDate: new Date('2026-04-10'),
      category: 'Art Day',
      description: 'Hand painting and clay sculpting session showcasing toddler creativity.',
      approvalStatus: 'pending',
      createdBy: teacher._id,
    });

    console.log('Albums seeded successfully.');

    // 4. Create Photos
    // Sports Day photos
    await Photo.create({
      albumId: album1._id,
      imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800',
      taggedStudents: [student1._id], // Aanya tagged
      uploadedBy: teacher._id,
    });

    await Photo.create({
      albumId: album1._id,
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800',
      taggedStudents: [student2._id], // Kabir tagged
      uploadedBy: teacher._id,
    });

    await Photo.create({
      albumId: album1._id,
      imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=800',
      taggedStudents: [student1._id, student2._id], // Both tagged
      uploadedBy: teacher._id,
    });

    // Diwali Celebrations photos
    await Photo.create({
      albumId: album2._id,
      imageUrl: 'https://images.unsplash.com/photo-1514894780887-121968d00567?q=80&w=800',
      taggedStudents: [student1._id], // Aanya tagged
      uploadedBy: teacher._id,
    });

    await Photo.create({
      albumId: album2._id,
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800',
      taggedStudents: [], // General Photo, no tags
      uploadedBy: teacher._id,
    });

    // Art Day photos (Pending album)
    await Photo.create({
      albumId: album3._id,
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800',
      taggedStudents: [student3._id], // Myra tagged
      uploadedBy: teacher._id,
    });

    console.log('Photos seeded successfully.');
    console.log('All sample data successfully seeded to MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding process failed:', error);
    process.exit(1);
  }
};

seedData();
