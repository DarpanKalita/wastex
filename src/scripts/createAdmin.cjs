const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const { config } = require('dotenv');

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

let User;

async function createAdminUser() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined in environment variables');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    const existingAdmin = await User.findOne({ email: 'admin@kleefo.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@kleefo.com',
      password: hashedPassword,
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

(async () => {
  User = (await import('../models/User.js')).default;
  await createAdminUser();
})(); 