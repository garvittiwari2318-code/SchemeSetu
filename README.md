# 🇮🇳 SchemeSetu

### Intelligent Government Scheme Discovery & Eligibility Platform

SchemeSetu is a technology-driven platform designed to help citizens discover relevant government schemes and understand their eligibility through a centralized, transparent and explainable recommendation system.

Instead of requiring users to manually search through multiple schemes and interpret complex eligibility conditions, SchemeSetu collects a user's profile information and evaluates it against structured scheme rules to generate ranked recommendations.

---

## 🚀 Overview

Government welfare and financial schemes often have eligibility requirements based on factors such as:

* Age
* Gender
* Income
* Category
* Purpose of support
* Project or course cost
* Location

Finding the right scheme manually can be time-consuming and confusing.

**SchemeSetu addresses this problem by providing:**

> **User Profile → Eligibility Evaluation → Rule-Based Scoring → Ranked Recommendations → Explainable Results**

The platform separates the frontend presentation layer from the backend decision-making layer, ensuring that eligibility logic remains centralized and maintainable.

---

## ✨ Key Features

### 🔍 Scheme Recommendations

Evaluates an applicant's profile against active schemes and returns ranked recommendations.

### ⚖️ Eligibility Rule Engine

Uses structured rules stored in MongoDB to determine whether a user satisfies a scheme's eligibility conditions.

### 📊 Match Scoring

Eligible and ineligible schemes are assigned a weighted match score to indicate how closely the applicant matches the scheme requirements.

### 💡 Explainable Eligibility

The backend returns:

* Passed rules
* Failed rules
* Hard eligibility failures
* Expected conditions
* Actual applicant values
* Human-readable explanations

This makes the recommendation process transparent rather than treating the result as a black box.

### 🏛️ Scheme Repository

Provides APIs for retrieving available government schemes and individual scheme details.

### 🏦 Partner Locator

Stores partner institutions associated with schemes and provides APIs for retrieving scheme-specific partners.

### 📝 Application Management

Supports creating applications and retrieving application information.

### 🌐 Responsive Frontend

Built with React and TypeScript with dedicated views for scheme discovery, eligibility evaluation, results, transparency and scheme information.

---

# 🏗️ System Architecture

SchemeSetu follows a layered client-server architecture.

```text
                         ┌──────────────────────┐
                         │   React + TypeScript  │
                         │      Frontend         │
                         └──────────┬───────────┘
                                    │
                              REST API / JSON
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Express.js     │
                         │        Routes        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     Controllers      │
                         │ Request Handling     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Services       │
                         │ Recommendation Engine│
                         │     Rule Engine      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Mongoose       │
                         │        Models        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       MongoDB        │
                         │ Schemes / Users /    │
                         │ Partners / Applications│
                         └──────────────────────┘
```

### Backend request lifecycle

```text
User
 ↓
Frontend Form
 ↓
API Request
 ↓
Route
 ↓
Controller
 ↓
Recommendation Engine
 ↓
Rule Engine
 ↓
MongoDB Scheme Data
 ↓
Rule Evaluation
 ↓
Scoring & Ranking
 ↓
JSON Response
 ↓
Frontend Results
```

---

# 🧠 Recommendation Engine

The recommendation engine coordinates the eligibility and ranking pipeline.

### Processing flow

1. Load all active schemes from MongoDB.
2. Normalize the applicant's input into the internal profile format.
3. Evaluate every scheme using the rule engine.
4. Determine eligibility using hard rules.
5. Calculate a weighted match score using soft rules.
6. Rank eligible schemes first.
7. Return both eligible and ineligible results with explanations.

### Important design principle

The recommendation engine does **not** contain individual scheme eligibility criteria.

The scheme rules are stored in MongoDB.

This means that adding, modifying or removing a scheme's rules does not require changing the frontend or rewriting the rule engine.

---

# ⚙️ Rule Engine

The rule engine is a deterministic evaluator for scheme rules stored in the database.

Supported operators include:

```text
=
!=
<
<=
>
>=
in
between
```

Each rule contains information such as:

```text
field
operator
value
hard / soft
weight
explanation
```

### Hard Rules

Hard rules determine basic eligibility.

If a required hard rule fails:

```text
eligible = false
```

### Soft Rules

Soft rules contribute to the user's match score.

The score is calculated using:

```text
Base Score + Passed Soft Rule Weights
```

and is constrained within the scheme's configured minimum and maximum score.

---

# 🔎 Example Recommendation Flow

Suppose a user submits:

```json
{
  "age": 27,
  "gender": "male",
  "income": 220000,
  "category": "yes",
  "purpose": "business_new",
  "cost": 500000,
  "location": "Delhi"
}
```

The backend:

```text
Raw User Input
      ↓
Profile Normalization
      ↓
Load Active Schemes
      ↓
Evaluate Scheme Rules
      ↓
Hard Rule Check
      ↓
Soft Rule Scoring
      ↓
Ranking
      ↓
Explainable Recommendation Response
```

The frontend then displays the returned recommendations without implementing its own eligibility logic.

---

# 📁 Project Structure

## Backend

