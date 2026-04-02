// src/types/locations.ts
import { CampusLocation } from "./data";

export const campusLocations: CampusLocation[] = [
  {
    id: "eva_library",
    name: "Eva B. Dykes Library",
    lat: 34.756756,
    lng: -86.651405,
    category: "Library",
    description: "Main campus library with extensive collections and study spaces.",
    hours: { open: "8:00 AM", close: "10:00 PM" },
    extra: "Includes group study rooms, archives, and computer access.",
    acronyms: ["EBDL", "LIBR"]
  },
  {
    id: "blake_center",
    name: "Blake Center",
    lat: 34.756222,
    lng: -86.652861,
    category: "Admin / Dining",
    description: "Administration & Blake Dining Hall for on-campus residents.",
    hours: { open: "7:00 AM", close: "9:00 PM" },
    extra: "Houses administrative offices and the dining hall.",
    acronyms: ["BC"]
  },
  {
    id: "oakwood_church",
    name: "Oakwood University Church",
    lat: 34.753082,
    lng: -86.650781,
    category: "Church",
    description: "Oakwood University Church on Adventist Blvd.",
    hours: { open: "9:00 AM", close: "9:00 PM" },
    extra: "Hosts weekly services, choir events, and campus worship.",
    acronyms: ["OUC", "CHURCH"]
  },
  {
    id: "holland_hall",
    name: "Holland Hall",
    lat: 34.757556,
    lng: -86.650000,
    category: "Dormitory",
    description: "Residence hall for students.",
    hours: { open: "24/7", close: "—" },
    extra: "Includes lounge areas and student housing.",
    acronyms: ["HH"]
  },
  {
    id: "edwards_hall",
    name: "Edwards Hall",
    lat: 34.756000,
    lng: -86.650778,
    category: "Dormitory",
    description: "Residence hall with study spaces.",
    hours: { open: "24/7", close: "—" },
    extra: "Known for its proximity to central campus.",
    acronyms: ["EH"]
  },
  {
    id: "cunningham_hall",
    name: "Cunningham Hall",
    lat: 34.756611,
    lng: -86.654611,
    category: "Admin",
    description: "Main building for many student services on campus.",
    hours: { open: "8:00 AM", close: "5:00 PM" },
    extra: "Contains Division of Enrollment and Retention Services, the Registrar's Office, Financial Aid, Center for Student Succcess, Career Connections, Office of faculty development, the testing center, and the reading and writing lab.",
    acronyms: ["CH", "CUN"]
  },
  {
    id: "moran_hall",
    name: "Moran Hall",
    lat: 34.755806,
    lng: -86.655389,
    category: "Academic",
    description: "Contains Department of English and Foreign Languages and the Department of History and Political Science.",
    hours: { open: "24/7", close: "—" },
    extra: "Moran Hall also contains Oakwood University's Language Lab and has an audatorium that can seat 500 people. Students helped in the construction of Moran Hall in exchange for tuition and money.",
    acronyms: ["MH"]
  },
  {
    id: "cooper_cc1",
    name: "Cooper Complex CC1",
    lat: 34.754889,
    lng: -86.653139,
    category: "Academic",
    description: "Part of the E. A. Cooper Science Complex. Nursing and health sciences building within the E. A. Cooper Science Complex.",
    hours: { open: "8:00 AM", close: "8:00 PM" },
    extra: "Includes nursing classrooms, simulation labs, and faculty offices.",
    acronyms: ["CC", "CC1"]
  },
  {
    id: "cooper_cc2",
    name: "Cooper Complex CC2",
    lat: 34.754611,
    lng: -86.653111,
    category: "Academic",
    description: "Second building of the Cooper Science Complex.Mathematics and Computer Science building featuring classrooms, labs, and an auditorium.",
    hours: { open: "8:00 AM", close: "8:00 PM" },
    extra: "Includes computer labs, math classrooms, and a auditorium for lectures and events.",
    acronyms: ["CC", "CC2"]
  },
  {
    id: "cooper_cc3",
    name: "Cooper Complex CC3",
    lat: 34.754278,
    lng: -86.653083,
    category: "Academic",
    description: "A specialized modular facility primarily utilized by the School of Nursing and Health Professions for faculty offices and clinical simulation preparation.",
    hours: { open: "8:00 AM", close: "8:00 PM" },
    extra: "This building is basically bootcamp for future nurses, which is primarily why most students here don't know what a full 8 hours of sleep is.",
    acronyms: ["CC", "CC3"]
  },
  {
    id: "oakwood_academy",
    name: "Oakwood Adventist Academy",
    lat: 34.757944,
    lng: -86.660861,
    category: "School",
    description: "Private K-12 Adventist school located on campus that provides primary and secondary education with a focus on academic and spiritual development.",
    hours: { open: "8:00 AM", close: "4:00 PM" },
    extra: "Serves both campus families and the surrounding community.",
    acronyms: ["OAA"]
  },
  {
    id: "knight_hall",
    name: "Knight Hall",
    lat: 34.756000,
    lng: -86.658444,
    category: "Dormitory",
    description: "Residence hall for students.",
    hours: { open: "24/7", close: "—" },
    extra: "Recently renovated with modern amenities.",
    acronyms: ["KH"]
  },
  {
    id: "peterson_hall",
    name: "Peterson Hall",
    lat: 34.756639,
    lng: -86.656806,
    category: "Academic",
    description: "Campus residence hall providing housing accommodations for female students with shared living and study spaces.",
    hours: { open: "6:00 AM", close: "11:00 PM" },
    extra: "Primarily houses female student-athletes and honors students and also serves as a rehearsal space for the Voices of Triumph choir.",
    acronyms: ["PH"]
  },
  {
    id: "ford_hall",
    name: "Ford Hall",
    lat: 34.756816,
    lng: -86.655523,
    category: "Academic",
    description: "Houses Communication Department offices, classrooms and student services.",
    hours: { open: "7:00 AM", close: "5:00 PM" },
    extra: "Adjacent to Ford Hall, the Leroy and Lois Peters Media Center houses Oakwood University Broadcast Network (OUBN), studios, offices, and editing suites.",
    acronyms: ["FH"]
  },
  {
    id: "ola_church",
    name: "Oakwood Memorial SDA Church (OLA)",
    lat: 34.752833,
    lng: -86.651361,
    category: "Church",
    description: "Local Adventist church near campus.",
    hours: { open: "9:00 AM", close: "8:00 PM" },
    extra: "Known for its community outreach."
  },
  {
    id: "mckee_bt",
    name: "McKee Business & Technology Complex",
    lat: 34.752039,
    lng: -86.654459,
    category: "Academic",
    description: "Business & Technology Complex (McKee).",
    hours: { open: "8:00 AM", close: "8:00 PM" },
    extra: "Computer labs and business classrooms.",
    acronyms: ["MBTC", "BT"]
  },
  {
    id: "breath_of_life",
    name: "Breath of Life TV Ministries",
    lat: 34.752250,
    lng: -86.655472,
    category: "Ministry",
    description: "Broadcast and media ministry office.",
    hours: { open: "9:00 AM", close: "6:00 PM" },
    extra: "Produces televised sermons and gospel content."
  },
  {
    id: "carter_hall",
    name: "Carter Hall",
    lat: 34.755722,
    lng: -86.654083,
    category: "Dormitory",
    description: "Campus residence hall providing housing accommodations for female freshman.",
    hours: { open: "6:00 AM", close: "10:00 PM" },
    extra: "Dean Office Hours: 8:00 AM - 5:00 PM",
    acronyms: ["CH"]
  },
  {
    id: "burrell_hall",
    name: "Burrell Hall",
    lat: 34.755250,
    lng: -86.655556,
    category: "Academic",
    description: "Campus education hall that primarily houses communication classes and offices",
    hours: { open: "8:00 AM", close: "5:00 PM" },
    extra: "Friday Hours: 8:00 AM - 12:00 PM",
    acronyms: ["BH"]
  },
  {
    id: "peters_hall",
    name: "Peters Hall",
    lat: 34.756722,
    lng: -86.653472,
    category: "Dormitory",
    description: "Residence hall.",
    hours: { open: "24/7", close: "—" },
    extra: "Includes lounges and community areas.",
    acronyms: ["PHFA"]
  },
  {
    id: "food_distribution",
    name: "Food Distribution Center",
    lat: 34.752694,
    lng: -86.650722,
    category: "Facility",
    description: "Campus food distribution warehouse.",
    hours: { open: "9:00 AM", close: "6:00 PM" },
    extra: "Supports Oakwood's community programs."
  },
  {
    id: "bookstore",
    name: "Campus Bookstore",
    lat: 34.757389,
    lng: -86.656083,
    category: "Store",
    description: "Campus bookstore for supplies and Oakwood gear.",
    hours: { open: "9:00 AM", close: "6:00 PM" },
    extra: "Sells apparel, books, and electronics.",
    acronyms: ["OMB"]
  },
  {
    id: "market",
    name: "OU Market",
    lat: 34.751417,
    lng: -86.647778,
    category: "Store",
    description: "Local convenience market near campus.",
    hours: { open: "8:00 AM", close: "10:00 PM" },
    extra: "Snacks, drinks, and essentials.",
    acronyms: ["OMB"]
  },
  {
    id: "west_oaks",
    name: "West Oaks Apartments",
    lat: 34.754583,
    lng: -86.661028,
    category: "Housing",
    description: "Off-campus apartment-style housing for students.",
    hours: { open: "24/7", close: "—" },
    extra: "Apartment-style living near campus.",
    acronyms: ["WOA"]
  },
  {
    id: "soccer_field",
    name: "Soccer Field",
    lat: 34.753284,
    lng: -86.654297,
    category: "Sports",
    description: "Outdoor soccer field.",
    hours: { open: "6:00 AM", close: "11:00 PM" },
    extra: "Used for student games and intramural sports.",
    acronyms: ["FIELD"]
  },
  {
    id: "track_field",
    name: "Track Field",
    lat: 34.758639,
    lng: -86.657306,
    category: "Sports",
    description: "Campus track and running field.",
    hours: { open: "6:00 AM", close: "10:00 PM" },
    extra: "Athletic training and student exercise.",
    acronyms: ["FIELD"]
  },
  {
    id: "baseball_field",
    name: "Baseball Field",
    lat: 34.758444,
    lng: -86.656139,
    category: "Sports",
    description: "Baseball field for campus athletics.",
    hours: { open: "6:00 AM", close: "10:00 PM" },
    extra: "Used for practice and official games.",
    acronyms: ["BASE"]
  },
  {
    id: "bradford_cleveland",
    name: "Bradford Cleveland Building",
    lat: 34.753139,
    lng: -86.652278,
    category: "Academic",
    description: "Academic and administrative facility on campus.",
    hours: { open: "8:00 AM", close: "8:00 PM" },
    extra: "Houses classrooms and faculty offices.",
    acronyms: ["BCBLC"]
  },
  {
    id: "mosley_complex",
    name: "Mosley Complex",
    lat: 34.753167,
    lng: -86.651861,
    category: "Academic",
    description: "Mosley Complex for academic programs and student services.",
    hours: { open: "8:00 AM", close: "8:00 PM" },
    extra: "Includes lecture halls and student resource offices.",
    acronyms: ["MOS", "MC"]
  },
  {
    id: "oakwood_police",
    name: "Oakwood University Police Department",
    lat: 34.757083,
    lng: -86.655472,
    category: "Security",
    description: "Campus police station for safety and security.",
    hours: { open: "24/7", close: "—" },
    extra: "Handles all campus safety and emergency situations.",
    acronyms: ["OUPD"]
  },
  {
    id: "spiritual_life",
    name: "Office of Spiritual Life Ministries",
    lat: 34.757139,
    lng: -86.655028,
    category: "Ministry",
    description: "Office of Spiritual Life on campus.",
    hours: { open: "8:00 AM", close: "6:00 PM" },
    extra: "Provides ministry support and counseling services.",
    acronyms: ["OSLM"]
  },
  {
    id: "bell_tower",
    name: "Bell Tower",
    lat: 34.756050,
    lng: -86.655248,
    category: "Landmark",
    description: "Iconic campus landmark located in the central quad, often used as a gathering point and symbol of Oakwood University.",
    hours: { open: "24/7", close: "—" },
    extra: " This landmark is often featured in student activities and as a memory spot during alumni homecomings.",
    acronyms: ["BT"]
  },
  {
    id: "jesus_statue",
    name: "Jesus Statue (The Quad)",
    lat: 34.754705,
    lng: -86.651706,
    category: "Landmark",
    description: "It depicts the fifth station of the cross, where Simon of Cyrene is compelled to carry the heavy wooden cross for Jesus",
    hours: { open: "24/7", close: "—" },
    extra: "this iconic landmark is the most popular gathering spot on campus for graduation photos and Friday night vespers"
  },
  {
    id: "mac",
    name: "Millet Activity Center (MAC)",
    lat: 34.757345,
    lng: -86.657892,
    category: "Sports",
    description: "Contians Oakwood University's skating rink and racquetball courts.",
    hours: { open: "24/7", close: "—" },
    extra: "The building is currently in a 3 phase renovation program.",
    acronyms: ["MAC"]
  },
  {
    id: "natatorium",
    name: "Natatorium",
    lat: 34.757383,
    lng: -86.657217,
    category: "Sports",
    description: "Campus swimming facitily containing an olympic-size and the offices for the Department of Health and Human Sciences.",
    hours: { open: "3:00 PM", close: "9:00 PM" },
    extra: "The Natatorium is also used for summer swimming lessons.",
    acronyms: ["NAT"]
  },
  {
    id: "ashby_gymnasium",
    name: "Ashby Gymnasium",
    lat: 34.757421,
    lng: -86.656783,
    category: "Sports",
    description: "Gymnasium for stundent classes and recreation",
    hours: { open: "24/7", close: "—" },
    extra: "N/A",
    acronyms: ["AA", "GYM"]
  },
  {
    id: "wade_hall",
    name: "Wade Hall",
    lat: 34.754848,
    lng: -86.650735,
    category: "Dormitory",
    description: "Campus residence hall providing housing accommodations for female upperclasswomen.",
    hours: { open: "6:00 AM", close: "10:00 PM" },
    extra: "Dean Office Hours: 8:00 AM - 5:00 PM",
    acronyms: ["WH"]
  },
  {
    id: "jt_stafford",
    name: "J.T. Stafford",
    lat: 34.755098,
    lng: -86.658790,
    category: "Academic",
    description: "N/A",
    hours: { open: "24/7", close: "—" },
    extra: "N/A",
    acronyms: ["JTS"]
  },
  {
    id: "unity_pond",
    name: "Unity Pond",
    lat: 34.753727,
    lng: -86.649640,
    category: "Landmark",
    description: "N/A",
    hours: { open: "24/7", close: "—" },
    extra: "N/A",
    acronyms: ["RP", "MALL"]
  },
  {
    id: "family_life_center",
    name: "Family Life Center",
    lat: 34.752621,
    lng: -86.649850,
    category: "Sports",
    description: "The headquarters for the Department of Social Work, featuring versatile halls used for academic seminars, community outreach, and university social functions.",
    hours: { open: "9:00 AM", close: "5:00 PM" },
    extra: "The unofficial 'Wedding Capital' of campus—if you see someone in a tuxedo on a sunday, they are probably heading here.",
    acronyms: ["FAM"]
  },
  {
    id: "campus_post_office",
    name: "Campus University Post Office",
    lat: 34.755133,
    lng: -86.654152,
    category: "Facility",
    description: "N/A",
    hours: { open: "24/7", close: "—" },
    extra: "N/A"
  },
  {
    id: "green_hall",
    name: "Green Hall",
    lat: 34.755359,
    lng: -86.654926,
    category: "Academic",
    description: "N/A",
    hours: { open: "8:00 AM", close: "8:00 PM" },
    extra: "N/A",
    acronyms: ["GH"]
  },

  // ── Landmarks ──
  {
    id: "oakwood_silos",
    name: "Oakwood Silos",
    lat: 34.753216,
    lng: -86.655079,
    category: "Landmark",
    description: "N/A",
    hours: { open: "24/7", close: "—" },
    extra: "N/A",
    acronyms: ["SILO"]
  },
  {
    id: "oakwood_amphitheater",
    name: "Oakwood Amphitheater",
    lat: 34.756604,
    lng: -86.648605,
    category: "Landmark",
    description: "N/A",
    hours: { open: "24/7", close: "—" },
    extra: "N/A",
    acronyms: ["AMP"]
  },

  // ── Security ──
  {
    id: "main_entrance_security",
    name: "Main Entrance Security Station",
    lat: 34.752904,
    lng: -86.648543,
    category: "Security",
    description: "Primary campus entry point with security personnel monitoring access and assisting visitors.",
    hours: { open: "24/7", close: "-" },
    extra: "Visitors may be required to check in or show ID.",
    acronyms: ["MAIN"]
  },
  {
    id: "west_gate_security",
    name: "West Gate Security Station",
    lat: 34.753676,
    lng: -86.659444,
    category: "Security",
    description: "Secondary campus entrance on the west side, providing security monitoring and controlled access.",
    hours: { open: "24/7", close: "-" },
    extra: "Less traffic than main entrance; may have limited hours on weekends.",
    acronyms: ["WEST"]
  },

  // ── Academic ──
  {
    id: "usm",
    name: "United Student Movement Office",
    lat: 34.757253,
    lng: -86.652561,
    category: "Academic",
    description: "This is the central hub for Oakwood’s student government where leaders advocate for student interests and coordinate campus life.",
    hours: { open: "8:00 AM", close: "6:00 PM" },
    extra: "The USM house is the heart of campus spirit—stop by to learn about upcoming social events or to voice your ideas to your student representatives.",
    acronyms: ["USM"]
  },
];