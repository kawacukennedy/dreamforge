# DreamForge 🏰✨

An AI-powered interactive storytelling and social game app where users can create, play, and share dynamic story-based adventures.

## Features

### ✨ Core Storytelling
- **AI Story Engine**: Generate unique narratives from simple prompts using OpenAI
- **Branching Gameplay**: Multiple choice-based paths with different endings
- **Dynamic Characters**: AI-generated characters with consistent personalities
- **Adaptive Narratives**: Stories that evolve based on player choices

### 🎮 Social Gaming
- **Collaborative Stories**: Multiplayer sessions with friends
- **Story Sharing**: Save, publish, and discover community stories
- **Social Feed**: Like, comment, and follow other creators
- **Challenge Mode**: Creative constraints and daily writing prompts

### 🎨 Rich Media
- **AI-Generated Visuals**: Story scenes and character artwork (DALL-E integration)
- **Adaptive Audio**: Dynamic background music matching story tone
- **Responsive Design**: Optimized for desktop and mobile

### 👤 User Experience
- **User Profiles**: Track stories, achievements, and social connections
- **Achievement System**: Badges and milestones for engagement
- **Dark/Light Theme**: Modern neon-accented design with theme switching

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **ShadCN/UI** - Modern component library
- **Lucide Icons** - Beautiful icon system

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Type-safe database operations
- **PostgreSQL** - Production database (Neon/Supabase)
- **NextAuth.js** - Authentication with OAuth support

### AI & External Services
- **OpenAI API** - Story and image generation
- **StabilityAI** - Alternative image generation
- **Cloudinary** - Media storage and optimization

### Deployment
- **Vercel** - Hosting and serverless functions
- **Neon/Supabase** - Managed PostgreSQL database

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dreamforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.local` and configure:
   ```bash
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/dreamforge"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # AI Services
   OPENAI_API_KEY="your-openai-key"
   STABILITY_API_KEY="your-stability-key" # optional

   # Google OAuth (recommended)
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   
   # GitHub OAuth (optional)
   GITHUB_ID="your-github-client-id"
   GITHUB_SECRET="your-github-client-secret"
   ```
   
   📝 **For Google OAuth setup**, see [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for detailed instructions.

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── generate-story/ # Story generation
│   │   ├── continue-story/ # Story continuation
│   │   └── stories/      # Story CRUD
│   ├── create/           # Story creation page
│   ├── story/[id]/       # Story player
│   ├── explore/          # Story discovery
│   ├── dashboard/        # User stories
│   ├── profile/          # User profile
│   └── settings/         # User settings
├── components/
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── story/            # Story-specific components
│   └── theme-provider.tsx
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── openai.ts         # OpenAI integration
│   └── utils.ts          # Utility functions
└── prisma/
    └── schema.prisma     # Database schema
```

## Key Features Implementation

### Story Generation Flow
1. User provides premise, genre, style, and optional constraints
2. OpenAI generates initial story with characters and first scene
3. Story saved to database with branching structure
4. Players make choices, triggering continuation generation
5. AI maintains consistency using conversation context

### Database Design
- **Users**: Authentication and profile data
- **Stories**: Story metadata and JSON content structure
- **Sessions**: Multiplayer game sessions
- **Social Features**: Likes, comments, follows

### Authentication
- NextAuth.js with multiple providers (OAuth + credentials)
- JWT sessions for performance
- Protected routes and API endpoints

## Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on git push

### Database Setup
- **Neon**: Serverless PostgreSQL
- **Supabase**: Full backend with auth and storage
- Configure connection string in environment variables

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Database GUI
- `npx prisma generate` - Generate Prisma client

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Roadmap

### Phase 1 (Current) ✅
- [x] Basic story creation and playing
- [x] AI story generation
- [x] User authentication
- [x] Story sharing and discovery
- [x] Responsive UI with dark/light themes

### Phase 2 (Next)
- [ ] Multiplayer collaborative stories
- [ ] Real-time chat in story sessions
- [ ] Advanced AI image generation
- [ ] Audio generation and integration
- [ ] Mobile app development

### Phase 3 (Future)
- [ ] Story marketplace with monetization
- [ ] Advanced analytics for creators
- [ ] Community challenges and competitions
- [ ] Integration with external platforms
- [ ] Advanced AI features (voice, video)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@dreamforge.ai or join our Discord community.

---

Built with ❤️ using Next.js, OpenAI, and modern web technologies.
