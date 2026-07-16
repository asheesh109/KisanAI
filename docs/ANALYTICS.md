# Analytics and Telemetry Documentation

This document outlines the telemetry events tracked in KisanAI. The purpose of these events is strictly for aggregate product analytics to improve the user experience.

## Privacy Considerations

- **No PII Collected**: We never collect personally identifiable information such as names, email addresses, phone numbers, or exact addresses.
- **No Sensitive Content**: User-generated content like booking notes, appointment descriptions, or sensitive IDs are excluded from tracking.
- **Anonymous Data**: Only minimal, anonymous contextual metadata is tracked.
- **Aggregate Use**: Data is used solely for aggregate product analytics to understand feature usage and stability.

## Event Schema

### `reschedule_confirmed`

**Description:**
Triggered after a user successfully confirms a reschedule using the smart reschedule panel.

**Trigger:**
Emitted strictly after the successful completion of the reschedule API operation. It will NOT be emitted before the API confirms success.

**Properties:**
- `source` (string): The origin of the action. (e.g., `"calendar"`)
- `success` (boolean): Whether the operation was successful. (e.g., `true`)

