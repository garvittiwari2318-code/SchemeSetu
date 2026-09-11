/**
 * SEED DATA
 *
 * Source of truth: SchemeSetu frontend prototype.
 * Values below (names, descriptions, interest rates, loan amounts, tenure,
 * moratorium periods, eligibility rules, and weighted scoring criteria) are
 * copied EXACTLY from the prototype — nothing here is invented or altered.
 *
 * Rule encoding notes:
 * - Every hard eligibility condition from the prototype becomes a rule with
 *   hard: true (weight is irrelevant/0 for these).
 * - Every weighted scoring contributor becomes a rule with hard: false and
 *   weight set to its point allocation from the prototype.
 * - Base score and score-capping (0–100) are properties of the SCORING
 *   ALGORITHM itself, not of any single field-comparison rule, so they are
 *   NOT represented as rule documents. They are stored on the scheme as
 *   `scoring.baseScore` / `scoring.min` / `scoring.max` so the rule engine
 *   can read them from MongoDB too, without hardcoding them in code.
 * - "Sweet spot" / non-linear point curves (e.g. Term Loan's ₹7,00,000
 *   project-cost sweet spot) are described in the rule's `explanation` and
 *   carried via `value`/`weight` so the scoring engine (built separately)
 *   can compute the curve from data instead of hardcoded constants.
 */

const schemes = [
  // 1. MICRO FINANCE SCHEME
  {
    schemeId: "micro",
    name: "Micro Finance Scheme",
    description: "Small-ticket loans for self-employment / micro business",
    interestRate: 8,
    maxLoanAmount: 150000,
    maxTenureYears: 5,
    moratoriumMonths: 3,
    active: true,
    version: 1,
    scoring: {
      baseScore: 60,
      min: 0,
      max: 100,
    },
    rules: [
      {
        field: "purpose",
        operator: "in",
        value: ["starting_business", "expanding_business"],
        hard: true,
        weight: 0,
        explanation: "Purpose must be starting or expanding a business.",
      },
      {
        field: "familyIncome",
        operator: "<=",
        value: 300000,
        hard: true,
        weight: 0,
        explanation: "Family income must be less than or equal to Rs. 3,00,000/year.",
      },
      {
        field: "projectCost",
        operator: "<=",
        value: 150000,
        hard: true,
        weight: 0,
        explanation: "Project cost must be less than or equal to Rs. 1,50,000.",
      },
      {
        field: "targetCategory",
        operator: "=",
        value: true,
        hard: true,
        weight: 0,
        explanation: "Applicant must belong to a notified target category.",
      },
      {
        field: "projectCost",
        operator: "<=",
        value: 150000,
        hard: false,
        weight: 20,
        explanation:
          "Cost fit: up to 20 points, with lower cost within the Rs. 1,50,000 limit scoring higher.",
      },
      {
        field: "familyIncome",
        operator: "<=",
        value: 300000,
        hard: false,
        weight: 20,
        explanation:
          "Income fit: up to 20 points, with lower income scoring higher.",
      },
    ],
  },

  // 2. TERM LOAN SCHEME
  {
    schemeId: "term",
    name: "Term Loan Scheme",
    description: "Mid-size loans for setting up or scaling an enterprise",
    interestRate: 10,
    maxLoanAmount: 2000000,
    maxTenureYears: 7,
    moratoriumMonths: 6,
    active: true,
    version: 1,
    scoring: {
      baseScore: 55,
      min: 0,
      max: 100,
    },
    rules: [
      {
        field: "purpose",
        operator: "in",
        value: ["starting_business", "expanding_business"],
        hard: true,
        weight: 0,
        explanation: "Purpose must be starting or expanding a business.",
      },
      {
        field: "familyIncome",
        operator: "<=",
        value: 500000,
        hard: true,
        weight: 0,
        explanation: "Family income must be less than or equal to Rs. 5,00,000/year.",
      },
      {
        field: "projectCost",
        operator: "between",
        value: [100000, 2000000],
        hard: true,
        weight: 0,
        explanation: "Project cost must be between Rs. 1,00,000 and Rs. 20,00,000.",
      },
      {
        field: "age",
        operator: "between",
        value: [18, 55],
        hard: true,
        weight: 0,
        explanation: "Applicant age must be between 18 and 55.",
      },
      {
        field: "projectCost",
        operator: "between",
        value: [100000, 2000000],
        hard: false,
        weight: 20,
        explanation:
          "Project-cost fit: up to 20 points, with Rs. 7,00,000 as the sweet spot.",
      },
      {
        field: "familyIncome",
        operator: "<=",
        value: 500000,
        hard: false,
        weight: 15,
        explanation: "Income fit: up to 15 points.",
      },
      {
        field: "targetCategory",
        operator: "=",
        value: true,
        hard: false,
        weight: 8,
        explanation: "Target-category bonus: 8 points.",
      },
    ],
  },

  // 3. MAHILA SAMRIDDHI YOJANA
  {
    schemeId: "mahila",
    name: "Mahila Samriddhi Yojana",
    description: "Concessional micro-credit reserved for women entrepreneurs",
    interestRate: 6,
    maxLoanAmount: 150000,
    maxTenureYears: 5,
    moratoriumMonths: 3,
    active: true,
    version: 1,
    scoring: {
      baseScore: 65,
      min: 0,
      max: 100,
    },
    rules: [
      {
        field: "gender",
        operator: "=",
        value: "female",
        hard: true,
        weight: 0,
        explanation: "Applicant must be female.",
      },
      {
        field: "purpose",
        operator: "in",
        value: ["starting_business", "expanding_business"],
        hard: true,
        weight: 0,
        explanation: "Purpose must be starting or expanding a business.",
      },
      {
        field: "familyIncome",
        operator: "<=",
        value: 200000,
        hard: true,
        weight: 0,
        explanation: "Family income must be less than or equal to Rs. 2,00,000/year.",
      },
      {
        field: "projectCost",
        operator: "<=",
        value: 150000,
        hard: true,
        weight: 0,
        explanation: "Project cost must be less than or equal to Rs. 1,50,000.",
      },
      {
        field: "familyIncome",
        operator: "<=",
        value: 200000,
        hard: false,
        weight: 20,
        explanation: "Income fit: up to 20 points.",
      },
      {
        field: "projectCost",
        operator: "<=",
        value: 150000,
        hard: false,
        weight: 15,
        explanation: "Cost fit: up to 15 points.",
      },
    ],
  },

  // 4. EDUCATIONAL LOAN SCHEME
  {
    schemeId: "edu",
    name: "Educational Loan Scheme",
    description: "Covers tuition and related costs for professional / technical courses",
    interestRate: 9,
    maxLoanAmount: 2000000,
    maxTenureYears: 10,
    moratoriumMonths: 12,
    active: true,
    version: 1,
    scoring: {
      baseScore: 60,
      min: 0,
      max: 100,
    },
    rules: [
      {
        field: "purpose",
        operator: "=",
        value: "education",
        hard: true,
        weight: 0,
        explanation: "Purpose must be education / course fees.",
      },
      {
        field: "familyIncome",
        operator: "<=",
        value: 250000,
        hard: true,
        weight: 0,
        explanation: "Family income must be less than or equal to Rs. 2,50,000/year.",
      },
      {
        field: "courseCost",
        operator: "<=",
        value: 2000000,
        hard: true,
        weight: 0,
        explanation: "Course cost must be less than or equal to Rs. 20,00,000.",
      },
      {
        field: "age",
        operator: "between",
        value: [18, 35],
        hard: true,
        weight: 0,
        explanation: "Applicant age must be between 18 and 35.",
      },
      {
        field: "familyIncome",
        operator: "<=",
        value: 250000,
        hard: false,
        weight: 25,
        explanation: "Income fit: up to 25 points.",
      },
      {
        field: "targetCategory",
        operator: "=",
        value: true,
        hard: false,
        weight: 10,
        explanation: "Target-category bonus: 10 points.",
      },
    ],
  },
];

