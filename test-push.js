import webpush from 'web-push';

const PUBLIC_VAPID_KEY = 'BA_TPaorjZQ_jW8aGw4QsvSMgvpuw0l4qo1yvwCTfAi7vSrHUQY7nBH4tQTMYb1oAMWm4hJEfwdvvxGqrz4WXY0';
const PRIVATE_VAPID_KEY = 'JhAihyqn9ReiIOQyT-TPA-9w3cLMEy13DoQ3CtmmNgI'; // Never share this!

webpush.setVapidDetails(
  'mailto:tahirahmadsani@gmail.com',
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

// Paste the object you got from your React Console here:
const pushSubscription ={"endpoint":"https://fcm.googleapis.com/fcm/send/edQ9VsbQ7NU:APA91bH4git8cUUKnMTpmAnO2VdTwzNXab_N-xh1vreWNXyw2jpUmsf7rip1QjrfN98kkDeDZdIHuJvIf5LdKM8OgNyqVSTmuCLZNMBhu2xkUxxDr-DNuweccY_ctyigOmXqRiOA6MTG","expirationTime":null,"keys":{"p256dh":"BBHA4-gFBQGiHxpYUcwJ8kwNA8r450DCblUvYDxBEMMGMge7byGO6bVxWDF4WI6KdeQV5A_pvcT4URYoZI5yy-8","auth":"lJrB6HFS3Osqhk_5VMnKLA"}}

const payload = JSON.stringify({
  title: 'Todo App Push Test',
  body: 'This push was sent using node.js web-push!'
});

webpush.sendNotification(pushSubscription, payload)
  .then(res => console.log('Successfully sent push!'))
  .catch(error => console.error('Error sending push:', error));
