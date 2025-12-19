# Troubleshooting Chat Issues

## Issue: Admin Not Seeing User Messages

### Fixed Issues:
1. ✅ **localStorage Key Mismatch**: Changed from `'userInfo'` to `'user'`
2. ✅ **User ID Field**: Now supports both `_id` (MongoDB) and `id` fields
3. ✅ **Added Debug Logging**: Console logs to help identify issues

### How to Debug:

1. **Open Browser Console** (F12)
2. **Check User Chat** (`/chat`):
   - Look for: `ChatBox: User ID: ...` and `ChatBox: Chat ID: ...`
   - If you see "No user ID found", check localStorage:
     ```javascript
     // In browser console:
     JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'))
     ```

3. **Check Admin Dashboard** (`/admin/chat`):
   - Look for: `AdminChatDashboard: Setting up chat listener...`
   - Look for: `listenToAllChats: Snapshot received, docs count: X`
   - If count is 0, check Firestore rules

4. **Check Firestore Console**:
   - Go to Firebase Console → Firestore Database
   - Check if `chats` collection exists
   - Check if documents are being created when user sends message

### Common Issues:

#### 1. Permission Denied Error
**Symptom**: Console shows `permission-denied` error

**Solution**: 
- Go to Firebase Console → Firestore Database → Rules
- Copy rules from `FIRESTORE_SECURITY_RULES.md`
- Publish the rules

#### 2. User ID Not Found
**Symptom**: Console shows "No user ID found"

**Solution**:
- Make sure user is logged in
- Check localStorage: `localStorage.getItem('user')`
- Verify user object has `_id` or `id` field

#### 3. Messages Not Appearing in Admin Dashboard
**Symptom**: User sends message but admin doesn't see it

**Check**:
1. Open browser console on admin page
2. Look for `listenToAllChats: Snapshot received`
3. Check Firestore Console to see if chat document exists
4. Verify chat ID format: `{userId}_admin`

#### 4. Firestore Rules Not Set
**Symptom**: All operations fail with permission errors

**Solution**:
1. Go to Firebase Console
2. Firestore Database → Rules
3. Use rules from `FIRESTORE_SECURITY_RULES.md`
4. For testing, you can temporarily use:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; // TEMPORARY - FOR TESTING ONLY
       }
     }
   }
   ```
   ⚠️ **WARNING**: This allows anyone to read/write. Only use for testing!

### Testing Steps:

1. **Test User Sending Message**:
   - Log in as user
   - Go to `/chat`
   - Send a message
   - Check console for: `Message sent successfully`
   - Check Firestore Console for new document

2. **Test Admin Viewing**:
   - Log in as admin
   - Go to `/admin/chat`
   - Check console for: `Received chats: [...]`
   - Should see chat in list

3. **Test Real-time**:
   - Open user chat in one window
   - Open admin dashboard in another window
   - Send message from user window
   - Should appear instantly in admin window

### Debug Commands:

```javascript
// Check user info
JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'))

// Check Firebase connection
import { db } from './firebase';
console.log('Firebase DB:', db);

// Manually check Firestore (in browser console)
// You'll need to use Firebase SDK or check Firebase Console
```

### Next Steps:

If issues persist:
1. Check browser console for specific error messages
2. Check Firebase Console → Firestore for data
3. Verify Firestore security rules are published
4. Check network tab for failed requests
5. Verify Firebase config is correct in `firebase.js`

