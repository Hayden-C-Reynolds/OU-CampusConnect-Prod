// src/types/departments.ts

export const schools = [
  { id: "arts_sciences",      name: "School of Arts & Sciences",              icon: "🔬" },
  { id: "business",           name: "School of Business",                     icon: "💼" },
  { id: "education_social",   name: "School of Education & Social Sciences",  icon: "🎓" },
  { id: "nursing_health",     name: "School of Nursing & Health Professions", icon: "🩺" },
  { id: "theology",           name: "School of Theology",                     icon: "📜" },
] as const;

export type SchoolId = (typeof schools)[number]["id"];

export interface Department {
  id: string;
  name: string;
  /** Extra line under the name, e.g. which majors a department covers */
  note?: string;
  school: SchoolId;
  chair: {
    name: string;
    title?: string;
    email?: string;
    phone?: string;
  };
  /** Must match an `id` in campusLocations (src/types/locations.ts). Omit if unknown. */
  locationId?: string;
  /** Office / room number inside the building, e.g. "Room 214" */
  office?: string;
  website?: string;
}

// TODO(data team): replace every "TBD" chair with the real department chair
// info. An empty "" means "not filled in yet": the page hides an empty email
// and shows "Building TBD" (with no map buttons) for an empty locationId.
export const departments: Department[] = [
  // ── School of Arts & Sciences ──
  {
    id: "biology",
    name: "Biology",
    school: "arts_sciences",
    chair: {
      name: "Elaine Vanterpool, Ph.D.",
      title: "Department Chair",
      email: "evanterpool@oakwood.edu",
    },
    locationId: "cooper_cc3",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    school: "arts_sciences",
    chair: {
      name: "TBD",
      title: "Department Chair",
      email: "",
    },
    locationId: "",
  },
  {
    id: "communication",
    name: "Communication",
    school: "arts_sciences",
    chair: {
      name: "TBD",
      title: "Department Chair",
      email: "",
    },
    locationId: "",
  },
  {
    id: "english_foreign_languages",
    name: "English & Foreign Languages",
    school: "arts_sciences",
    chair: {
      name: "TBD",
      title: "Department Chair",
      email: "",
    },
    locationId: "moran_hall",
  },
  {
    id: "mathematics_computer_science",
    name: "Mathematics & Computer Science",
    school: "arts_sciences",
    chair: {
      name: "Dr. Shushannah Smith",
      title: "Department Chair",
      email: "ssmith@oakwood.edu",
    },
    locationId: "cooper_cc2",
  },
  {
    id: "music",
    name: "Music",
    school: "arts_sciences",
    chair: {
      name: "Julie Moore-Foster",
      title: "Department Chair",
      email: "jmfoster@oakwood.edu",
    },
    locationId: "peters_hall",
  },
  {
    id: "psychological_sciences",
    name: "Psychological Sciences",
    school: "arts_sciences",
    chair: {
      name: "TBD",
      title: "Department Chair",
      email: "",
    },
    locationId: "",
  },

  // ── School of Business ──
  {
    id: "business_information_systems",
    name: "Business & Information Systems",
    note: "Includes Accounting, Finance, Management, and Marketing",
    school: "business",
    chair: {
      name: "TBD",
      title: "Department Chair",
      email: "",
    },
    locationId: "mckee_bt",
  },

  // ── School of Education & Social Sciences ──
  {
    id: "education",
    name: "Education",
    school: "education_social",
    chair: {
      name: "TBD",
      title: "Department Chair",
      email: "",
    },
    locationId: "",
  },
  {
    id: "history_political_science",
    name: "History & Political Science",
    school: "education_social",
    chair: {
      name: "TBD",
      title: "Department Chair",
      email: "",
    },
    locationId: "moran_hall",
  },
  {
    id: "social_work",
    name: "Social Work",
    school: "education_social",
    chair: {
      name: "Dr. Shalunda Allen-Sherrod, DSW, LICSW-S, PIP",
      title: "Department Chair, Interim Dean of Health Professions, Education and Social Services",
      email: "ssherrod@oakwood.edu",
    },
    locationId: "green_hall",
  },

  // ── School of Nursing & Health Professions ──
  {
    id: "health_human_services",
    name: "Health & Human Services",
    school: "nursing_health",
    chair: {
      name: "TBD",
      title: "Department Chair",
      email: "",
    },
    locationId: "natatorium",
  },
  {
    id: "nursing",
    name: "Nursing",
    school: "nursing_health",
    chair: {
      name: "Karen Anderson",
      title: "Interim Department Chair",
      email: "kanderson@oakwood.edu",
    },
    locationId: "cooper_cc1",
  },
  {
    id: "nutrition_dietetics",
    name: "Nutrition & Dietetics",
    school: "nursing_health",
    chair: {
      name: "LaTonya Dixon, MSc; PhD",
      title: "Department Chair",
      email: "ldixon@oakwood.edu",
    },
    locationId: "cooper_cc1",
  },

  // ── School of Theology ──
  {
    id: "religion",
    name: "Religion & Theology",
    school: "theology",
    chair: {
      name: "Gilbert Okuro Ojwang, Ph.D.",
      title: "Department Chair, Associate Professor",
      email: "gojwang@oakwood.edu",
    },
    locationId: "bradford_cleveland",
  },
];
