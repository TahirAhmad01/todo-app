export const PUBLIC_VAPID_KEY = 'BA_TPaorjZQ_jW8aGw4QsvSMgvpuw0l4qo1yvwCTfAi7vSrHUQY7nBH4tQTMYb1oAMWm4hJEfwdvvxGqrz4WXY0';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeToWebPush() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      // Unregister old FCM firebase worker
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        if (reg.active && reg.active.scriptURL.includes('firebase-messaging-sw.js')) {
          await reg.unregister();
        }
      }

      const register = await navigator.serviceWorker.register('/sw.js');
      let subscription = await register.pushManager.getSubscription();
      
      if (!subscription) {
        subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
        });
      }
      
      console.log('✅ WEB-PUSH SUBSCRIPTION OBJECT (Paste this into backend server):');
      console.log(JSON.stringify(subscription));
      return subscription;
    } catch (err) {
      console.error('Web Push subscription failed: ', err);
    }
  }
}
