-- Add mood column to gallery_images table
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS mood TEXT;

-- Comment for clarity
COMMENT ON COLUMN gallery_images.mood IS 'Defines the artistic aura or mood of the design project (e.g., Tropical Minimalist, Industrial Chic)';
