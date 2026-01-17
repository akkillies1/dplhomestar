-- ============================================
-- Optional Sample Data for The DCode Website
-- ============================================
-- This file contains sample data (blog post)
-- Run this AFTER running the main schema file
-- ============================================

-- Insert the blog post about Kerala Design Models
INSERT INTO public.blog_posts (
    title,
    slug,
    author,
    published_at,
    is_published,
    tags,
    excerpt,
    featured_image_url,
    content
) VALUES (
    'Beyond the Nalukettu: Evolving Design Models in Kerala',
    'kerala-design-models-evolution',
    'The DCode Team',
    NOW(),
    true,
    ARRAY['Architecture', 'Kerala', 'Design Trends', 'Tropical Modernism'],
    'From the climate-responsive wisdom of traditional Nalukettus to the sustainable minimalism of today, explore how Kerala''s architectural landscape is redefining luxury and comfort.',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop',
    E'# Beyond the Nalukettu: Evolving Design Models in Kerala\n\nKerala''s architectural identity is a fascinating dialogue between tradition and modernity, constantly shaped by its unique tropical climate, abundant monsoons, and lush geography. As we move through 2024, the "Kerala Model" of design is no longer just about sloping roofs and wooden pillars; it is a sophisticated blend of heritage wisdom and contemporary aesthetics.\n\n## 1. The Neo-Traditional Revival (The Modern Nalukettu)\nThe traditional *Nalukettu*—with its central courtyard (*Nadumuttom*)—was a masterclass in ventilation and lighting. Today, we are seeing a resurgence of this concept, but deconstructed.\n*   **The Shift:** Instead of dark, timber-heavy interiors, modern interpretations use steel, glass, and polished concrete to create open, airy courtyards that bring nature inside without the maintenance heaviness of the past.\n*   **Key Feature:** The "Sky-lit Nadumuttom" – using automated louvers or toughened glass to keep the rain out while letting the drama of the monsoon in.\n\n## 2. Tropical Modernism & Critical Regionalism\nInspired by the legendary Laurie Baker, this model remains the conscience of Kerala''s architecture. It prioritizes sustainability without compromising on style.\n*   **Materiality:** Exposed laterite stones, wire-cut bricks, and filler slabs are being used not just for cost-saving but for their raw, textural beauty.\n*   **Aesthetics:** It''s an "Earth-First" luxury. Think terracotta flooring paired with sleek mid-century modern furniture, and large overhangs that protect walls from the heavy rains while shading the interiors.\n\n## 3. The Contemporary Minimalist Box (With a Twist)\nThe flat-roofed, "Gulf-influenced" concrete mansions are evolving. The new wave of minimalism in Kerala is sharper, cleaner, and more climate-aware.\n*   **The Adaptation:** While the aesthetic is international—clean white lines, cantilevered volumes, and large glass facades—the engineering is local. We see the use of "ferrocement" shells and double-skin facades to reduce heat gain.\n*   **Rain Protection:** The flat roof is often a myth; hidden sloping roofs or truss work covered by parapets ensure water drainage remains efficient, blending the sleek look of a box with the practicality of a slope.\n\n## 4. Biophilic Interiors\nKerala is green, and the design model now demands that the house disappears into the landscape.\n*   **Indoor-Outdoor Living:** Patios, verandas, and balconies are no longer separate entities but extensions of the living room. Large sliding doors (often UPVC or Aluminium profiles) dissolve the boundary between the air-conditioned interior and the tropical garden.\n*   **Vertical Gardens:** In urban Kochi and Trivandrum, where land is scarce, vertical gardens and green walls are becoming essential design elements, acting as natural air purifiers and heat buffers.\n\n## Conclusion\nThe prevailing design model in Kerala today is not singular. It is a hybrid—a **"Tropical Global"** aesthetic. It respects the rain and sun of the Malabar coast but embraces the technology and minimalism of the modern world. At **Allthing Decode**, we strive to find this balance in every project, ensuring that your space is not just a shelter, but a celebration of where we live.'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Sample data inserted successfully!
-- ============================================

