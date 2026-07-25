-- Trigger Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Soft delete function helper (Optional, if we want to ensure deleted_at implies inactive)
CREATE OR REPLACE FUNCTION soft_delete_record()
RETURNS TRIGGER AS $$
BEGIN
    NEW.deleted_at = NOW();
    -- Optionally set active_status to false if column exists
    -- This requires dynamic SQL or separate functions per table if schemas differ, 
    -- so keeping it simple here just setting deleted_at.
    RETURN NEW;
END;
$$ language 'plpgsql';
