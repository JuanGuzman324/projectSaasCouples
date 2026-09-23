// Service worker mínimo, solo para recibir notificaciones push
// (BACKLOG P3). No cachea nada ni intercepta fetch: la app no necesita
// funcionar offline vía service worker, eso ya lo resuelve la persistencia
// de React Query (ver src/lib/offline.ts).
self.addEventListener('push', (event) => {
  let data = { title: 'Nuestra historia', body: '' }
  try {
    data = event.data.json()
  } catch {
    // payload no-JSON: se ignora, queda el título/cuerpo por defecto
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/pwa-192.png',
      badge: '/pwa-192.png',
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) return client.focus()
      }
      return self.clients.openWindow('/')
    })
  )
})
