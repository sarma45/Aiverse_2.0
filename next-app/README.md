# AIVerse Omega (Unified Next.js Infrastructure)

## Overview
This is the unified, production-ready version of the AIVerse AI Super-App. It consolidates the previous React SPA and Express API into a single, high-performance Next.js 15 (App Router) project.

## Key Features
- **Fullstack Next.js:** SEO-optimized with Server Components and dynamic metadata.
- **AI Discovery:** Semantic Vector Search powered by Pinecone and Gemini.
- **Asynchronous Orchestration:** Background workflow execution using BullMQ and Redis.
- **Digital Marketplace:** Secure digital asset ownership and global Razorpay checkout.
- **Community Hub:** Real-time social discussion engine with threads and reflections.
- **Enterprise Ready:** Rate-limited B2B APIs and VPC-ready architecture.
- **Premium UI:** Three.js Neural Network background, GSAP animations, and Lenis smooth scrolling.

## Tech Stack
- **Frontend:** React 19, Next.js 15, Tailwind CSS, Lucide, GSAP, Framer Motion.
- **Backend:** Next.js Route Handlers, Mongoose, BullMQ, Redis.
- **AI:** Google Gemini 1.5 Flash (Generation & Embeddings), Pinecone.
- **Finance:** Razorpay (Global Gateway).

## Getting Started

### Local Development
1. Ensure Docker is running.
2. Clone the repository.
3. Configure `.env.local` (see `.env.example`).
4. Run `docker-compose up` to start MongoDB and Redis.
5. Run `npm install` followed by `npm run dev`.

### Production Deployment
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## Security & Governance
- **Strict Validation:** Every API route is hardened with Zod schema validation.
- **Role-Based Access:** Unified RBAC for Admin, Creator, and User tiers.
- **Financial Integrity:** Signature-verified Razorpay webhooks for atomic transaction logging.
