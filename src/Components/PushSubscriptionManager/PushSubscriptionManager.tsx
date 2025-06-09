// This component manages the push notification subscription process.
// It requests permission from the user, subscribes to push notifications,
// and sends the subscription details to a backend server for later use.

import { useEffect } from 'react'; // Importing useEffect hook to run side effects in the component
import axios from 'axios'; // Importing axios to make HTTP requests to backend

// PUBLIC_KEY is the VAPID public key stored in environment variables, used for push subscription authentication.
const PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

// Retrieve the token from sessionStorage to authorize API requests.
const token = sessionStorage.getItem('tkn');

// This helper function converts a Base64 string (used in VAPID keys) into a Uint8Array required by the push API.
function urlBase64ToUint8Array(base64String: string) {
  // Add padding to the base64 string if necessary
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  // Replace URL-safe characters to standard Base64 characters
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  // Decode base64 string to raw binary data
  const rawData = atob(base64);
  // Create Uint8Array to hold the decoded bytes
  const outputArray = new Uint8Array(rawData.length);
  // Convert each character to its char code and store in the array
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Converts an ArrayBuffer to a Base64 encoded string, used to send keys securely.
function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  // Convert each byte to a character and concatenate
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // Encode the binary string to base64
  return window.btoa(binary);
} 
// This async function handles the subscription of the user to push notifications.
export async function subscribeUserToPush() {
  try {
    // Wait until the service worker is ready
    const registration = await navigator.serviceWorker.ready;
    
    // Check if the user already has a push subscription
    let subscription = await registration.pushManager.getSubscription();

    // If no existing subscription, create a new one
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true, // Ensure that push notifications are always visible to the user
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY), // Use the public VAPID key
      });
    } else {
      // If subscription exists, log it
      console.log(' Using existing subscription');
    }

    // Prepare the subscription data to send to backend
    const subscriptionToSend = {
      endpoint: subscription.endpoint,
      keys: {
        // Convert the subscription keys to base64 strings for safe transmission
        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
        auth: arrayBufferToBase64(subscription.getKey('auth')),
      },
    };

    // If there is no token (user not logged in), stop the function
 

    // Send subscription details to backend API to save it (with token authorization)
    await axios.post('https://server-to-do-lake.vercel.app/subscriptions/api/save-subscription', subscriptionToSend, {
      headers: {
        token,
        'Content-Type': 'application/json',
      },
    });
 

  } catch (error) {
    // Log any errors that happen during the subscription process
    console.error(' Error during push subscription:', error);
  }
}

// This React component triggers the push subscription process on mount.
const PushSubscriptionManager = () => {
  useEffect(() => {
    // Check if browser supports service workers and push manager
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // Request permission from the user to send notifications
      Notification.requestPermission().then(permission => {
        // If permission granted, subscribe the user to push notifications
        if (permission === 'granted') {
          subscribeUserToPush();
        } else {
          // Warn if permission denied
          console.warn(' Notification permission denied');
        }
      });
    }
  }, []);

  // This component renders nothing because it only runs side effects
  return null;
};

// Export the component to be used in the app (typically placed near root)
export default PushSubscriptionManager;
 
