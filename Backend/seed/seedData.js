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
    objective: "",
    ministry: "",
    category: "",
    sectorType: "",
    officialPortalUrl: "",
    requiredDocuments: [],
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
    objective: "",
    ministry: "",
    category: "",
    sectorType: "",
    officialPortalUrl: "",
    requiredDocuments: [],
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
    objective: "",
    ministry: "",
    category: "",
    sectorType: "",
    officialPortalUrl: "",
    requiredDocuments: [],
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
    objective: "",
    ministry: "",
    category: "",
    sectorType: "",
    officialPortalUrl: "",
    requiredDocuments: [],
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
  // 5. PMEGP
  {
    schemeId: "pmegp",
    name: "Prime Minister Employment Generation Programme (PMEGP)",
    description:
      "Credit-linked subsidy programme to generate continuous self-employment opportunities in rural and urban areas through setting up of new micro-enterprises in manufacturing and services.",

    objective:
      "To generate continuous and sustainable employment opportunities in rural and urban areas through micro-enterprises, facilitating bank credit and margin money subsidy.",

    ministry: "Ministry of Micro, Small & Medium Enterprises (MoMSME)",
    category: "MSME",
    sectorType: "Central Sector",

    benefitHeadline: "Up to 35% Capital Subsidy",
    maxCeilingText:
      "Max Project Cost: ₹50 Lakhs (Mfg) / ₹20 Lakhs (Service)",

    statutoryClause: "PMEGP Operational Guidelines Clause 4.2",

    officialPortalUrl:
      "https://www.kviconline.gov.in/pmegpeportal/",

    eligibilityParameters: [
      "Any individual above 18 years of age is eligible.",
      "Minimum VIII standard pass for projects costing above ₹10 lakh in manufacturing and above ₹5 lakh in service sector.",
      "Only newly established micro-enterprises are eligible for subsidy assistance under first loan tranche.",
      "General category subsidy: 15% (Urban) / 25% (Rural). Special category (Women, SC/ST, OBC, Minorities, PwD, Ex-Servicemen): 25% (Urban) / 35% (Rural).",
      "Own contribution required is 10% for General and 5% for Special Category beneficiaries."
    ],

    requiredDocuments: [
      "Aadhaar Card and PAN Card",
      "Detailed Project Report (DPR) / Business Blueprint",
      "Special Category Caste Certificate (if claiming affirmative subsidy rate)",
      "Educational qualification certificate (VIII pass minimum for >₹10L Mfg)",
      "Rural area certificate issued by Gram Panchayat / Revenue authority (if rural)",
      "EDP (Entrepreneurship Development Programme) completion certificate"
    ],

    recommendationEnabled: false,
    active: true,
    version: 1,

    interestRate: null,
    maxLoanAmount: null,
    maxTenureYears: null,
    moratoriumMonths: null,

    rules: [],

    scoring: {
      baseScore: 0,
      min: 0,
      max: 100
    }
  },

  // 6. STAND-UP INDIA
  {
    schemeId: "standup",
    name: "Stand-Up India Scheme for Women and SC/ST Entrepreneurs",
    description:
      "Facilitates bank loans between ₹10 lakh and ₹1 crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up greenfield enterprises.",

    objective:
      "To promote entrepreneurship among women and SC & ST communities by facilitating institutional credit for starting new business ventures in manufacturing, services, agri-allied, or trading sectors.",

    ministry: "Department of Financial Services, Ministry of Finance",
    category: "MSME",
    sectorType: "Priority Banking",

    benefitHeadline: "₹10 Lakh to ₹1 Crore",
    maxCeilingText:
      "Composite Loan Facility (Term Loan + Working Capital)",

    statutoryClause: "Stand-Up India Scheme Guidelines Rule 1.1",

    officialPortalUrl:
      "https://www.standupmitra.in/",

    eligibilityParameters: [
      "Applicant must be either an SC, ST, or Woman entrepreneur.",
      "Enterprise must be a Greenfield project (the first time venture of the beneficiary in the manufacturing, services, agri-allied activities, or trading sector).",
      "In case of non-individual enterprises, at least 51% of shareholding and controlling stake must be held by either an SC/ST or woman entrepreneur.",
      "Borrower should not be in default to any bank or financial institution.",
      "Margin money contribution is minimum 10% to 15% with convergence of other schemes."
    ],

    requiredDocuments: [
      "Identity & Address Proof (Voter ID / Passport / Aadhaar)",
      "Caste Certificate (for SC/ST applicants) issued by competent authority",
      "Greenfield Enterprise Registration / Proposed Project DPR",
      "Partnership deed or Memorandum & Articles of Association (for firms/companies)",
      "Audited balance sheets or IT returns of promoters (if existing entities participate)",
      "Rent agreement or proof of business premises"
    ],

    recommendationEnabled: false,
    active: true,
    version: 1,

    interestRate: null,
    maxLoanAmount: null,
    maxTenureYears: null,
    moratoriumMonths: null,

    rules: [],

    scoring: {
      baseScore: 0,
      min: 0,
      max: 100
    }
  },

  // 7. PM MUDRA
  {
    schemeId: "mudra",
    name: "Pradhan Mantri MUDRA Yojana (PMMY — Kishore & Tarun)",
    description:
      "Provides institutional funding to non-corporate, non-farm small and micro enterprises. Categorized into Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 Lakh), and Tarun (₹5 Lakh to ₹10 Lakh).",

    objective:
      "To formalize and fund the unfunded small businesses, enabling easy collateral-free micro credit access through Commercial Banks, RRBs, Small Finance Banks, and NBFCs.",

    ministry: "Department of Financial Services, Ministry of Finance",
    category: "MSME",
    sectorType: "Central Sector",

    benefitHeadline: "Up to ₹10 Lakhs",
    maxCeilingText: "Zero Collateral Security Required",

    statutoryClause: "PMMY Operational Framework Section 3",

    officialPortalUrl:
      "https://www.mudra.org.in/",

    eligibilityParameters: [
      "Any Indian citizen who has a business plan for non-farm income generating activity (small manufacturing units, shopkeepers, fruits/vegetable vendors, artisans, food service, repair shops).",
      "No collateral security or third-party guarantee required for loans up to ₹10 Lakh.",
      "Clean credit history with no prior defaults on any institutional credit facility.",
      "Udyam Registration required for enterprise sanction.",
      "Repayment tenure between 3 to 5 years depending on cash flow projections."
    ],

    requiredDocuments: [
      "Proof of Identity & Address (Aadhaar / Driving License / Voter Card)",
      "Udyam Registration Number Certificate",
      "Quotation of machinery, equipment, or merchandise to be purchased",
      "Bank statement for past 6 months (for existing business expansion)",
      "Proof of business address and license certificates"
    ],

    recommendationEnabled: false,
    active: true,
    version: 1,

    interestRate: null,
    maxLoanAmount: null,
    maxTenureYears: null,
    moratoriumMonths: null,

    rules: [],

    scoring: {
      baseScore: 0,
      min: 0,
      max: 100
    }
  },

  // 8. AGRICULTURE INFRASTRUCTURE FUND
  {
    schemeId: "aif",
    name: "Agriculture Infrastructure Fund (AIF)",
    description:
      "Medium to long term debt financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets.",

    objective:
      "Mobilize medium-to-long term debt financing facility for investment in post-harvest management infrastructure, cold chains, silos, warehouses, and primary processing centers.",

    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Agriculture",
    sectorType: "Central Sector",

    benefitHeadline: "3% Interest Subvention",
    maxCeilingText:
      "Loan up to ₹2 Crore per project (Max 7 years subvention)",

    statutoryClause: "AIF Operational Guidelines Clause 5.1",

    officialPortalUrl:
      "https://agriinfra.dac.gov.in/",

    eligibilityParameters: [
      "Eligible entities: Primary Agricultural Credit Societies (PACS), Marketing Cooperative Societies, Farmer Producers Organizations (FPOs), SHGs, Agri-entrepreneurs, Startups.",
      "All loans under this financing facility have interest subvention of 3% per annum up to a limit of ₹2 Crore.",
      "Credit guarantee coverage available under CGTMSE scheme for loans up to ₹2 Crore, with fee paid by the government.",
      "Moratorium for repayment may vary between minimum 6 months and maximum 2 years."
    ],

    requiredDocuments: [
      "Entity Registration / FPO / Society registration papers",
      "Detailed Project Report (DPR) detailing post-harvest asset creation",
      "Land ownership documents or registered lease deed (minimum 10 years)",
      "Bank account statement and KYC of managing members / promoter"
    ],

    recommendationEnabled: false,
    active: true,
    version: 1,

    interestRate: null,
    maxLoanAmount: null,
    maxTenureYears: null,
    moratoriumMonths: null,

    rules: [],

    scoring: {
      baseScore: 0,
      min: 0,
      max: 100
    }
  },

  // 9. MISSION SHAKTI
  {
    schemeId: "shakti",
    name: "Mission Shakti (Samarthya — Women Entrepreneurship & Empowerment)",
    description:
      "Integrated women empowerment program promoting economic self-reliance through skill training, creche facilities, collective micro-enterprise development, and institutional credit linkages.",

    objective:
      "To provide women with sustained economic autonomy, market linkages for self-help groups, and institutional support systems for safety, security, and enterprise creation.",

    ministry: "Ministry of Women & Child Development",
    category: "Social",
    sectorType: "Centrally Sponsored",

    benefitHeadline: "Women Affirmative Support",
    maxCeilingText:
      "Micro-Credit, Skill Incubation & Institutional Grants",

    statutoryClause: "Mission Shakti Samarthya Guidelines 2022-26",

    officialPortalUrl:
      "https://wcd.nic.in/",

    eligibilityParameters: [
      "Individual women entrepreneurs or Women Self Help Groups (SHGs).",
      "Preference given to rural, economically weaker sections, single mothers, and women in distress.",
      "Focus on women-led micro enterprises, handicraft collectives, food processing units, and village level services.",
      "Convergence with NRLM (National Rural Livelihoods Mission) revolving fund credit guidelines."
    ],

    requiredDocuments: [
      "Aadhaar of applicant or SHG key office bearers",
      "Bank passbook linked to Aadhaar (DBT active)",
      "SHG resolution or self-declaration for micro-enterprise proposal",
      "Proof of residence / Gram Panchayat letter"
    ],

    recommendationEnabled: false,
    active: true,
    version: 1,

    interestRate: null,
    maxLoanAmount: null,
    maxTenureYears: null,
    moratoriumMonths: null,

    rules: [],

    scoring: {
      baseScore: 0,
      min: 0,
      max: 100
    }
  },

  // 10. CEGSSC
  {
    schemeId: "cegssc",
    name: "Credit Enhancement Guarantee Scheme for SC Entrepreneurs",
    description:
      "Enables Member Lending Institutions (MLIs) to provide collateral-free financial assistance to Scheduled Caste entrepreneurs for commercially viable projects.",

    objective:
      "To promote entrepreneurship among the Scheduled Castes by providing credit guarantee covers to banks, eliminating stringent tangible asset collateral barriers.",

    ministry: "Ministry of Social Justice & Empowerment",
    category: "Social",
    sectorType: "Credit Guarantee",

    benefitHeadline: "100% Guarantee Cover",
    maxCeilingText:
      "Term Loans / Composite Loans up to ₹5 Crore",

    statutoryClause: "CEGSSC Operational Framework 2021",

    officialPortalUrl:
      "https://socialjustice.gov.in/",

    eligibilityParameters: [
      "SC individual entrepreneurs or SC-owned enterprises with more than 51% shareholding by SC promoters for at least 6 months prior to application.",
      "Management control must be held by SC promoters.",
      "Guarantee cover ranges from 100% for loans up to ₹1 Crore and graded covers up to ₹5 Crore.",
      "Valid for Greenfield and Brownfield enterprise expansions in manufacturing, trading, and service sectors."
    ],

    requiredDocuments: [
      "Caste Certificate of applicant / promoters issued by competent state revenue authority",
      "Company / Firm Registration documents confirming SC shareholding > 51%",
      "Detailed Project Report (DPR) evaluated by lending financial institution",
      "KYC documents and IT returns / Bank statements"
    ],

    recommendationEnabled: false,
    active: true,
    version: 1,

    interestRate: null,
    maxLoanAmount: null,
    maxTenureYears: null,
    moratoriumMonths: null,

    rules: [],

    scoring: {
      baseScore: 0,
      min: 0,
      max: 100
    }
  },

  // 11. PM SVANIDHI
  {
    schemeId: "svanidhi",
    name: "PM SVANidhi (Street Vendor’s AtmaNirbhar Nidhi)",
    description:
      "Special micro-credit facility for street vendors and micro retailers to restart their livelihoods. Provides working capital loan in escalating tranches upon timely repayment with interest subsidy.",

    objective:
      "To provide working capital loans, incentivize regular repayment with interest subvention, and reward digital transactions among street vendors and micro retailers.",

    ministry: "Ministry of Housing & Urban Affairs (MoHUA)",
    category: "MSME",
    sectorType: "Central Sector",

    benefitHeadline: "₹10k to ₹50k Working Capital",
    maxCeilingText:
      "7% Interest Subsidy + Cash-back on Digital Transactions",

    statutoryClause: "PM SVANidhi Scheme Notification 2020",

    officialPortalUrl:
      "https://pmsvanidhi.mohua.gov.in/",

    eligibilityParameters: [
      "Urban and peri-urban street vendors possessing Certificate of Vending or Identity Card issued by Urban Local Bodies (ULBs).",
      "Initial loan up to ₹10,000 for 1 year tenure; on timely repayment, second loan up to ₹20,000, and third loan up to ₹50,000.",
      "Interest subsidy of 7% per annum credited directly to bank account via DBT.",
      "Cashback of up to ₹1,200 per year on eligible digital transactions."
    ],

    requiredDocuments: [
      "Aadhaar Card and Mobile-linked bank account",
      "Certificate of Vending / Letter of Recommendation (LoR) from ULB / Town Vending Committee"
    ],

    recommendationEnabled: false,
    active: true,
    version: 1,

    interestRate: null,
    maxLoanAmount: null,
    maxTenureYears: null,
    moratoriumMonths: null,

    rules: [],

    scoring: {
      baseScore: 0,
      min: 0,
      max: 100
    }
  },

  // 12. PM VISHWAKARMA
  {
    schemeId: "pm-vishwakarma",
    name: "PM Vishwakarma Scheme",
    description:
      "Comprehensive institutional support for traditional artisans and craftspeople engaged in 18 notified family trades, including carpenters, blacksmiths, goldsmiths, potters, sculptors, and weavers.",

    objective:
      "To enable traditional craftspeople and artisans to scale their enterprises, upgrade their toolkits, access formal credit, and integrate into domestic and global value chains.",

    ministry: "Ministry of Micro, Small & Medium Enterprises (MoMSME)",
    category: "MSME",
    sectorType: "Central Sector",

    benefitHeadline: "₹3 Lakh Loan @ Concessional 5%",
    maxCeilingText:
      "Skill Training + ₹15,000 Modern Tool-kit Incentive",

    statutoryClause: "PM Vishwakarma Scheme Guidelines 2023",

    officialPortalUrl:
      "https://pmvishwakarma.gov.in/",

    eligibilityParameters: [
      "An artisan or craftsperson working with hands and tools in one of the 18 traditional family-based trades.",
      "Minimum age of 18 years on the date of registration.",
      "Registration is restricted to one member of the family.",
      "Beneficiary should not have availed credit facilities under similar government self-employment schemes in the past 5 years.",
      "Collateral-free credit: Tranche 1 of up to ₹1 Lakh (18 months tenure) and Tranche 2 of up to ₹2 Lakh (30 months tenure) at fixed 5% interest."
    ],

    requiredDocuments: [
      "Aadhaar Card, Mobile Number, Bank Account Details",
      "Ration Card / Family Proof (for single family member verification)",
      "Artisan trade declaration verified by Gram Panchayat or ULB"
    ],

    recommendationEnabled: false,
    active: true,
    version: 1,

    interestRate: null,
    maxLoanAmount: null,
    maxTenureYears: null,
    moratoriumMonths: null,

    rules: [],

    scoring: {
      baseScore: 0,
      min: 0,
      max: 100
    }
  },

  // 13. POST-MATRIC SCHOLARSHIP
  {
    schemeId: "post-matric-scholarship",
    name: "Post-Matric Scholarship for Higher Education",
    description:
      "Comprehensive financial support to students from Scheduled Castes, Scheduled Tribes, OBC, and economically disadvantaged groups to pursue post-matriculation and higher educational courses.",

    objective:
      "To appreciably increase the Gross Enrolment Ratio (GER) of students in higher education by providing full fee reimbursement and maintenance allowances.",

    ministry: "Ministry of Social Justice & Empowerment / Ministry of Education",
    category: "Education",
    sectorType: "Centrally Sponsored",

    benefitHeadline: "100% Tuition & Maintenance Fees",
    maxCeilingText:
      "Direct Benefit Transfer (DBT) to Student Account",

    statutoryClause:
      "Centrally Sponsored Post Matric Scholarship Guidelines",

    officialPortalUrl:
      "https://scholarships.gov.in/",

    eligibilityParameters: [
      "Must be enrolled in recognized post-secondary institutions, degree, diploma, or professional college courses.",
      "Annual family income must not exceed ₹2,50,000 per annum from all gazetted sources.",
      "Applicable across general and professional degrees including Engineering, Medicine, Management, and Arts/Science degrees.",
      "Direct disbursement through National Scholarship Portal (NSP) Aadhaar payment bridge."
    ],

    requiredDocuments: [
      "Aadhaar Card and Student Bank Passbook (DBT activated)",
      "Caste Certificate / Special Category verification",
      "Income Certificate issued by authorized Tehsildar / Sub-Divisional Magistrate",
      "College Admission Fee receipt and 10th/12th Marks memo"
    ],

    recommendationEnabled: false,
    active: true,
    version: 1,

    interestRate: null,
    maxLoanAmount: null,
    maxTenureYears: null,
    moratoriumMonths: null,

    rules: [],

    scoring: {
      baseScore: 0,
      min: 0,
      max: 100
    }
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