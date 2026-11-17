import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const sampleProperties = [
  {
    slug: "the-crown-penthouse-palm-jumeirah",
    title: "The Crown Penthouse at Palm Jumeirah",
    description: "An extraordinary sky residence offering 360-degree panoramic views of the Arabian Gulf and the Dubai skyline. Featuring custom Italian marble, private infinity pool on the terrace, bespoke Boffi kitchen, and a private high-speed elevator.",
    area: "Palm Jumeirah",
    type: "Penthouse",
    bedrooms: 5,
    bathrooms: 6,
    price: 38500000,
    size: 9400,
    status: "READY",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Private Infinity Pool",
      "Direct Beach Access",
      "Panoramic Sea Views",
      "Private Elevator",
      "Concierge & Valet",
      "Smart Home Automation",
      "Temperature-Controlled Wine Cellar"
    ]),
    featured: true,
  },
  {
    slug: "burj-crown-luxury-suite-downtown-dubai",
    title: "Burj Crown Luxury Suite",
    description: "Located in the heart of Downtown Dubai, steps from Dubai Opera and the Burj Khalifa. This designer residence combines floor-to-ceiling acoustic glazing with open-concept living, custom European cabinetry, and stunning skyline night vistas.",
    area: "Downtown Dubai",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    price: 2850000,
    size: 1350,
    status: "READY",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Burj Khalifa View",
      "Walking Distance to Dubai Mall",
      "Rooftop Infinity Pool",
      "State-of-the-Art Gym",
      "Covered Parking",
      "24/7 Security"
    ]),
    featured: true,
  },
  {
    slug: "marina-gate-waterfront-residence",
    title: "Marina Gate Waterfront Residence",
    description: "Exceptional waterfront living along the Marina Promenade. Features dual balconies overlooking luxury yachts, sleek polished stone floors, fitted German appliances, and dual master suites with spa-inspired en-suite bathrooms.",
    area: "Dubai Marina",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 4,
    price: 4600000,
    size: 2150,
    status: "READY",
    imageUrl: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Full Marina Views",
      "Direct Marina Walk Access",
      "Infinity-Edge Pool",
      "Squash & Tennis Courts",
      "Spa & Steam Room"
    ]),
    featured: true,
  },
  {
    slug: "fairway-villas-dubai-hills-estate",
    title: "Fairway Signature Villa",
    description: "An architectural masterpiece fronting the 18-hole championship golf course in Dubai Hills Estate. Designed with organic limestone facades, double-height ceilings, a sunken fire pit lounge, and a landscaped private garden with swimming pool.",
    area: "Dubai Hills Estate",
    type: "Villa",
    bedrooms: 5,
    bathrooms: 6,
    price: 16500000,
    size: 7200,
    status: "OFF_PLAN",
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Championship Golf Course View",
      "Private Landscaped Garden & Pool",
      "Double-Height Living Hall",
      "Driver & Maid's Quarters",
      "EV Charging Station",
      "Gated Luxury Community"
    ]),
    featured: true,
  },
  {
    slug: "one-canal-waterfront-penthouse-business-bay",
    title: "One Canal Sky Villa",
    description: "A showstopping sky villa gracefully suspended over the Dubai Water Canal in Business Bay. Created in collaboration with world-renowned designers, boasting private sky gardens, cantilevered swimming pools, and dedicated private butler service.",
    area: "Business Bay",
    type: "Penthouse",
    bedrooms: 4,
    bathrooms: 5,
    price: 24000000,
    size: 5800,
    status: "OFF_PLAN",
    imageUrl: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Dubai Water Canal Frontage",
      "Private Cantilevered Pool",
      "Dedicated Sky Garden",
      "Private Cinema",
      "High-Tech Home Automation"
    ]),
    featured: true,
  },
  {
    slug: "creek-waters-haven-dubai-creek-harbour",
    title: "Creek Waters Waterfront Residence",
    description: "Contemporary high-rise living with unobstructed views of the historic Dubai Creek and the upcoming Creek Tower. Natural wood and brushed brass accents throughout, surrounded by waterfront promenades and verdant parks.",
    area: "Dubai Creek Harbour",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    price: 2450000,
    size: 1280,
    status: "OFF_PLAN",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Waterfront Promenade Access",
      "Marina & Skyline Views",
      "Resort Style Sun Deck",
      "Children's Splash Park",
      "Fitness & Yoga Studios"
    ]),
    featured: false,
  },
  {
    slug: "jumeirah-islands-luxury-villa-palm-jumeirah",
    title: "Royal Azure Beachfront Villa",
    description: "Direct pristine beachfront villa on Palm Jumeirah's exclusive Frond G. Private white sandy beach, heated zero-edge pool, rooftop observation deck, cinema room, and private mooring for small vessels.",
    area: "Palm Jumeirah",
    type: "Villa",
    bedrooms: 6,
    bathrooms: 7,
    price: 49000000,
    size: 11500,
    status: "READY",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Private Sandy Beach",
      "Frond G Billionaires Row",
      "Heated Zero-Edge Pool",
      "Rooftop Observation Terrace",
      "Staff Accommodation for 4"
    ]),
    featured: true,
  },
  {
    slug: "palmera-serene-villa-arabian-ranches",
    title: "Palmera Spanish Colonial Villa",
    description: "Nestled within the tranquil community of Arabian Ranches, this Spanish colonial-style family villa features terracotta tiled roofs, an interior courtyard with calming water fountain, mature date palms, and a spacious outdoor entertaining pergola.",
    area: "Arabian Ranches",
    type: "Villa",
    bedrooms: 4,
    bathrooms: 4,
    price: 5900000,
    size: 4200,
    status: "READY",
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Equestrian & Polo Club Access",
      "Private Swimming Pool & Pergola",
      "Mature Landscaped Garden",
      "Walk to Community Center & School",
      "Double Garage"
    ]),
    featured: false,
  },
  {
    slug: "oxford-terrace-modern-jvc",
    title: "Oxford Terrace Smart Apartment",
    description: "A boutique development in Jumeirah Village Circle combining intuitive Italian design with eco-conscious energy solutions. Double-glazed tinted acoustics, integrated Bosch appliances, and smart keyless entry.",
    area: "Jumeirah Village Circle",
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 2,
    price: 980000,
    size: 890,
    status: "READY",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Smart Keyless Access",
      "High ROI Rental Yield",
      "Rooftop Swimming Pool",
      "Outdoor Cinema Lounge",
      "Covered Basement Parking"
    ]),
    featured: false,
  },
  {
    slug: "meydan-horizon-luxury-townhouse",
    title: "The Horizon Garden Townhouse",
    description: "Sleek 3-storey architectural townhouse in Meydan, only 10 minutes from Downtown Dubai. Generous private garden, rooftop BBQ terrace overlooking the Meydan Racecourse, and minimalist bespoke woodwork.",
    area: "Meydan",
    type: "Townhouse",
    bedrooms: 4,
    bathrooms: 5,
    price: 4950000,
    size: 3800,
    status: "OFF_PLAN",
    imageUrl: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Rooftop Sky Terrace",
      "Private Elevator Provision",
      "Meydan Racecourse Proximity",
      "Lush Green Park View",
      "Smart Energy Saving HVAC"
    ]),
    featured: false,
  },
  {
    slug: "sobha-hartland-canal-villa-meydan",
    title: "Sobha Hartland Forest Villa",
    description: "Immersed in an 8-million-sq-ft green community in Meydan with crystal lagoons. Features private elevator, swimming pool, courtyard with Japanese maple tree, glass-enclosed car display gallery, and automated blinds.",
    area: "Meydan",
    type: "Villa",
    bedrooms: 5,
    bathrooms: 6,
    price: 18500000,
    size: 8400,
    status: "READY",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Crystal Lagoon Access",
      "Glass Car Display Gallery",
      "Private Plunge Pool & Spa",
      "Forest Canopy Views",
      "Top International Schools Nearby"
    ]),
    featured: false,
  },
  {
    slug: "uptown-tower-sky-apartment-jlt",
    title: "Uptown Tower Sky Residence",
    description: "Perched high above Jumeirah Lake Towers in the iconic Uptown Tower. Boasting sweeping vistas across Emirates Golf Course, Dubai Marina, and the sparkling coastline. Complete with five-star hotel services and world-class culinary venues.",
    area: "Jumeirah Lake Towers",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 3,
    price: 3200000,
    size: 1650,
    status: "READY",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Emirates Golf Course View",
      "Metro Station Footbridge Link",
      "Hotel Amenities by SO/",
      "Infinity Sky Pool",
      "Valet and Concierge"
    ]),
    featured: false,
  },
  {
    slug: "the-address-opera-view-downtown",
    title: "The Address Residences Opera View",
    description: "Five-star branded serviced residence in Downtown Dubai managed by Address Hotels + Resorts. Seamless turnkey luxury, twice-weekly housekeeping, and prime views of the Dubai Fountains and Burj Khalifa.",
    area: "Downtown Dubai",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 4,
    price: 6800000,
    size: 2400,
    status: "READY",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Full Dubai Fountain View",
      "Turnkey Serviced Luxury",
      "Address Hotel Housekeeping",
      "Infinity Pool Deck",
      "Direct Bridge to Dubai Mall"
    ]),
    featured: true,
  },
  {
    slug: "marina-promenade-aurora-residence",
    title: "Aurora Residence Marina Promenade",
    description: "A serene waterfront corner home nestled in Marina Promenade. Wide wraparound balcony, solid oak parquetry, premium marble island, and peaceful pedestrian boardwalk access directly outside the front lobby.",
    area: "Dubai Marina",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    price: 2650000,
    size: 1420,
    status: "READY",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Corner Unit with Marina Panorama",
      "Walk to JBR The Beach",
      "Full Fitness Health Club",
      "Children's Play Zone",
      "Secure Underground Parking"
    ]),
    featured: false,
  },
  {
    slug: "park-horizon-dubai-hills",
    title: "Park Horizon Nature View",
    description: "Overlooking Dubai Hills Park, this contemporary residence provides a relaxing green sanctuary just moments from Dubai Hills Mall. Clean Scandinavian design lines, natural sunlight, and resort-grade leisure podiums.",
    area: "Dubai Hills Estate",
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    price: 1450000,
    size: 780,
    status: "OFF_PLAN",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Direct Dubai Hills Park Access",
      "Walk to Dubai Hills Mall",
      "Infinity Pool on Podium",
      "Modern Co-working Lounge",
      "Attractive Off-plan Payment Plan"
    ]),
    featured: false,
  },
  {
    slug: "creek-palace-waterfront-penthouse",
    title: "Creek Palace Duplex Penthouse",
    description: "An ultra-luxe duplex penthouse at Dubai Creek Harbour with double-height glass framing the Creek Marina and Downtown Dubai. Private rooftop jacuzzi deck, bespoke Italian walk-in dressing rooms, and smart glass privacy windows.",
    area: "Dubai Creek Harbour",
    type: "Penthouse",
    bedrooms: 4,
    bathrooms: 5,
    price: 14800000,
    size: 5200,
    status: "OFF_PLAN",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Duplex Layout with Sky Jacuzzi",
      "Direct Yacht Marina Berth Access",
      "Full Downtown Skyline Panorama",
      "Custom Italian Dressing Suites",
      "Private Elevator Lobby"
    ]),
    featured: true,
  },
  {
    slug: "camelia-botanical-townhouse-arabian-ranches-2",
    title: "Camelia Botanical Townhouse",
    description: "Spacious 3-bedroom corner townhouse in Arabian Ranches 2. Surrounded by manicured walking paths, cycling trails, sports courts, and top-tier community retail. Open plan kitchen leading to private green lawn.",
    area: "Arabian Ranches",
    type: "Townhouse",
    bedrooms: 3,
    bathrooms: 4,
    price: 3100000,
    size: 2600,
    status: "READY",
    imageUrl: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Corner Unit with Larger Garden",
      "Community Swimming Pool & Tennis",
      "Near Ranches Souk & Fitness First",
      "Family-Centric Peaceful Haven"
    ]),
    featured: false,
  },
  {
    slug: "binghatti-canal-residence-business-bay",
    title: "Binghatti Canal Chic Suite",
    description: "Striking contemporary architecture with modern geometric balconies overlooking Dubai Water Canal. Close proximity to Downtown Dubai financial core and fine dining destinations.",
    area: "Business Bay",
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 2,
    price: 1350000,
    size: 920,
    status: "READY",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Canal Boardwalk Access",
      "Olympic Size Swimming Pool",
      "Health Club & Sauna",
      "High Yield Short Term Rental Potential"
    ]),
    featured: false,
  },
  {
    slug: "diamondz-luxury-residence-jlt",
    title: "Diamondz Wellness Tower",
    description: "A groundbreaking wellness-inspired luxury tower in Jumeirah Lake Towers. Designed with over 40 lifestyle amenities including bowling alley, golf simulator, open-air yoga deck, and steam sauna pods.",
    area: "Jumeirah Lake Towers",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    price: 3800000,
    size: 1950,
    status: "OFF_PLAN",
    imageUrl: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "40+ Lifestyle & Wellness Amenities",
      "Golf Simulator & Bowling Alley",
      "Rooftop Infinity Pool",
      "Flexible Post-Handover Payment",
      "Walking Distance to DMCC Metro"
    ]),
    featured: false,
  },
  {
    slug: "la-riviera-azure-jvc",
    title: "La Riviera Azure Penthouse",
    description: "A rare boutique penthouse in JVC with panoramic views of the Dubai skyline. Private rooftop terrace with outdoor BBQ kitchen, custom recessed lighting, and designer Italian finishes.",
    area: "Jumeirah Village Circle",
    type: "Penthouse",
    bedrooms: 3,
    bathrooms: 4,
    price: 2450000,
    size: 2800,
    status: "READY",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Expansive Private Sky Terrace",
      "Outdoor Kitchen & Lounge",
      "Smart Home Sound System",
      "Low Service Charges",
      "Two Reserved Parking Bays"
    ]),
    featured: false,
  },
  {
    slug: "bliss-urban-townhouse-arabian-ranches-3",
    title: "Bliss Whitewashed Townhouse",
    description: "Dubai's first urban village inspired by Santorini and coastal Mediterranean towns. Pedestrianized cobbled streets, flowing water streams, white facades, and green courtyards in Arabian Ranches 3.",
    area: "Arabian Ranches",
    type: "Townhouse",
    bedrooms: 3,
    bathrooms: 3,
    price: 2750000,
    size: 2200,
    status: "READY",
    imageUrl: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Santorini-Inspired Architecture",
      "Pedestrianized Winding Streets",
      "Community Water Stream",
      "Children's Playparks & Splash Pads",
      "Direct Central Park Access"
    ]),
    featured: false,
  },
  {
    slug: "district-one-contemporary-mansion-meydan",
    title: "District One Lagoon Waterfront Mansion",
    description: "A monumental bespoke mansion in Mohammed Bin Rashid Al Maktoum City (District One). Featuring direct access to the world's largest crystal lagoon, glass interior courtyard, subterranean private entertainment lounge, and basement garage for 6 cars.",
    area: "Meydan",
    type: "Villa",
    bedrooms: 6,
    bathrooms: 8,
    price: 42000000,
    size: 12500,
    status: "READY",
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"
    ]),
    features: JSON.stringify([
      "Direct Crystal Lagoon Shoreline",
      "7km Cycling and Running Track",
      "Private Home Theater & Spa",
      "6-Car Subterranean Gallery",
      "Private Elevator Across 3 Floors"
    ]),
    featured: true,
  }
];

