# Plan: Revert Signed State Policy to Access Grant Based Authorization

## Problem Statement

Commit `50ae68a` (:lock: Lock down information sharing agreement access to groups access only) changed `SignedStatePolicy` from an access-grant-based authorization model to a group-membership-based model. The original version (last touched in `46ba556` on main) is better — it operates at the right abstraction level, asking "does this user have access?" rather than leaking group implementation details into the policy.

## Current State Analysis

**Current Implementation (branch):**
- `show()` checks `isMemberOfInternalGroup()` / `isMemberOfExternalGroup()` — 4 private helpers
- `update()`/`destroy()` check `isAdminOfInternalGroup()` / `isAdminOfExternalGroup()`
- Couples the policy to internal/external group structure
- Added `User.isMemberOfGroup()` method (only used here)

**Original Implementation (main):**
- `show()` checks `this.record.hasAccessGrantFor(this.user.id)` — one call
- `update()`/`destroy()` check `this.user.isAdminForInformationSharingAgreement(this.record.id)` — one call
- Clean domain-level abstractions, no knowledge of group internals

## Recommended Solution

Revert `signed-state-policy.ts` to main's version and remove the now-unused `isMemberOfGroup` method.

### Steps

1. **Revert `signed-state-policy.ts`** to main's version
   - Remove `isNil` import
   - Replace group-membership checks with access-grant checks
   - Remove all 4 private helper methods

2. **Remove `User.isMemberOfGroup()`** from the User model
   - Only used in signed-state-policy.ts — no other callers

3. **Update the test file** to match the reverted policy
   - Tests should verify access-grant-based authorization, not group membership

## Files Changed

| File | Change |
|------|--------|
| `api/src/policies/information-sharing-agreements/signed-state-policy.ts` | Revert to main's access-grant-based version |
| `api/src/models/user.ts` | Remove `isMemberOfGroup()` method |
| `api/tests/policies/information-sharing-agreements/signed-state-policy.test.ts` | Update tests for access-grant-based authorization |

## Verification

```bash
dev test api -- --run api/tests/policies/information-sharing-agreements/signed-state-policy.test.ts
```

---

**Last Updated:** 2026-02-16
