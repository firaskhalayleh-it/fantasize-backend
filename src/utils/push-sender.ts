import admin from "../config/firebase-config";

export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  actionUrl: string,
  image: string = 'https://example.com/image.png',
  buttons: { text: string; action: string }[] = []
): Promise<boolean> {
  // Construct the FCM message tailored for Android
  const message: admin.messaging.Message = {
    token,
    notification: {
      title,
      body,
      imageUrl: image, // Correct field name for image
    },
    data: {
      actionUrl, // Custom data to handle navigation in the app
      buttons: JSON.stringify(buttons), // Serialize buttons for client-side parsing
    },
    android: {
      notification: {
        clickAction: 'FLUTTER_NOTIFICATION_CLICK', // Must match intent filter in AndroidManifest.xml
        color: '#FF0000', // Notification color
        sound: 'default', // Notification sound
        tag: 'notification-tag', // Unique tag used to replace existing notifications
        icon: 'ic_notification', // Custom notification icon (ensure this icon exists in your Android resources)
        // Define action buttons (not supported in AndroidNotification)
        // actions: buttons.map((button) => ({
        //   title: button.text,
        //   action: button.action,
        //   // Optionally, you can add an icon for each action button
        //   // icon: 'ic_action_icon', // Ensure the icon exists in your Android resources
        // })),
      },
    },
  };

  try {
    await admin.messaging().send(message);
    console.log('Push notification sent successfully');
    return true;
  } catch (error: any) {
    console.error('Error sending push notification:', error);
    // Handle specific FCM errors related to tokens
    if (
      error.code === 'messaging/registration-token-not-registered' ||
      error.code === 'messaging/invalid-registration-token'
    ) {
      console.log(`The FCM token ${token} is invalid or no longer registered.`);
    }
    return false;
  }
}

export async function sendPushNotificationToMultiple(tokens: string[], title: string, body: string, actionUrl: string, imageUrl: string) {
  const message = {
    notification: {
      title,
      body,
      imageUrl: imageUrl || 'https://example.com/image.png'
    },
    data: {
      actionUrl
    },
    tokens
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log('Push notification sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
}