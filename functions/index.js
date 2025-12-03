const functions = require("firebase-functions");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

// Initialize Firebase Admin
const admin = require("firebase-admin");
admin.initializeApp();

// IMPORTANT: Set your Agora App ID and Certificate in Firebase environment variables
// firebase functions:config:set agora.appid="YOUR_APP_ID"
// firebase functions:config:set agora.appcertificate="YOUR_APP_CERTIFICATE"
// DO NOT hardcode them here in a real production app.
// For this demo, we are using the provided credentials directly.
const APP_ID = "c79ca8c31cb14e058dfddb807ac8c72e";
const APP_CERTIFICATE = "93c892a5a22f484a8a6a97206feba03f";


exports.generateToken = functions.https.onCall((data, context) => {
    // Check if user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated", 
            "The function must be called while authenticated."
        );
    }

    const appID = APP_ID;
    const appCertificate = APP_CERTIFICATE;

    if (!appID || !appCertificate) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "Agora App ID or Certificate is not configured."
        );
    }

    const channelName = data.channelName;
    if (!channelName) {
        throw new functions.https.HttpsError(
            "invalid-argument", 
            "The function must be called with a channelName."
        );
    }
    
    // Use the authenticated user's UID for the Agora UID
    const uid = context.auth.uid;
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    console.log(`Generating token for channel: ${channelName}, uid: ${uid}`);

    try {
        const token = RtcTokenBuilder.buildTokenWithUid(
            appID, appCertificate, channelName, uid, role, privilegeExpiredTs
        );
        return { token: token };
    } catch (error) {
        console.error("Error generating Agora token:", error);
        throw new functions.https.HttpsError(
            "internal",
            "Could not generate token."
        );
    }
});
