-- Sample data for testing - Kerala focused
-- You can run this in Supabase SQL Editor to populate your database with test data

-- Add sample gallery images with Kerala context
INSERT INTO gallery_images (title, description, image_url, tags, is_featured, is_published, display_order)
VALUES 
  (
    'Traditional Kerala Home - Modern Touch',
    'Contemporary redesign of a traditional Kerala home in Kochi, blending heritage with modern comfort',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
    ARRAY['Residential', 'Living Room', 'Kerala', 'Traditional'],
    true,
    true,
    1
  ),
  (
    'Luxury Villa Kitchen - Trivandrum',
    'State-of-the-art modular kitchen with traditional Kerala elements and modern appliances',
    'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800',
    ARRAY['Residential', 'Kitchen', 'Luxury', 'Kerala'],
    true,
    true,
    2
  ),
  (
    'Serene Bedroom - Kochi Villa',
    'Master bedroom design inspired by Kerala backwaters with calming earth tones',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800',
    ARRAY['Residential', 'Bedroom', 'Kerala'],
    true,
    true,
    3
  ),
  (
    'IT Office - Technopark',
    'Modern workspace design for a tech startup in Trivandrum Technopark',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    ARRAY['Commercial', 'Office', 'Kerala'],
    true,
    true,
    4
  ),
  (
    'Reading Corner - Kozhikode Home',
    'Cozy reading nook with traditional Kerala woodwork and modern comfort',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    ARRAY['Residential', 'Living Room', 'Kerala'],
    true,
    true,
    5
  ),
  (
    'Spa-Inspired Bathroom - Kottayam',
    'Luxury bathroom design with Kerala-style natural stone and modern fixtures',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
    ARRAY['Residential', 'Bathroom', 'Luxury', 'Kerala'],
    true,
    true,
    6
  ),
  (
    'Family Dining Space - Thrissur',
    'Traditional Kerala dining area with contemporary furniture and lighting',
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800',
    ARRAY['Residential', 'Dining Room', 'Kerala'],
    true,
    true,
    7
  ),
  (
    'Home Office - Ernakulam',
    'Work-from-home setup with Kerala architectural elements and modern ergonomics',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    ARRAY['Residential', 'Office', 'Modern', 'Kerala'],
    true,
    true,
    8
  );

-- Add sample testimonials - Kerala clients
INSERT INTO testimonials (client_name, rating, review_text, project_type, location, is_published, display_order)
VALUES 
  (
    'Suresh Menon',
    5,
    'The DCode beautifully transformed our ancestral home in Fort Kochi. They preserved the traditional Kerala architecture while adding modern comforts. The team understood our vision perfectly!',
    'Heritage Home Renovation',
    'Fort Kochi',
    true,
    1
  ),
  (
    'Lakshmi Nair',
    5,
    'Our villa in Trivandrum is now a perfect blend of Kerala tradition and contemporary design. The attention to detail and use of local materials was exceptional. Highly recommended!',
    'Luxury Villa Interior',
    'Trivandrum',
    true,
    2
  ),
  (
    'Rajesh Kumar',
    5,
    'The DECODE process was thorough and professional. They designed our apartment in Marine Drive with a modern Kerala aesthetic that we absolutely love. Worth every rupee!',
    'Apartment Interior',
    'Kochi (Marine Drive)',
    true,
    3
  ),
  (
    'Priya Krishnan',
    5,
    'From our first meeting to the final handover, the experience was seamless. Our restaurant in Kozhikode now has a unique Kerala-contemporary vibe that our customers love!',
    'Restaurant Design',
    'Kozhikode',
    true,
    4
  ),
  (
    'Anand Pillai',
    5,
    'They transformed our office space in Technopark into a modern, inspiring workplace. The team was professional, creative, and delivered ahead of schedule. Excellent work!',
    'Corporate Office',
    'Trivandrum (Technopark)',
    true,
    5
  ),
  (
    'Deepa Varma',
    5,
    'Our home in Thrissur is now a masterpiece! They understood our need for traditional Kerala elements with modern functionality. The craftsmanship and design are outstanding.',
    'Residential Home',
    'Thrissur',
    true,
    6
  );

-- Verify the data was inserted
SELECT COUNT(*) as total_images FROM gallery_images;
SELECT COUNT(*) as total_testimonials FROM testimonials;
