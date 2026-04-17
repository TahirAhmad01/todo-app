self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: "Todo Reminder", body: "You have a task coming up!" };
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/vite.svg"
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // Use the origin of wherever the app is hosted (e.g. localhost or vercel domain)
  const targetUrl = self.location.origin;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // If a tab for this app is already open, just focus it!
      const matchingClient = windowClients.find(client => client.url === targetUrl || client.url === targetUrl + '/');
      if (matchingClient) {
        return matchingClient.focus();
      }
      // Otherwise, open a new tab with the app
      return clients.openWindow(targetUrl);
    })
  );
});
