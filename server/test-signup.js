// Test script for signup endpoint
// Run with: node test-signup.js

const API_BASE_URL = 'http://localhost:5000/api';

async function testSignup() {
    console.log('🧪 Testing Signup Endpoint...\n');

    const testUser = {
        firstName: 'John',
        lastName: 'Doe',
        nid: '1234567890',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '+1234567890',
        password: 'password123',
        confirmPassword: 'password123'
    };

    try {
        console.log('1️⃣ Testing User Signup...');
        const response = await fetch(`${API_BASE_URL}/User`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Data:', data);
        console.log('');

        if (response.ok) {
            console.log('✅ Signup successful!');
            
            // Test getting users
            console.log('2️⃣ Testing Get Users...');
            const getResponse = await fetch(`${API_BASE_URL}/User`);
            const users = await getResponse.json();
            console.log('Users in database:', users.length);
            console.log('First user:', users[0]);
        } else {
            console.log('❌ Signup failed:', data.message);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testSignup();
