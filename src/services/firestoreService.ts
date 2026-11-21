import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import type {
  AuditLogDoc,
  QuotaCode,
  SavedPredictionDoc,
  TrackedTrainDoc,
  TravelClass,
  UserAlertDoc,
  UserPrivateInfoDoc,
  UserPublicProfileDoc,
} from '../types/railway';

function makeSafeId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 9);
  return `${prefix}_${Date.now()}_${rand}`.replace(/[^a-zA-Z0-9_-]/g, '');
}

function clampString(val: string, maxLen: number): string {
  return val.trim().slice(0, maxLen);
}

export async function syncUserProfileDocs(params: {
  uid: string;
  displayName: string;
  email: string;
}): Promise<{ publicProfile: UserPublicProfileDoc; privateInfo: UserPrivateInfoDoc }> {
  const publicRef = doc(db, 'users', params.uid);
  const privateRef = doc(db, 'users', params.uid, 'private', 'profile');

  let publicProfile: UserPublicProfileDoc;
  let privateInfo: UserPrivateInfoDoc;

  try {
    const pubSnap = await getDoc(publicRef);
    if (pubSnap.exists()) {
      publicProfile = pubSnap.data() as UserPublicProfileDoc;
    } else {
      const payload = {
        uid: params.uid,
        displayName: clampString(params.displayName || 'RailPulse Passenger', 100),
        homeStation: 'NDLS',
        preferredClass: '3A' as TravelClass,
        preferredQuota: 'TQ' as QuotaCode,
        theme: 'dark' as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(publicRef, payload);
      publicProfile = payload;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${params.uid}`);
  }

  try {
    const privSnap = await getDoc(privateRef);
    if (privSnap.exists()) {
      privateInfo = privSnap.data() as UserPrivateInfoDoc;
    } else {
      const payload = {
        uid: params.uid,
        email: clampString(params.email || 'user@railpulse.app', 254),
        telegramHandle: '',
        emailAlerts: true,
        telegramAlerts: false,
        browserAlerts: true,
        windowReminderMinutes: 15,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(privateRef, payload);
      privateInfo = payload;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${params.uid}/private/profile`);
  }

  return { publicProfile, privateInfo };
}

export async function updateUserPreferences(
  uid: string,
  publicUpdates: {
    displayName: string;
    homeStation: string;
    preferredClass: TravelClass;
    preferredQuota: QuotaCode;
    theme: 'dark' | 'light';
  },
  privateUpdates: {
    email: string;
    telegramHandle: string;
    emailAlerts: boolean;
    telegramAlerts: boolean;
    browserAlerts: boolean;
    windowReminderMinutes: number;
  }
): Promise<void> {
  const pubPath = `users/${uid}`;
  const privPath = `users/${uid}/private/profile`;
  try {
    await updateDoc(doc(db, 'users', uid), {
      displayName: clampString(publicUpdates.displayName || 'RailPulse User', 100),
      homeStation: clampString(publicUpdates.homeStation.toUpperCase() || 'NDLS', 10).replace(/[^A-Z0-9]/g, '') || 'NDLS',
      preferredClass: publicUpdates.preferredClass,
      preferredQuota: publicUpdates.preferredQuota,
      theme: publicUpdates.theme,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, pubPath);
  }

  try {
    await updateDoc(doc(db, 'users', uid, 'private', 'profile'), {
      email: clampString(privateUpdates.email, 254),
      telegramHandle: clampString(privateUpdates.telegramHandle, 64),
      emailAlerts: Boolean(privateUpdates.emailAlerts),
      telegramAlerts: Boolean(privateUpdates.telegramAlerts),
      browserAlerts: Boolean(privateUpdates.browserAlerts),
      windowReminderMinutes: Math.max(5, Math.min(120, Math.round(privateUpdates.windowReminderMinutes))),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, privPath);
  }
}

export function subscribeTrackedTrains(
  userId: string,
  onData: (items: TrackedTrainDoc[]) => void
): () => void {
  const q = query(collection(db, 'trackedTrains'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => d.data() as TrackedTrainDoc);
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'trackedTrains');
    }
  );
}

export async function addTrackedTrain(params: {
  userId: string;
  trainNumber: string;
  trainName: string;
  sourceCode: string;
  destinationCode: string;
  travelDate: string;
  travelClass: TravelClass;
  quota: QuotaCode;
  targetStatus: 'AVAILABLE' | 'RAC' | 'WL_IMPROVEMENT' | 'WINDOW_OPEN';
  notes: string;
}): Promise<string> {
  const id = makeSafeId('trk');
  const path = `trackedTrains/${id}`;
  try {
    await setDoc(doc(db, 'trackedTrains', id), {
      id,
      userId: params.userId,
      trainNumber: clampString(params.trainNumber.toUpperCase(), 10),
      trainName: clampString(params.trainName, 120),
      sourceCode: clampString(params.sourceCode.toUpperCase(), 10),
      destinationCode: clampString(params.destinationCode.toUpperCase(), 10),
      travelDate: params.travelDate,
      travelClass: params.travelClass,
      quota: params.quota,
      targetStatus: params.targetStatus,
      notes: clampString(params.notes, 300),
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function archiveTrackedTrain(trackId: string): Promise<void> {
  const path = `trackedTrains/${trackId}`;
  try {
    await updateDoc(doc(db, 'trackedTrains', trackId), {
      status: 'archived',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function removeTrackedTrain(trackId: string): Promise<void> {
  const path = `trackedTrains/${trackId}`;
  try {
    await deleteDoc(doc(db, 'trackedTrains', trackId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeUserAlerts(
  userId: string,
  onData: (items: UserAlertDoc[]) => void
): () => void {
  const q = query(collection(db, 'alerts'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => d.data() as UserAlertDoc);
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'alerts');
    }
  );
}

export async function createUserAlert(params: {
  userId: string;
  trainNumber: string;
  title: string;
  message: string;
  category: 'AVAILABILITY' | 'WAITLIST' | 'BOOKING_WINDOW' | 'RUNNING_STATUS';
  severity: 'info' | 'warning' | 'critical';
  sourceType: 'DEMO_SIMULATED' | 'AUTHORIZED_API' | 'AI_PREDICTION' | 'SYSTEM_RULE';
}): Promise<string> {
  const id = makeSafeId('alt');
  const path = `alerts/${id}`;
  try {
    await setDoc(doc(db, 'alerts', id), {
      id,
      userId: params.userId,
      trainNumber: clampString(params.trainNumber.toUpperCase(), 10),
      title: clampString(params.title, 140),
      message: clampString(params.message, 500),
      category: params.category,
      severity: params.severity,
      isRead: false,
      sourceType: params.sourceType,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function markAlertRead(alertId: string, isRead: boolean): Promise<void> {
  const path = `alerts/${alertId}`;
  try {
    await updateDoc(doc(db, 'alerts', alertId), {
      isRead,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteUserAlert(alertId: string): Promise<void> {
  const path = `alerts/${alertId}`;
  try {
    await deleteDoc(doc(db, 'alerts', alertId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeSavedPredictions(
  userId: string,
  onData: (items: SavedPredictionDoc[]) => void
): () => void {
  const q = query(collection(db, 'predictions'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => d.data() as SavedPredictionDoc);
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'predictions');
    }
  );
}

export async function savePredictionSnapshot(params: {
  userId: string;
  trainNumber: string;
  trainName: string;
  travelDate: string;
  travelClass: TravelClass;
  quota: QuotaCode;
  waitlistType: 'GNWL' | 'TQWL' | 'RLWL' | 'PQWL' | 'RAC';
  waitlistNumber: number;
  probability: number;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
  dataSourceLabel: string;
}): Promise<string> {
  const id = makeSafeId('prd');
  const path = `predictions/${id}`;
  try {
    await setDoc(doc(db, 'predictions', id), {
      id,
      userId: params.userId,
      trainNumber: clampString(params.trainNumber.toUpperCase(), 10),
      trainName: clampString(params.trainName, 120),
      travelDate: params.travelDate,
      travelClass: params.travelClass,
      quota: params.quota,
      waitlistType: params.waitlistType,
      waitlistNumber: Math.max(0, Math.min(999, Math.round(params.waitlistNumber))),
      probability: Math.max(0, Math.min(100, Number(params.probability))),
      confidenceLevel: params.confidenceLevel,
      recommendation: clampString(params.recommendation, 400),
      dataSourceLabel: clampString(params.dataSourceLabel, 60),
      createdAt: serverTimestamp(),
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteSavedPrediction(predictionId: string): Promise<void> {
  const path = `predictions/${predictionId}`;
  try {
    await deleteDoc(doc(db, 'predictions', predictionId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeAuditLogs(onData: (items: AuditLogDoc[]) => void): () => void {
  return onSnapshot(
    collection(db, 'auditLogs'),
    (snap) => {
      const items = snap.docs.map((d) => d.data() as AuditLogDoc);
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'auditLogs');
    }
  );
}

export async function createAuditLogEntry(params: {
  actorUid: string;
  action: string;
  target: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}): Promise<string> {
  const id = makeSafeId('aud');
  const path = `auditLogs/${id}`;
  try {
    await setDoc(doc(db, 'auditLogs', id), {
      id,
      actorUid: params.actorUid,
      action: clampString(params.action, 80),
      target: clampString(params.target, 120),
      details: clampString(params.details, 500),
      severity: params.severity,
      createdAt: serverTimestamp(),
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
