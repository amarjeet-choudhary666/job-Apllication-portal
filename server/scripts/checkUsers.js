const mongoose = require('mongoose');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "job_portal"
    });
    
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const users = await User.find({});
    
    console.log('=== USERS IN DATABASE ===');
    console.log(JSON.stringify(users, null, 2));
    console.log('\nTotal users:', users.length);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();
