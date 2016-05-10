-- For some reason an install can load scripts incorrectly
-- so this cleans out all scripts first to ensure they load into 
-- the purchauths schema
DELETE FROM ONLY (script) WHERE script_notes = 'Purchasing Auths';

