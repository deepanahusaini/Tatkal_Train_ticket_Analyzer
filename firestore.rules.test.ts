/**
 * RailPulse AI — Phase 0 Security Rules Test Specification (Dirty Dozen)
 * Verifies that all 12 adversarial payloads fail with PERMISSION_DENIED
 * under the Eight Pillars Firestore Security Rules.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collectionPath: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  authContext: { uid: string; email: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
  enforcingPillar: string;
}

export const DIRTY_DOZEN_TESTS: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on Tracked Train',
    collectionPath: 'trackedTrains/trk_001',
    operation: 'create',
    authContext: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    payload: {
      id: 'trk_001',
      userId: 'user_a',
      trainNumber: '12952',
      trainName: 'Mumbai Rajdhani',
      sourceCode: 'NDLS',
      destinationCode: 'MMCT',
      travelDate: '2026-11-25',
      travelClass: '3A',
      quota: 'TQ',
      targetStatus: 'AVAILABLE',
      notes: 'Watch',
      status: 'active',
      isAdmin: true,
    },
    expectedResult: 'PERMISSION_DENIED',
    enforcingPillar: 'Pillar 2: hasOnly() strict keys',
  },
  {
    id: 2,
    name: 'Identity Spoofing on Alert Create',
    collectionPath: 'alerts/alt_001',
    operation: 'create',
    authContext: { uid: 'attacker', email: 'attacker@example.com', email_verified: true },
    payload: {
      id: 'alt_001',
      userId: 'victim_uid',
      trainNumber: '12302',
      title: 'Fake Alert',
      message: 'Spoofed payload',
      category: 'AVAILABILITY',
      severity: 'info',
      isRead: false,
      sourceType: 'DEMO_SIMULATED',
    },
    expectedResult: 'PERMISSION_DENIED',
    enforcingPillar: 'Pillar 2: Identity Integrity (userId == request.auth.uid)',
  },
  {
    id: 3,
    name: 'Email Spoofing Admin Bypass (Unverified Email)',
    collectionPath: 'auditLogs/log_001',
    operation: 'get',
    authContext: { uid: 'spoof', email: 'deepanshu0saini@gmail.com', email_verified: false },
    expectedResult: 'PERMISSION_DENIED',
    enforcingPillar: 'Verified Email Gate (email_verified == true)',
  },
  {
    id: 4,
    name: 'PII Blanket Read on Private Profile',
    collectionPath: 'users/victim_uid/private/profile',
    operation: 'get',
    authContext: { uid: 'other_user', email: 'other@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
    enforcingPillar: 'Pillar 6: PII Split Collection Isolation',
  },
  {
    id: 5,
    name: 'Unscoped List Query Scraping on Tracked Trains',
    collectionPath: 'trackedTrains',
    operation: 'list',
    authContext: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
    enforcingPillar: 'Pillar 8: Secure List Queries (resource.data.userId == request.auth.uid)',
  },
  {
    id: 6,
    name: 'ID Poisoning with 1500-char Document ID',
    collectionPath: `trackedTrains/${'a'.repeat(1500)}`,
    operation: 'create',
    authContext: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    payload: { id: 'a'.repeat(1500), userId: 'user_a' },
    expectedResult: 'PERMISSION_DENIED',
    enforcingPillar: 'Pillar 3: Path Variable Hardening isValidId()',
  },
  {
    id: 7,
    name: 'Value Poisoning on Alert isRead Update',
    collectionPath: 'alerts/alt_001',
    operation: 'update',
    authContext: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    payload: { isRead: 'x'.repeat(50000) },
    expectedResult: 'PERMISSION_DENIED',
    enforcingPillar: 'Pillar 2 + 4: isValidAlert() wrapping action-based update',
  },
  {
    id: 8,
    name: 'Terminal State Mutation on Archived Tracked Train',
    collectionPath: 'trackedTrains/trk_archived',
    operation: 'update',
    authContext: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    payload: { status: 'active' },
    expectedResult: 'PERMISSION_DENIED',
    enforcingPillar: 'Phase 4.6: Terminal State Locking (existing().status != archived)',
  },
  {
    id: 9,
    name: 'Client Timestamp Forgery on Saved Prediction',
    collectionPath: 'predictions/prd_001',
    operation: 'create',
    authContext: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    payload: { createdAt: '1999-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
    enforcingPillar: 'Phase 4.13: Temporal Integrity (createdAt == request.time)',
  },
  {
    id: 10,
    name: 'Self-Assigned Admin Escalation',
    collectionPath: 'admins/user_a',
    operation: 'create',
    authContext: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    payload: { uid: 'user_a', email: 'a@example.com' },
    expectedResult: 'PERMISSION_DENIED',
    enforcingPillar: 'Phase 3: Prevent Self-Assigned Admin Roles',
  },
  {
    id: 11,
    name: 'Immutable Audit Log Tampering',
    collectionPath: 'auditLogs/log_001',
    operation: 'update',
    authContext: { uid: 'admin', email: 'deepanshu0saini@gmail.com', email_verified: true },
    payload: { details: 'Erased trace' },
    expectedResult: 'PERMISSION_DENIED',
    enforcingPillar: 'Audit Log Immutability (allow update, delete: if false)',
  },
  {
    id: 12,
    name: 'Immutable Saved Prediction Overwrite',
    collectionPath: 'predictions/prd_001',
    operation: 'update',
    authContext: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    payload: { probability: 99.9 },
    expectedResult: 'PERMISSION_DENIED',
    enforcingPillar: 'Saved Prediction Immutability (allow update: if false)',
  },
];
