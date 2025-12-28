# Fault-Tolerant Data Processing System

## Assumptions
- Clients send JSON events
- MongoDB provides reliable storage with unique indexes
- UUIDs more reliable than timestamps for deduplication

## Double Counting Prevention
Unique MongoDB index on `processedId` (UUID) prevents duplicate inserts.

## Database Failure Mid-Request
1. Event normalized/validated first
2. Unique index blocks duplicates on retry
3. No data loss, no double counting

## Scale Breakage Point
MongoDB write contention on unique index. Mitigate with:
- Sharding by clientId
- Eventual consistency queue
- Batch processing
