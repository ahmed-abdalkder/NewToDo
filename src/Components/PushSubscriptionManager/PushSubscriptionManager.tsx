 


 // This utility manages the subscription of the current user to push notifications.
// It ensures the user is authenticated, requests notification permission,
// subscribes to the browser push service, and sends the subscription to the backend.

// --- Import Axios for making HTTP requests ---
import axios from 'axios';

// --- VAPID public key used to authenticate push subscription requests ---
const PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

// --- Converts a base64 string to a Uint8Array, required by the PushManager API ---
function urlBase64ToUint8Array(base64String: string) {
  // Add padding to the string if needed
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  // Convert URL-safe characters to standard base64 characters
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  // Decode the base64 string to binary string
  const rawData = atob(base64);
  // Convert the binary string to a Uint8Array
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// --- Converts an ArrayBuffer to a base64-encoded string ---
// This is needed to send the cryptographic keys in the subscription object to the backend.
function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// --- Main function to handle push notification subscription for authenticated users ---
export async function subscribeUserToPush() {
  // Retrieve token from sessionStorage to verify if user is logged in
  const token = localStorage.getItem('tkn');
  if (!token) {
    console.warn(' No token found. User not authenticated.');
    return;
  }

  // Check if browser supports Service Workers and Push API
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn(' Push messaging is not supported in this browser.');
    return;
  }

  try {
    // Ask user for notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn(' Notification permission not granted.');
      return;
    }

    // Wait for service worker to become ready
    const registration = await navigator.serviceWorker.ready;

    // Try to get any existing subscription
    let subscription = await registration.pushManager.getSubscription();

    // If no existing subscription, create a new one
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true, // Ensures notifications are always shown to the user
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY), // VAPID key
      });
    }

    // Prepare the subscription object to send to the backend
    const subscriptionToSend = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
        auth: arrayBufferToBase64(subscription.getKey('auth')),
      },
    };

    // Send the subscription to the backend with the token in the header
    await axios.post('https://server-to-do-lake.vercel.app/subscriptions/api/save-subscription', subscriptionToSend, {
      headers: {
        token,
        'Content-Type': 'application/json',
      },
    });

    // Log success
    console.log('✅ Push subscription saved successfully.');
  } catch (error) {
    // Catch any error and log it
    console.error(' Error during push subscription:', error);
  }
}
