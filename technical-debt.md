# Technical Debt

**Project**: Gym Tracker
**Last Updated**: 2025-11-05

---

## Overview

This document tracks technical debt items that have been intentionally deferred to maintain development velocity. These items should be revisited in future iterations.

---

## Deferred Features

### 1. Email Service for Password Reset

**Priority**: P1 (High)
**Status**: ⏳ Deferred to Post-MVP
**Phase**: Phase 2C (Auth Domain)

**Description**:
Currently, password reset functionality will be implemented as a **dummy/placeholder** feature. The UI and flow will exist, but no actual emails will be sent.

**Current Implementation** (Placeholder):
- Password reset form exists
- Generates reset token and stores in database
- Shows "Email sent" message (fake)
- Reset link accessible via direct URL (for testing)
- Token validation and password update logic implemented

**What's Missing**:
- Actual email delivery service
- Email templates (HTML/plain text)
- Email queue/retry logic
- Delivery status tracking

**Future Implementation Options**:
1. **Resend** (Recommended for MVP+)
   - Pros: Simple API, generous free tier, good DX
   - Cons: Newer service, less enterprise features

2. **SendGrid**
   - Pros: Established, reliable, good deliverability
   - Cons: More complex API, pricing can get expensive

3. **AWS SES**
   - Pros: Cheap at scale, integrates with AWS ecosystem
   - Cons: More setup required, reputation management needed

**Estimated Effort**: 4-6 hours (integration + templates + testing)

**Acceptance Criteria** (when implemented):
- User receives email with reset link within 1 minute
- Email contains branded template with clear instructions
- Reset link expires after 24 hours
- Failed deliveries are logged and retried

**Dependencies**:
- Email service account setup
- Email templates designed
- Environment variables configured
- SMTP/API credentials secured

**Workaround** (Current):
- Developers can access reset tokens directly from database
- QA can test flow with direct URL access
- Production users will see "feature coming soon" message

---

## Notes

**Decision Rationale**:
- Focus on core workout tracking functionality first
- Email service adds external dependency and complexity
- Most users can use "forgot password" workaround (contact support)
- Can be added later without major refactoring

**Risk Assessment**:
- **Low Impact**: Password reset is infrequent use case
- **Medium Priority**: Should implement before public launch
- **Zero Technical Debt**: Implementation is isolated, no code refactoring needed later

---

## Future Technical Debt Items

(Will be added as project progresses)

---