// ---- CITIES (reference coordinates from the prototype) ----
const cities = {
  Delhi: { lat: 28.6139, lng: 77.209 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Patna: { lat: 25.5941, lng: 85.1376 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
};

// ---- AUTHORISED PARTNERS ----
// location.coordinates follows GeoJSON order: [longitude, latitude]
const partners = [
  {
    name: "State Channelising Agency — North Zone",
    city: "Delhi",
    location: { type: "Point", coordinates: [77.2167, 28.6448] },
    schemes: ["micro", "term", "mahila", "edu"],
    verifiedOn: new Date("2026-08-12"),
  },
  {
    name: "District Cooperative Credit Cell",
    city: "Delhi",
    location: { type: "Point", coordinates: [77.0266, 28.4595] },
    schemes: ["micro", "mahila"],
    verifiedOn: new Date("2026-07-03"),
  },
  {
    name: "Maharashtra SC/ST Finance Corp Branch",
    city: "Mumbai",
    location: { type: "Point", coordinates: [72.9781, 19.2183] },
    schemes: ["micro", "term", "edu"],
    verifiedOn: new Date("2026-08-20"),
  },
  {
    name: "Urban Micro-Credit Kendra, Andheri",
    city: "Mumbai",
    location: { type: "Point", coordinates: [72.8468, 19.1197] },
    schemes: ["micro", "mahila"],
    verifiedOn: new Date("2026-06-15"),
  },
  {
    name: "UP Backward Classes Finance Corp",
    city: "Lucknow",
    location: { type: "Point", coordinates: [80.92, 26.86] },
    schemes: ["micro", "term", "mahila"],
    verifiedOn: new Date("2026-08-28"),
  },
  {
    name: "Bihar State Minorities Finance Corp",
    city: "Patna",
    location: { type: "Point", coordinates: [85.14, 25.61] },
    schemes: ["micro", "edu"],
    verifiedOn: new Date("2026-07-09"),
  },
  {
    name: "Rajasthan Rural Livelihood Mission Cell",
    city: "Jaipur",
    location: { type: "Point", coordinates: [75.81, 26.95] },
    schemes: ["term", "mahila"],
    verifiedOn: new Date("2026-08-22"),
  },
  {
    name: "Karnataka SHG Federation Office",
    city: "Bengaluru",
    location: { type: "Point", coordinates: [77.61, 12.99] },
    schemes: ["micro", "mahila", "edu"],
    verifiedOn: new Date("2026-08-30"),
  },
  {
    name: "National Cooperative Bank Branch, Whitefield",
    city: "Bengaluru",
    location: { type: "Point", coordinates: [77.75, 12.9698] },
    schemes: ["term", "edu"],
    verifiedOn: new Date("2026-08-11"),
  },
];

module.exports = { schemes, cities, partners };