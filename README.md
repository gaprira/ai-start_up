# Startup Generator 9000

AI-powered startup idea generation and analysis platform.

## Features

- **AI Idea Generation**: Generate multiple startup ideas tailored to your unique skills, interests, and market conditions.
- **Market Analysis**: TAM/SAM/SOM estimates, competitor analysis, and market gap identification.
- **Business Models**: Complete pricing strategies, subscription tiers, and revenue projections.
- **MVP Planning**: Core features, tech stack recommendations, and development timelines.
- **Validation Plans**: Find your first 10 customers with outreach templates and landing page copy.
- **Branding Kit**: Brand names, taglines, domain suggestions, and logo generation prompts.
- **PDF Reports**: Export complete startup reports with all analysis and recommendations.
- **Opportunity Scoring**: AI-scored ideas ranked by market size, pain level, competition, and monetization potential.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Payments**: Stripe
- **AI**: OpenAI GPT-4
- **Storage**: Supabase
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account
- Stripe account
- OpenAI API key
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/startup-generator-9000.git
   cd startup-generator-9000
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API keys and configuration.

4. Set up the database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` for all required environment variables.

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## License

MIT
