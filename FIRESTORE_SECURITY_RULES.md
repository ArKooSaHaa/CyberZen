# Firestore Security Rules for Chat System

## Overview
These security rules ensure that:
- Users can only access their own chat with admin
- Admin can access all chats
- Messages are properly secured

## Security Rules

Copy and paste these rules into your Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.admin == true;
    }
    
    // Helper function to get current user ID
    function getUserId() {
      return request.auth != null ? request.auth.uid : null;
    }
    
    // Helper function to extract userId from chatId (format: userId_admin)
    function getUserIdFromChatId(chatId) {
      return chatId.split('_')[0];
    }
    
    // Chats collection
    match /chats/{chatId} {
      // Allow read if:
      // 1. User is admin (can read all chats)
      // 2. User is reading their own chat (chatId format: userId_admin)
      allow read: if isAdmin() || 
                     (request.auth != null && 
                      getUserIdFromChatId(chatId) == request.auth.uid);
      
      // Allow create if:
      // 1. User is admin (can create any chat)
      // 2. User is creating their own chat
      allow create: if isAdmin() || 
                       (request.auth != null && 
                        getUserIdFromChatId(chatId) == request.auth.uid);
      
      // Allow update if:
      // 1. User is admin (can update any chat)
      // 2. User is updating their own chat
      allow update: if isAdmin() || 
                       (request.auth != null && 
                        getUserIdFromChatId(chatId) == request.auth.uid);
      
      // Messages subcollection
      match /messages/{messageId} {
        // Allow read if user can read the parent chat
        allow read: if isAdmin() || 
                       (request.auth != null && 
                        getUserIdFromChatId(chatId) == request.auth.uid);
        
        // Allow create if:
        // 1. User is admin
        // 2. User is sending a message in their own chat
        // 3. The senderId matches the authenticated user
        allow create: if isAdmin() || 
                         (request.auth != null && 
                          getUserIdFromChatId(chatId) == request.auth.uid &&
                          request.resource.data.senderId == request.auth.uid);
        
        // Allow update if:
        // 1. User is admin
        // 2. User is updating a message in their own chat
        // Only allow updating 'read' field for non-sent messages
        allow update: if isAdmin() || 
                         (request.auth != null && 
                          getUserIdFromChatId(chatId) == request.auth.uid &&
                          request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read']) &&
                          resource.data.senderId != request.auth.uid);
        
        // No delete allowed (messages are permanent)
        allow delete: if false;
      }
    }
  }
}
```

## Alternative: Simplified Rules (if not using Firebase Auth)

If you're using your own authentication system (not Firebase Auth), you'll need to use **Custom Claims** or modify the rules to work with your system.

### Option 1: Using Custom Claims (Recommended)

1. Set custom claims in your backend when user logs in
2. Use Firebase Admin SDK to set claims:

```javascript
// In your Node.js backend
const admin = require('firebase-admin');

// Set admin claim
await admin.auth().setCustomUserClaims(uid, { admin: true });

// Set regular user claim
await admin.auth().setCustomUserClaims(uid, { admin: false });
```

### Option 2: Simplified Rules (Less Secure - Development Only)

For development/testing, you can use these simpler rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{chatId} {
      // Allow read/write to authenticated users
      // In production, add proper user ID validation
      allow read, write: if request.auth != null;
      
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

**⚠️ WARNING:** The simplified rules are less secure. Use only for development.

## Setting Up Custom Claims

### In Your Backend (server/)

1. Install Firebase Admin SDK:
```bash
npm install firebase-admin
```

2. Initialize Firebase Admin:
```javascript
// server/firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
```

3. Set custom claims after login:
```javascript
// In your login route
const admin = require('./firebaseAdmin');

// After successful login
const firebaseToken = await admin.auth().createCustomToken(userId);
await admin.auth().setCustomUserClaims(userId, { 
  admin: user.role === 'admin' 
});
```

## Testing Rules

Use the Firebase Console Rules Playground to test your rules:
1. Go to Firestore Database → Rules
2. Click "Rules Playground"
3. Test different scenarios

## Important Notes

1. **Chat ID Format**: Always use `userId_admin` format for chat IDs
2. **Admin Detection**: Admin is identified by custom claim `admin: true`
3. **Message Security**: Users can only send messages in their own chat
4. **Read Receipts**: Only non-sent messages can be marked as read
5. **No Deletion**: Messages cannot be deleted (permanent record)

## Production Checklist

- [ ] Custom claims are set correctly for admin users
- [ ] Rules are tested in Rules Playground
- [ ] User IDs are validated on the backend
- [ ] Chat IDs follow the `userId_admin` format
- [ ] Firebase Admin SDK is properly configured
- [ ] Service account key is secured (not in git)

