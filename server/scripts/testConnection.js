const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGODB_URI ? 'Found' : 'Missing');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Connection details:');
    console.log('  - Database:', mongoose.connection.db.databaseName);
    console.log('  - Host:', mongoose.connection.host);
    console.log('  - Port:', mongoose.connection.port);
    console.log('  - Ready State:', mongoose.connection.readyState);

    // Test basic operations
    console.log('\n🧪 Testing basic database operations...');
    
    // Create a test collection
    const TestModel = mongoose.model('Test', new mongoose.Schema({
      message: String,
      timestamp: { type: Date, default: Date.now }
    }));

    // Insert a test document
    const testDoc = new TestModel({
      message: 'MongoDB connection test successful!'
    });
    
    await testDoc.save();
    console.log('✅ Test document created successfully');

    // Query the test document
    const found = await TestModel.findOne({ message: 'MongoDB connection test successful!' });
    console.log('✅ Test document retrieved successfully');

    // Clean up - remove test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document cleaned up successfully');

    console.log('\n🎉 All tests passed! Your MongoDB setup is working correctly.');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Possible solutions:');
      console.error('  - Check your username and password in the connection string');
      console.error('  - Make sure the database user has proper permissions');
      console.error('  - Verify the database user exists in MongoDB Atlas');
    } else if (error.message.includes('network')) {
      console.error('\n💡 Possible solutions:');
      console.error('  - Check your internet connection');
      console.error('  - Verify IP address is whitelisted in MongoDB Atlas');
      console.error('  - Check if your network blocks MongoDB Atlas ports');
    } else if (error.message.includes('MONGODB_URI')) {
      console.error('\n💡 Solution:');
      console.error('  - Create a .env file in the server directory');
      console.error('  - Add your MongoDB connection string: MONGODB_URI=...');
    }
    
    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
};

// Run the test
testConnection();