```text
Backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── recommendationController.js
│   ├── schemeController.js
│   ├── Applicationcontroller.js
│   ├── Partnercontroller.js
│   └── healthController.js
│
├── middleware/
│   └── errorHandler.js
│
├── models/
│   ├── scheme.js
│   ├── user.js
│   ├── Partner.js
│   └── application.js
│
├── routes/
│   ├── recommendationRoutes.js
│   ├── schemeRoutes.js
│   ├── Applicationroutes.js
│   ├── Partnerroutes.js
│   └── healthRoutes.js
│
├── services/
│   ├── recommendationEngine.js
│   └── ruleEngine.js
│
├── seed/
│   ├── seed.js
│   └── seedData.js
│
├── server.js
├── package.json
├── .env.example
└── vercel.json
```

## Frontend

```text
Frontend/
│
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   ├── recommendations.ts
│   │   ├── schemes.ts
│   │   ├── partners.ts
│   │   ├── applications.ts
│   │   ├── profileAdapter.ts
│   │   ├── recommendationMapper.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── .env.example
```

---

# 🛠️ Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide React
* Motion

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* CORS
* dotenv

## Development

* Git & GitHub
* Vercel

---

# 🔌 API Endpoints

Base URL:

```text
/api
```

### Health

| Method | Endpoint      | Description                   |
| ------ | ------------- | ----------------------------- |
| GET    | `/api/health` | Check API and database status |

### Schemes

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| GET    | `/api/schemes`     | Retrieve schemes           |
| GET    | `/api/schemes/:id` | Retrieve a specific scheme |

Optional query:

```text
/api/schemes?active=true
```

### Recommendations

| Method | Endpoint               | Description                                        |
| ------ | ---------------------- | -------------------------------------------------- |
| POST   | `/api/recommendations` | Evaluate profile and return ranked recommendations |

### Partners

| Method | Endpoint                      | Description                    |
| ------ | ----------------------------- | ------------------------------ |
| GET    | `/api/partners?schemeId=<id>` | Retrieve partners for a scheme |

### Applications

| Method | Endpoint                | Description                        |
| ------ | ----------------------- | ---------------------------------- |
| POST   | `/api/applications`     | Create and evaluate an application |
| GET    | `/api/applications`     | Retrieve applications              |
| GET    | `/api/applications/:id` | Retrieve a specific application    |

---

# 📡 Recommendation API Example

### Request

```http
POST /api/recommendations
Content-Type: application/json
```

```json
{
  "age": 27,
  "gender": "male",
  "income": 220000,
  "category": "yes",
  "purpose": "business_new",
  "cost": 500000,
  "location": "Delhi"
}
```

### Response structure

```json
{
  "success": true,
  "count": 3,
  "recommendations": [
    {
      "schemeId": "scheme-id",
      "name": "Example Scheme",
      "eligible": true,
      "matchScore": 85,
      "passedRules": [],
      "failedRules": [],
      "ruleExplanations": []
    }
  ]
}
```

---

# 🔗 Frontend ↔ Backend Integration

The frontend communicates with the backend through a dedicated API layer.

```text
Frontend
   │
   ├── profileAdapter.ts
   │        ↓
   │   Converts frontend profile
   │   into backend API format
   │
   ├── recommendations.ts
   │        ↓
   │   POST /api/recommendations
   │
   ├── recommendationMapper.ts
   │        ↓
   │   Converts backend response
   │   into frontend result format
   │
   └── ResultsView
            ↓
       Displays results
```

The frontend is therefore responsible for **presentation and API communication**, while the backend remains the source of truth for eligibility evaluation, scoring and ranking.

---

# 🔐 Environment Variables

## Backend

Create a `.env` file inside the `Backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/schemesetu
JWT_SECRET=your_jwt_secret_here
```

For MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
```

## Frontend

Create a `.env` file inside the `Frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> Never commit `.env` files containing credentials or API keys.

---

# ▶️ Running Locally

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd SchemeSetu
```

## 2. Start the Backend

```bash
cd Backend
npm install
```

Configure `.env`, then run:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

## 3. Start the Frontend

Open another terminal:

```bash
cd Frontend
npm install
```

Configure:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Then run:

```bash
npm run dev
```

The Vite development server will provide the frontend URL in the terminal.

---

# 🌱 Database Seeding

The backend contains a seed layer for populating the MongoDB database with initial scheme data.

```text
seed/
├── seed.js
└── seedData.js
```

The seeded data contains scheme information, eligibility rules and scoring configuration used by the recommendation engine.

---

# ☁️ Deployment

The backend includes Vercel configuration through:

```text
vercel.json
```

The frontend is built using Vite and can be deployed as a static frontend application.

For production deployment, configure the appropriate environment variables for:

```text
VITE_API_BASE_URL
MONGODB_URI
PORT
```

---

# 🔮 Future Scope

Potential extensions include:

* User authentication and authorization
* Government-verified scheme data integration
* Hindi and regional language support
* Document checklist generation
* Automated application tracking
* Admin dashboard for scheme management
* Scheme version management
* More advanced location-based partner matching
* Integration with official government APIs
* Improved accessibility for low-digital-literacy users

---

# 🎯 Project Objective

SchemeSetu aims to simplify access to government schemes by transforming scattered eligibility information into a structured, explainable and user-friendly recommendation workflow.

The system focuses on three principles:

### Accessibility

Make scheme discovery easier for citizens.

### Transparency

Show users why a scheme matches or fails their profile.

### Maintainability

Keep eligibility rules data-driven and separate from the frontend interface.

---

## 👨‍💻 Project

**SchemeSetu**
SIH 2026 Prototype
Problem Statement: **SIH26092**

Built as a full-stack web application using React, TypeScript, Node.js, Express and MongoDB.

---

## 📄 License

This project was developed as an academic/hackathon prototype.