async function main() {
  console.log("🌱 Starting idempotent seed for NovaEstate Properties...");

  // 1. Seed or update Admin
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@novaestate.ae";
  const rawPassword = process.env.ADMIN_DEFAULT_PASSWORD || "AdminNovaPassword2026!";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      name: "NovaEstate Executive Admin",
      passwordHash: passwordHash,
      role: "SUPERADMIN",
    },
    create: {
      name: "NovaEstate Executive Admin",
      email: adminEmail,
      passwordHash: passwordHash,
      role: "SUPERADMIN",
    },
  });

  console.log(`✅ Admin account configured: ${admin.email}`);

  // 2. Seed 22 demonstration properties across 10 key Dubai communities
  let propertiesCount = 0;
  for (const propertyData of sampleProperties) {
    await prisma.property.upsert({
      where: { slug: propertyData.slug },
      update: {
        title: propertyData.title,
        description: propertyData.description,
        area: propertyData.area,
        type: propertyData.type,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        price: propertyData.price,
        size: propertyData.size,
        status: propertyData.status,
        imageUrl: propertyData.imageUrl,
        images: propertyData.images,
        features: propertyData.features,
        featured: propertyData.featured,
      },
      create: {
        ...propertyData,
      },
    });
    propertiesCount++;
  }

  console.log(`✅ Successfully seeded ${propertiesCount} demonstration properties across Dubai.`);

  // 3. Seed sample enquiries only if none exist (protects existing real enquiries)
  const existingEnquiriesCount = await prisma.enquiry.count();
  if (existingEnquiriesCount === 0) {
    const palmPenthouse = await prisma.property.findUnique({
      where: { slug: "the-crown-penthouse-palm-jumeirah" },
    });
    const marinaGate = await prisma.property.findUnique({
      where: { slug: "marina-gate-waterfront-residence" },
    });
    const fairwayVilla = await prisma.property.findUnique({
      where: { slug: "fairway-villas-dubai-hills-estate" },
    });

    if (palmPenthouse) {
      await prisma.enquiry.create({
        data: {
          name: "Lord Alexander Hastings",
          email: "alexander.hastings@mayfairholdings.co.uk",
          phone: "+44 7700 900142",
          message: "Interested in arranging a private VIP viewing for The Crown Penthouse next Thursday. Please coordinate with my family office.",
          propertyId: palmPenthouse.id,
          status: "NEW",
        },
      });
    }

    if (marinaGate) {
      await prisma.enquiry.create({
        data: {
          name: "Dr. Sofia Al-Mansoori",
          email: "sofia.mansoori@dubaiclinic.ae",
          phone: "+971 50 123 4567",
          message: "Looking to purchase for investment. Could you please share the historical rental yield and service charge breakdown?",
          propertyId: marinaGate.id,
          status: "CONTACTED",
        },
      });
    }

    if (fairwayVilla) {
      await prisma.enquiry.create({
        data: {
          name: "Marcus Vance",
          email: "marcus@vancecapital.ch",
          phone: "+41 22 819 4500",
          message: "Requesting payment plan schedule and anticipated handover date for the Fairway Signature Villa in Dubai Hills.",
          propertyId: fairwayVilla.id,
          status: "CLOSED",
        },
      });
    }

    console.log("✅ Seeded initial demonstration enquiries.");
  } else {
    console.log(`ℹ️ Existing enquiries found (${existingEnquiriesCount}). Preserved user enquiry data.`);
  }

  console.log("🌟 Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
