# Security Specification for Nexus Hub

## Data Invariants
1. **User Identity**: A user document (`/users/{userId}`) can only be created with an ID matching the `request.auth.uid`.
2. **Profile Ownership**: Only the user themselves can modify their public profile.
3. **Sensitive Service Tokens**: `ConnectedService` documents (`/users/{userId}/services/{serviceId}`) contain sensitive API tokens and must be strictly restricted: only the owner can read or write.
4. **Messenger privacy**: Messages can only be read by the sender or the receiver.
5. **Contact Security**: Contact records must involve the requester (either as userA or userB).
6. **Integrity**: `createdAt` timestamps are immutable and must match the server-side `request.time`.

## The "Dirty Dozen" Payloads (Denial Tests)
1. **Identity Spoofing**: Attempt to create a user document with a different UID.
2. **Shadow Field**: Adding `isAdmin: true` to a profile.
3. **Privilege Escalation**: Attempting to read another user's `ConnectedService` tokens.
4. **Impersonation**: Sending a message with a `senderId` that doesn't match `request.auth.uid`.
5. **PII Leak**: Authenticated user trying to list all `/users` without a specific query filter.
6. **Metadata Tampering**: Updating `createdAt` on an existing document.
7. **Orphaned Writes**: Creating an insight for a user ID that doesn't exist.
8. **Resource Exhaustion**: Inserting a 2MB string into a bio.
9. **State Shortcut**: Accept a contact request for another user.
10. **ID Poisoning**: Using a 2KB junk string as a document ID.
11. **Query Scraping**: Listing `/messages` without filtering by `senderId` or `receiverId`.
12. **Future Dating**: Setting a `startTime` in the year 2099 without validation.

## The Test Runner (firestore.rules.test.ts)
*(Not implemented in this step, but planned for verification)*
