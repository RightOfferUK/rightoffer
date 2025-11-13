#!/usr/bin/env ts-node
/**
 * Script to create a new admin user in the database
 * Usage: npx ts-node scripts/createAdminUser.ts
 */

import mongoose from 'mongoose';
import User from '../src/models/User';

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env') });

const ADMIN_EMAIL = 'sidkheria@gmail.com';

async function createAdminUser() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Check if admin user already exists
    const existingUser = await User.findOne({ email: ADMIN_EMAIL });
    
    if (existingUser) {
      console.log(`\n⚠️  User with email ${ADMIN_EMAIL} already exists:`);
      console.log(`   Role: ${existingUser.role}`);
      console.log(`   Active: ${existingUser.isActive}`);
      console.log(`   Created: ${existingUser.createdAt}`);
      
      // If user exists but is not an admin, offer to update
      if (existingUser.role !== 'admin') {
        console.log(`\n   Current role is "${existingUser.role}". Updating to "admin"...`);
        existingUser.role = 'admin';
        existingUser.isActive = true;
        await existingUser.save();
        console.log('✓ User updated to admin role successfully!');
      } else {
        console.log('\n   User is already an admin. No action needed.');
      }
    } else {
      // Create new admin user
      console.log(`\nCreating new admin user: ${ADMIN_EMAIL}`);
      
      const newAdmin = new User({
        email: ADMIN_EMAIL,
        name: 'Sid Kheria',
        role: 'admin',
        isActive: true,
        usedListings: 0
      });

      await newAdmin.save();
      
      console.log('✓ Admin user created successfully!');
      console.log(`\n  User Details:`);
      console.log(`  - Email: ${newAdmin.email}`);
      console.log(`  - Name: ${newAdmin.name}`);
      console.log(`  - Role: ${newAdmin.role}`);
      console.log(`  - Active: ${newAdmin.isActive}`);
      console.log(`  - ID: ${newAdmin._id}`);
      console.log(`  - Created: ${newAdmin.createdAt}`);
    }

  } catch (error) {
    console.error('\n❌ Error creating admin user:');
    console.error(error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  }
}

// Run the script
createAdminUser();

