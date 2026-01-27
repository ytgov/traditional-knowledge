---
description: Plan to integrate Active Directory from wrap project and rework sync to use Auth0 OID
---

# Plan: Active Directory Integration and Auth0 OID Sync

## Overview
Integrate the Active Directory integration from the wrap project and rework the directory sync service to use Auth0 OID instead of email-based synchronization. The Yukon Government integration will be retained for UI auto-fill functionality.

## Current State Analysis
- User model already has `activeDirectoryIdentifier` field (UUID, nullable)
- Current sync uses Yukon Government API with email-based lookup
- TODO in directory-sync-service.ts indicates need to switch to MS Graph API
- Wrap project has comprehensive Active Directory integration with MS Graph API

## Implementation Steps

### 1. Copy Active Directory Integration Files
**Files to copy from `~/code/icefoganalytics/wrap/api/src/integrations/`:**

- `active-directory-integration.ts` - Main integration class
- `active-directory-integrations/` directory containing:
  - `index.ts` - Type exports
  - `active-directory-user.ts` - User type definition
  - `active-directory-response.ts` - Response type definition
  - `normalize-active-directory-response.ts` - Normalization function
  - `process-function-error.ts` - Error handling

**Target location:** `~/code/icefoganalytics/traditional-knowledge/api/src/integrations/`

### 2. Add Required Dependencies
**Add to package.json:**
```json
{
  "@microsoft/microsoft-graph-client": "^3.0.7",
  "@azure/identity": "^4.4.1",
  "async-retry": "^1.3.3"
}
```

### 3. Add Environment Variables
**Add to config files:**
- `AD_CLIENT_ID` - Azure AD application client ID
- `AD_CLIENT_SECRET` - Azure AD application client secret
- `AD_TENANT_ID` - Azure AD tenant ID

### 4. Update Directory Sync Service
**Modify `/api/src/services/users/directory-sync-service.ts`:**

- Import Active Directory integration
- Change sync logic to use Auth0 OID instead of email
- Implement fallback strategy:
  1. Try to sync using Active Directory via Auth0 OID
  2. If no AD identifier exists, use Yukon Government for auto-fill
  3. Store Active Directory identifier when found

**New sync flow:**
1. Check if user has `activeDirectoryIdentifier`
2. If yes: Use `ActiveDirectoryIntegration.getUser(id)`
3. If no: Use Yukon Government API for basic info
4. If AD sync succeeds and user has no `activeDirectoryIdentifier`: Update user with AD identifier
5. Map AD fields to user model fields

### 5. Field Mapping Strategy
**Active Directory to User Model mapping:**
- `id` → `activeDirectoryIdentifier`
- `givenName` → `firstName`
- `surname` → `lastName`
- `displayName` → `displayName`
- `title` → `title`
- `department` → `department`
- `division` → `division`
- `branch` → `branch`
- `unit` → `unit`
- `mail` → `email` (for validation only, not update)
- `officeLocation` → (new field if needed)

### 6. Update User Creation/Authentication Flow
**When user first logs in via Auth0:**
- Check if `activeDirectoryIdentifier` is populated
- If not and Auth0 OID suggests AD user: Attempt AD lookup
- Store `activeDirectoryIdentifier` if found
- Trigger initial sync if new identifier found

### 7. Testing Strategy
**Unit tests to create:**
- Active Directory integration tests (copy from wrap project)
- Updated DirectorySyncService tests covering:
  - Sync with existing AD identifier
  - Sync without AD identifier (fallback to YG API)
  - Error handling for AD failures
  - Field mapping validation

**Integration tests:**
- End-to-end sync flow with mock AD data
- Auth0 OID to AD identifier mapping

### 8. Migration Considerations
**Database updates needed:**
- Ensure `activeDirectoryIdentifier` index is properly configured
- Consider backfilling existing users with AD identifiers where possible

### 9. Configuration and Deployment
**Environment setup:**
- Add AD credentials to all environment files
- Update Docker configuration if needed
- Document new environment variables

### 10. Monitoring and Logging
**Enhanced logging:**
- Log sync method used (AD vs YG API)
- Track AD identifier population rate
- Monitor sync success/failure rates by method

## Implementation Order
1. Copy integration files and add dependencies
2. Add environment variables and configuration
3. Update DirectorySyncService with new logic
4. Create/update tests
5. Update authentication flow to populate AD identifiers
6. Deploy and monitor

## Benefits
- More reliable sync using unique identifiers instead of email
- Access to richer Active Directory data
- Reduced dependency on Yukon Government API for core sync
- Better handling of email changes
- Improved data consistency

## Risks and Mitigations
- **Risk:** AD API availability issues
  - **Mitigation:** Fallback to Yukon Government API
- **Risk:** Field mapping inconsistencies
  - **Mitigation:** Comprehensive testing and validation
- **Risk:** Performance impact
  - **Mitigation:** Caching and retry logic from wrap project
