# RailPulse AI — Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Default Deny**: All unmatched paths in Firestore are explicitly denied (`allow read, write: if false`).
2. **PII Isolation (Split Collection)**: User email, Telegram handles, and alert toggles live strictly in `/users/{userId}/private/profile`, readable and writable only by the verified owner (`request.auth.uid == userId`) or a verified admin.
3. **Identity Integrity**: Every user-owned document (`trackedTrains`, `alerts`, `predictions`) must store `userId == request.auth.uid` on creation and preserve `userId` immutably on update.
4. **Verified Email Gate**: All standard writes require `request.auth != null && request.auth.token.email_verified == true`.
5. **Admin Privilege Boundary**: Admin access is determined strictly by the bootstrapped verified admin email (`deepanshu0saini@gmail.com` with `email_verified == true`) or existence of a trusted document in `/admins/{uid}`. Users can never self-assign admin status.
6. **Path ID Hardening**: Single-document operations validate path IDs with `isValidId()` (`^[a-zA-Z0-9_\-]+$`, `1..128` chars).
7. **Temporal Integrity**: `createdAt` on create and `updatedAt` on update must equal `request.time`. `createdAt` is immutable after creation.
8. **Terminal State Locking**: Once a `trackedTrains` document transitions to `status == 'archived'`, non-admin updates are blocked. `predictions` and `auditLogs` are immutable after creation.
9. **Query Enforcer (Zero Client Delegation)**: Every `allow list` rule validates `resource.data.userId == request.auth.uid` (or `isBootstrapAdmin()` for admin views) with zero `get()`/`exists()` calls inside `allow list`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Shadow Field Injection on Tracked Train**: Adding `isAdmin: true` or `priorityBoost: 99` to `/trackedTrains/{trackId}` create payload -> `PERMISSION_DENIED`.
2. **Identity Spoofing on Alert Create**: Creating `/alerts/{alertId}` with `userId: "victim-uid"` while authenticated as `"attacker-uid"` -> `PERMISSION_DENIED`.
3. **Email Spoofing Admin Bypass**: Request with `email: "deepanshu0saini@gmail.com"` and `email_verified: false` reading `/auditLogs/{logId}` -> `PERMISSION_DENIED`.
4. **PII Blanket Read**: Non-owner authenticated user attempting `get` on `/users/victim-uid/private/profile` -> `PERMISSION_DENIED`.
5. **Unscoped List Query Scraping**: Non-admin user running `list` on `/trackedTrains` without `where('userId', '==', uid)` -> `PERMISSION_DENIED`.
6. **ID Poisoning (1.5KB Document ID)**: Creating `/trackedTrains/<1500-char-id>` -> `PERMISSION_DENIED`.
7. **Value Poisoning on Whitelisted Update Key**: Updating `alerts/{alertId}` `isRead` field with a 50KB string instead of boolean -> `PERMISSION_DENIED`.
8. **Terminal State Mutation**: Attempting to reactivate an `archived` tracked train as a regular user -> `PERMISSION_DENIED`.
9. **Client Timestamp Forgery**: Creating a `predictions/{id}` document with a forged `createdAt` timestamp not equal to `request.time` -> `PERMISSION_DENIED`.
10. **Self-Assigned Admin Escalation**: Non-admin user attempting to create `/admins/{myUid}` -> `PERMISSION_DENIED`.
11. **Immutable Audit Log Tampering**: Attempting `update` or `delete` on `/auditLogs/{logId}` -> `PERMISSION_DENIED`.
12. **Immutable Prediction Overwrite**: Attempting `update` on `/predictions/{predictionId}` to falsify `probability` -> `PERMISSION_DENIED`.
