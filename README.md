# Circular Exchange (LoopX)

A B2B Two-Sided Marketplace for Circular Packaging.

## Overview

Circular Exchange is a marketplace designed to connect suppliers of surplus packaging materials (like cardboard, plastics, wooden pallets) with verified buyers. By facilitating the exchange and reuse of packaging, it aims to reduce waste and promote a circular economy.

The application automatically analyzes uploaded images of materials using Google Gemini AI to auto-fill listing details (like material category and estimated weight), making the selling process seamless.

## Features

- **AI-Powered Listings:** Upload a photo of surplus materials and let Google Gemini AI auto-fill the condition, weight, and material category.
- **Cloud Image Storage:** Images are securely hosted using Supabase Storage.
- **Real-Time Marketplace:** Browse available inventory with instant filtering.
- **Secure Checkout:** Integrated Razorpay payment gateway mock flow for buying materials.
- **ESG Reporting:** Suppliers can see their estimated carbon savings and equivalent trees planted.
- **Logistics Integration:** TomTom API integrations for location routing and distance calculation between buyers and sellers.

## Program Flow

1. **Supplier Upload & AI Analysis:**
   - A supplier selects a photo of surplus packaging materials on the **Sell Page**.
   - The frontend sends the image to the FastAPI backend (`/analyze-image`).
   - The backend proxies the image to Google Gemini AI to analyze the material category, estimated weight, and condition.
   - The backend returns the auto-filled data and a temporary image ID to the frontend.

2. **Listing Creation:**
   - The supplier reviews the auto-filled data, makes any adjustments, and clicks "Publish Listing".
   - The backend creates a new listing record in the Supabase PostgreSQL database.
   - The temporary image is finalized and securely uploaded to the Supabase Storage `listings` bucket.

3. **Marketplace Discovery:**
   - Verified buyers browse the **Buy Page** where active listings are displayed with instant filtering.
   - Buyers can view material details, pricing, and the supplier's estimated CO₂ offset potential.

4. **Secure Checkout & Routing:**
   - Buyers add materials to their cart and proceed to checkout on the **Cart Page**.
   - The transaction is securely handled via Razorpay integration.
   - Once payment is verified, the listing is marked as sold, and logistics routing (TomTom API) is triggered to calculate the optimal pickup path.

## Directory Structure

```text
Circular_Packaging_and_Material_Exchange/
├── backend/                  # FastAPI Backend
│   ├── main.py               # Application entry point & router setup
│   ├── requirements.txt      # Python dependencies
│   └── modules/              # Core backend modules
│       ├── auth.py           # Authentication logic
│       ├── database.py       # Supabase client setup
│       ├── schemas.py        # Pydantic data models
│       ├── logistics/        # TomTom API and routing integration
│       └── marketplace/      # Listings, payments, and AI vision logic
│           ├── router.py     # Marketplace API endpoints
│           └── vision.py     # Google Gemini API integration
│
├── frontend/                 # React Frontend (Vite)
│   ├── package.json          # Node dependencies
│   ├── vite.config.ts        # Vite configuration & backend proxy
│   └── src/                  # React source code
│       ├── App.tsx           # Main application component & routing
│       ├── index.css         # Global TailwindCSS styles
│       ├── api/              # API client for backend communication
│       │   └── client.ts
│       └── components/       # React UI components
│           ├── BuyPage.tsx   # Marketplace inventory browser
│           ├── SellPage.tsx  # Listing creation form
│           ├── CartPage.tsx  # Shopping cart and checkout
│           └── ...
└── README.md                 # Project documentation
```

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- TypeScript

### Backend
- FastAPI
- Supabase (PostgreSQL & Storage)
- Google Gemini API (AI Vision)
- Razorpay API

## Getting Started

### Prerequisites
- Node.js & npm
- Python 3.10+
- Supabase account and project (with a public storage bucket named `listings`)
- Google Gemini API Key
- Razorpay Test Keys (optional for testing payments)

### Environment Variables

1. Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

2. Create a `.env` file in the `backend` directory:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
TOMTOM_API_KEY=your_tomtom_api_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Running the Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows use:
   venv\Scripts\activate
   # On macOS/Linux use:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Running the Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## License

This project is licensed under the MIT License.
