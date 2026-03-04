// src/types/locations.ts
import { CampusLocation } from "./data";

export const campusLocations: CampusLocation[] = [
  {
    id: "eva_library",
    name: "Eva B. Dykes Library",
    lat: 34.756306,
    lng: -86.651611,
    category: "Library",
    description: "Main campus library with extensive collections and study spaces.",
    hours: { open: "8:00 AM", close: "10:00 PM" },
    extra: "Includes group study rooms, archives, and computer access."
  },
  {
    id: "blake_center",
    name: "Blake Center",
    lat: 34.756222,
    lng: -86.652861,
    category: "Admin / Dining",
    description: "Administration & Blake Dining Hall for on-campus residents.",
    hours: { open: "7:00 AM", close: "9:00 PM" },
    extra: "Houses administrative offices and the dining hall."
  },
  {
    id: "oakwood_church",
    name: "Oakwood University Church",
    lat: 34.753222,
    lng: -86.651222,
    category: "Church",
    description: "Oakwood University Church on Adventist Blvd.",
    hours: { open: "9:00 AM", close: "9:00 PM" },
    extra: "Hosts weekly services, choir events, and campus worship."
  },
  {
    id: "holland_hall",
    name: "Holland Hall",
    lat: 34.757556,
    lng: -86.650000,
    category: "Dormitory",
    description: "Residence hall for students.",
    hours: { open: "24/7", close: "—" },
    extra: "Includes lounge areas and student housing."
  },
  {
    id: "edwards_hall",
    name: "Edwards Hall",
    lat: 34.756000,
    lng: -86.650778,
    category: "Dormitory",
    description: "Residence hall with study spaces.",
    hours: { open: "24/7", close: "—" },
    extra: "Known for its proximity to central campus."
  },
  {
    id: "cunningham_hall",
    name: "Cunningham Hall",
    lat: 34.756611,
    lng: -86.654611,
    category: "Dormitory",
    description: "Student residence hall.",
    hours: { open: "24/7", close: "—" },
    extra: "Located near Cooper Complex."
  },
  {
    id: "moran_hall",
    name: "Moran Hall",
    lat: 34.755806,
    lng: -86.655389,
    category: "Dormitory",
    description: "Student housing and community events.",
    hours: { open: "24/7", close: "—" },
    extra: "Popular among upperclassmen."
  },
  {
    id: "cooper_cc1",
    name: "Cooper Complex CC1",
    lat: 34.754889,
    lng: -86.653139,
    category: "Science / Academic",
    description: "Part of the E. A. Cooper Science Complex.",
    hours: { open: "8:00 AM", close: "8:00 PM" },
    extra: "Labs and classrooms for science programs."
  },
  {
    id: "cooper_cc2",
    name: "Cooper Complex CC2",
    lat: 34.754611,
    lng: -86.653111,
    category: "Science / Academic",
    description: "Second building of the Cooper Science Complex.",
    hours: { open: "8:00 AM", close: "8:00 PM" },
    extra: "Includes specialized labs."
  },
  {
    id: "cooper_cc3",
    name: "Cooper Complex CC3",
    lat: 34.754278,
    lng: -86.653083,
    category: "Science / Academic",
    description: "Third building of the Cooper Science Complex.",
    hours: { open: "8:00 AM", close: "8:00 PM" },
    extra: "Classrooms and faculty offices."
  },
  {
    id: "oakwood_academy",
    name: "Oakwood Adventist Academy",
    lat: 34.757944,
    lng: -86.660861,
    category: "School",
    description: "Private K–12 academy affiliated with Oakwood University.",
    hours: { open: "7:30 AM", close: "4:00 PM" },
    extra: "Hosts sports teams and community events."
  },
  {
    id: "knight_hall",
    name: "Knight Hall",
    lat: 34.756000,
    lng: -86.658444,
    category: "Dormitory",
    description: "Residence hall for students.",
    hours: { open: "24/7", close: "—" },
    extra: "Recently renovated with modern amenities."
  },
  {
    id: "peterson_hall",
    name: "Peterson Hall",
    lat: 34.756639,
    lng: -86.656806,
    category: "Academic",
    description: "Academic building with classrooms and lecture halls.",
    hours: { open: "8:00 AM", close: "8:00 PM" },
    extra: "Hosts multiple academic departments."
  },
  {
    id: "ford_hall",
    name: "Ford Hall",
    lat: 34.757020,
    lng: -86.655490,
    category: "Academic",
    description: "Ford Hall classrooms and offices.",
    hours: { open: "8:00 AM", close: "8:00 PM" },
    extra: "Home to general education courses."
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
    lat: 34.753000,
    lng: -86.655300,
    category: "Academic",
    description: "Business & Technology Complex (McKee).",
    hours: { open: "8:00 AM", close: "8:00 PM" },
    extra: "Computer labs and business classrooms."
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
    description: "Student residence hall.",
    hours: { open: "24/7", close: "—" },
    extra: "Known for community events."
  },
  {
    id: "burrell_hall",
    name: "Burrell Hall",
    lat: 34.755250,
    lng: -86.655556,
    category: "Dormitory",
    description: "Residence hall.",
    hours: { open: "24/7", close: "—" },
    extra: "Provides traditional dorm housing."
  },
  {
    id: "peters_hall",
    name: "Peters Hall",
    lat: 34.756722,
    lng: -86.653472,
    category: "Dormitory",
    description: "Residence hall.",
    hours: { open: "24/7", close: "—" },
    extra: "Includes lounges and community areas."
  },
  {
    id: "food_distribution",
    name: "Food Distribution Center",
    lat: 34.752694,
    lng: -86.650722,
    category: "Facility",
    description: "Campus food distribution warehouse.",
    hours: { open: "9:00 AM", close: "6:00 PM" },
    extra: "Supports Oakwood’s community programs."
  },
  {
    id: "bookstore",
    name: "Campus Bookstore",
    lat: 34.757389,
    lng: -86.656083,
    category: "Store",
    description: "Campus bookstore for supplies and Oakwood gear.",
    hours: { open: "9:00 AM", close: "6:00 PM" },
    extra: "Sells apparel, books, and electronics."
  },
  {
    id: "market",
    name: "OU Market",
    lat: 34.751417,
    lng: -86.647778,
    category: "Store",
    description: "Local convenience market near campus.",
    hours: { open: "8:00 AM", close: "10:00 PM" },
    extra: "Snacks, drinks, and essentials."
  },
  {
    id: "west_oaks",
    name: "West Oaks Apartments",
    lat: 34.754583,
    lng: -86.661028,
    category: "Housing",
    description: "Off-campus apartment-style housing for students.",
    hours: { open: "24/7", close: "—" },
    extra: "Apartment-style living near campus."
  },
  {
    id: "soccer_field",
    name: "Soccer Field",
    lat: 34.755250,
    lng: -86.655556,
    category: "Sports",
    description: "Outdoor soccer field.",
    hours: { open: "6:00 AM", close: "11:00 PM" },
    extra: "Used for student games and intramural sports."
  },
  {
    id: "track_field",
    name: "Track Field",
    lat: 34.758639,
    lng: -86.657306,
    category: "Sports",
    description: "Campus track and running field.",
    hours: { open: "6:00 AM", close: "10:00 PM" },
    extra: "Athletic training and student exercise."
  },
  {
    id: "baseball_field",
    name: "Baseball Field",
    lat: 34.758444,
    lng: -86.656139,
    category: "Sports",
    description: "Baseball field for campus athletics.",
    hours: { open: "6:00 AM", close: "10:00 PM" },
    extra: "Used for practice and official games."
  },
    {
    id: "bradford_cleveland",
    name: "Bradford Cleveland Building",
    lat: 34.753139, // 34°45'11.3"N → 34.753139
    lng: -86.652278, // 86°39'08.2"W → -86.652278
    category: "Academic",
    description: "Academic and administrative facility on campus.",
    hours: { open: "8:00 AM", close: "8:00 PM" },
    extra: "Houses classrooms and faculty offices."
  },
  {
    id: "mosley_complex",
    name: "Mosley Complex",
    lat: 34.753167, // 34°45'11.4"N → 34.753167
    lng: -86.651861, // 86°39'06.7"W → -86.651861
    category: "Academic",
    description: "Mosley Complex for academic programs and student services.",
    hours: { open: "8:00 AM", close: "8:00 PM" },
    extra: "Includes lecture halls and student resource offices."
  },
    {
    id: "oakwood_police",
    name: "Oakwood Police",
    lat: 34.757083,
    lng: -86.655472,
    category: "Facility",
    description: "Campus police station for safety and security.",
    hours: { open: "24/7", close: "—" },
    extra: "Handles all campus safety and emergency situations."
  },
  {
    id: "life_minister_service",
    name: "Life and Minister Service",
    lat: 34.757139,
    lng: -86.655028,
    category: "Ministry",
    description: "Life and Minister Service office on campus.",
    hours: { open: "8:00 AM", close: "6:00 PM" },
    extra: "Provides ministry support and counseling services."
  },
];
