// Service Worker: Handles 'push' events triggered by a push notification.
// It listens for incoming push messages and shows a notification to the user.

<<<<<<< HEAD
// self.addEventListener('push', function(event) {
//   // Default notification data if none is provided
//   let data = { title: 'Default title', body: 'Default body' };
 
//   // If the push event has data, try to parse it as JSON
//   if (event.data) {
//     try {
//       // Parse the data payload from the event
//       data = JSON.parse(event.data.text()); 
//     } catch {
//       // If parsing fails, treat it as plain text and use it as body
//       data = { title: 'Push', body: event.data.text() };  
//     }
//   }

//   // Wait for the notification to be shown
//   event.waitUntil(
//     self.registration.showNotification(data.title, {
//       body: data.body,
//       // You can add more properties here, like icon, actions, etc.
//     })
//   );
// });


self.addEventListener('push', function(event) {
  // بيانات الإشعار الافتراضية في حال عدم وجود بيانات من الحدث
  let data = { title: 'Default title', body: 'Default body' };

  if (event.data) {
    try {
      // محاولة تحويل البيانات إلى JSON
      data = event.data.json();
    } catch (e) {
      // في حال فشل التحويل، اعتبر البيانات نص عادي واستخدمها كـ body مع عنوان عام
      data = { title: 'Push Notification', body: event.data.text() };
    }
  }

  // عرض الإشعار مع انتظار اكتمال العملية
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      // يمكن إضافة خصائص أخرى مثل الأيقونة، الإجراءات، الصوت، إلخ
      icon: '/icons/icon-192x192.png', // مثال على إضافة أيقونة
      badge: '/icons/badge-72x72.png', // مثال على إضافة بادج
      vibrate: [100, 50, 100], // نمط الاهتزاز
      data: data.url || '/', // يمكن إرسال رابط لفتح عند الضغط على الإشعار
      actions: [
        { action: 'open', title: 'Open App' },
        { action: 'close', title: 'Dismiss' }
      ],
=======
self.addEventListener('push', function(event) {
  // Default notification data if none is provided
  let data = { title: 'Default title', body: 'Default body' };
 
  // If the push event has data, try to parse it as JSON
  if (event.data) {
    try {
      // Parse the data payload from the event
      data = JSON.parse(event.data.text()); 
    } catch {
      // If parsing fails, treat it as plain text and use it as body
      data = { title: 'Push', body: event.data.text() };  
    }
  }

  // Wait for the notification to be shown
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      // You can add more properties here, like icon, actions, etc.
>>>>>>> 53b6de5 (first commit)
    })
  );
});
