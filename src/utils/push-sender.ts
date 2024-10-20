// import admin from "../config/firebase-config";

// export async function sendPushNotification(token: string, title: string, body: string, actionUrl: string) {
//   const message = {
//     notification: {
//       title,
//       body
//     },
//     data: {
//       actionUrl
//     },
//     token
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log('Push notification sent successfully:', response);
//     return true;
//   } catch (error) {
//     console.error('Error sending push notification:', error);
//     return false;
//   }
// }
