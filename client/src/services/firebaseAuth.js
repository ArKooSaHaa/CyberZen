// Firebase Authentication service
import { auth } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  applyActionCode,
  checkActionCode
} from 'firebase/auth';

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {object} additionalData - Additional user data (firstName, lastName, etc.)
 * @returns {Promise<object>} User object with Firebase user and additional data
 */
export const signUpWithFirebase = async (email, password, additionalData = {}) => {
  try {
    console.log('🔥 Firebase signup started for:', email);
    
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Firebase user created:', user.uid);
    
    // Update user profile with display name if provided
    if (additionalData.firstName || additionalData.lastName || additionalData.username) {
      const displayName = additionalData.username || 
                         `${additionalData.firstName || ''} ${additionalData.lastName || ''}`.trim() ||
                         email.split('@')[0];
      
      await updateProfile(user, {
        displayName: displayName
      });
      
      console.log('✅ User profile updated with display name:', displayName);
    }
    
    // Send email verification
    try {
      await sendEmailVerification(user);
      console.log('✅ Verification email sent to:', email);
    } catch (verificationError) {
      console.error('⚠️ Failed to send verification email:', verificationError);
      // Don't throw - account is still created, user can resend later
    }
    
    // Get the Firebase ID token for backend authentication
    const token = await user.getIdToken();
    
    return {
      user: {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        ...additionalData
      },
      token,
      firebaseUser: user,
      verificationEmailSent: true
    };
  } catch (error) {
    console.error('❌ Firebase signup error:', error);
    throw handleFirebaseAuthError(error);
  }
};

/**
 * Sign in with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<object>} User object and token
 */
export const signInWithFirebase = async (email, password) => {
  try {
    console.log('🔥 Firebase signin started for:', email);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();
    
    console.log('✅ Firebase signin successful:', user.uid);
    
    return {
      user: {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName
      },
      token,
      firebaseUser: user
    };
  } catch (error) {
    console.error('❌ Firebase signin error:', error);
    throw handleFirebaseAuthError(error);
  }
};

/**
 * Sign out current user
 */
export const signOutFirebase = async () => {
  try {
    await signOut(auth);
    console.log('✅ Firebase signout successful');
  } catch (error) {
    console.error('❌ Firebase signout error:', error);
    throw handleFirebaseAuthError(error);
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email
 */
export const resetPasswordWithFirebase = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('✅ Password reset email sent to:', email);
  } catch (error) {
    console.error('❌ Password reset error:', error);
    throw handleFirebaseAuthError(error);
  }
};

/**
 * Reset password using confirmation code
 * @param {string} code - Password reset confirmation code from Firebase email link
 * @param {string} newPassword - New password to set
 */
export const confirmPasswordReset = async (code, newPassword) => {
  try {
    await firebaseConfirmPasswordReset(auth, code, newPassword);
    console.log('✅ Firebase password reset confirmed successfully');
  } catch (error) {
    console.error('❌ Firebase password confirmation error:', error);
    throw handleFirebaseAuthError(error);
  }
};

/**
 * Send email verification to current user
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in.');
    }
    
    if (user.emailVerified) {
      console.log('✅ Email already verified');
      return;
    }
    
    await sendEmailVerification(user);
    console.log('✅ Verification email sent to:', user.email);
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    throw handleFirebaseAuthError(error);
  }
};

/**
 * Reload current user to check if email is verified
 * @returns {Promise<object>} Updated user object
 */
export const reloadFirebaseUser = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in.');
    }
    
    await user.reload(); // Reload user data from Firebase
    
    return {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName
    };
  } catch (error) {
    console.error('❌ Failed to reload user:', error);
    throw handleFirebaseAuthError(error);
  }
};

/**
 * Verify email using action code from Firebase email link
 * @param {string} code - Action code from Firebase email verification link
 * @returns {Promise<object>} User email and verification status
 */
export const verifyEmailWithCode = async (code) => {
  try {
    console.log('🔄 Verifying email with code...');
    
    // First, check the action code to get the email
    let email = null;
    try {
      const info = await checkActionCode(auth, code);
      email = info.data.email;
      console.log('📧 Email from action code:', email);
    } catch (checkError) {
      console.warn('⚠️ Could not extract email from code:', checkError);
    }
    
    // Apply the action code to verify the email
    await applyActionCode(auth, code);
    console.log('✅ Email verified successfully in Firebase');
    
    return {
      success: true,
      email: email,
      message: 'Email verified successfully'
    };
  } catch (error) {
    console.error('❌ Email verification error:', error);
    throw handleFirebaseAuthError(error);
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<object|null>} Current user or null
 */
export const getCurrentFirebaseUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

/**
 * Subscribe to auth state changes
 * @param {function} callback - Callback function called on auth state change
 * @returns {function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Handle Firebase authentication errors and convert to user-friendly messages
 * @param {Error} error - Firebase error
 * @returns {Error} User-friendly error
 */
function handleFirebaseAuthError(error) {
  let message = 'Authentication failed';
  
  switch (error.code) {
    case 'auth/email-already-in-use':
      message = 'This email is already registered. Please sign in instead.';
      break;
    case 'auth/invalid-email':
      message = 'Please enter a valid email address.';
      break;
    case 'auth/operation-not-allowed':
      message = 'Email/password accounts are not enabled. Please contact support.';
      break;
    case 'auth/weak-password':
      message = 'Password is too weak. Please use a stronger password (at least 6 characters).';
      break;
    case 'auth/user-disabled':
      message = 'This account has been disabled. Please contact support.';
      break;
    case 'auth/user-not-found':
      message = 'No account found with this email. Please sign up first.';
      break;
    case 'auth/wrong-password':
      message = 'Incorrect password. Please try again.';
      break;
    case 'auth/too-many-requests':
      message = 'Too many failed attempts. Please try again later.';
      break;
    case 'auth/network-request-failed':
      message = 'Network error. Please check your internet connection.';
      break;
    default:
      message = error.message || 'Authentication failed. Please try again.';
  }
  
  const friendlyError = new Error(message);
  friendlyError.code = error.code;
  return friendlyError;
}

