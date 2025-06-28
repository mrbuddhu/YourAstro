# 🔮 YourAstro - Astrology Consultation Platform

YourAstro is a modern, real-time astrology consultation platform that connects users with experienced astrologers for personalized readings, chat consultations, and voice calls.

## ✨ Features

### 🔐 Authentication & Profiles
- **User Registration**: Sign up as a user or astrologer
- **Profile Management**: Edit personal information, bio, specialties
- **Real-time Updates**: Profile changes reflect immediately
- **Role-based Access**: Different experiences for users and astrologers

### 🔮 Astrologer Discovery
- **Browse Astrologers**: View all available astrologers with filters
- **Search & Filter**: Find astrologers by name, experience, language, online status
- **Public Profiles**: Detailed astrologer profiles with ratings and reviews
- **Online Status**: Real-time online/offline indicators

### 💬 Real-time Chat
- **Instant Messaging**: Real-time chat with astrologers
- **Session Management**: Track chat duration and costs
- **Message History**: Persistent chat history
- **Auto-scroll**: Smooth chat experience

### 📞 Voice Calls
- **Voice Consultation**: High-quality voice calls with astrologers
- **Call Controls**: Mute/unmute, end call functionality
- **Session Tracking**: Monitor call duration and costs
- **Real-time Status**: Live call status updates

### 💰 Wallet System
- **Balance Management**: Add funds to wallet
- **Transaction History**: Track all wallet activities
- **Automatic Deduction**: Pay-per-minute for consultations
- **Low Balance Alerts**: Get notified when balance is low

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Beautiful cosmic-themed interface
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd YourAstro
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
Run the Supabase migrations to create all required tables:

```bash
# Navigate to supabase directory
cd supabase

# Run migrations
supabase db push

# Or run individual migrations
supabase migration up
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see YourAstro in action!

## 🗄️ Database Schema

### Core Tables
- **profiles**: User and astrologer profiles
- **chat_sessions**: Chat consultation sessions
- **call_sessions**: Voice call sessions
- **messages**: Chat messages
- **wallet_transactions**: Wallet activity history

### RLS Policies
All tables have Row Level Security (RLS) policies ensuring:
- Users can only access their own data
- Astrologers can view public profile information
- Secure session management
- Protected wallet transactions

## 🧪 Testing

Run the comprehensive test suite to verify all flows:

```bash
# Set your Supabase credentials
export VITE_SUPABASE_URL=your_supabase_url
export VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run tests
node scripts/test-flows.js
```

The test suite covers:
- ✅ Authentication flow (signup/login/logout)
- ✅ Profile management (create/update/fetch)
- ✅ Astrologer discovery (listing/filtering)
- ✅ Wallet operations (add funds/transactions)
- ✅ Chat functionality (sessions/messages)

## 📱 User Flows

### For Users
1. **Sign Up**: Create account as a user
2. **Browse Astrologers**: Find and filter astrologers
3. **View Profiles**: Check astrologer details and ratings
4. **Add Funds**: Load wallet for consultations
5. **Start Chat/Call**: Connect with astrologers
6. **Manage Profile**: Update personal information

### For Astrologers
1. **Sign Up**: Create account as an astrologer
2. **Complete Profile**: Add bio, specialties, pricing
3. **Go Online**: Set availability status
4. **Receive Consultations**: Chat and call with users
5. **Update Profile**: Keep information current

## 🎯 Production Deployment

### 1. Build for Production
```bash
npm run build
```

### 2. Deploy to Vercel/Netlify
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

### 3. Environment Variables
Set production environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 4. Database Migration
Ensure all migrations are applied to production:
```bash
supabase db push --db-url your_production_db_url
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Enable Authentication with email/password
3. Set up RLS policies for all tables
4. Configure real-time subscriptions
5. Set up storage for avatars (optional)

### Customization
- **Branding**: Update colors in `tailwind.config.ts`
- **Features**: Modify components in `src/components/`
- **Styling**: Customize CSS in `src/index.css`
- **Logic**: Update hooks in `src/hooks/`

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State Management**: React hooks + Context
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Testing**: Custom test suite

## 📊 Performance

- **Bundle Size**: Optimized with Vite
- **Loading**: Lazy loading for routes
- **Real-time**: Efficient Supabase subscriptions
- **Caching**: Smart data caching strategies
- **Images**: Optimized SVG assets

## 🔒 Security

- **Authentication**: Supabase Auth with JWT
- **Authorization**: Row Level Security (RLS)
- **Data Validation**: TypeScript + runtime checks
- **HTTPS**: Secure connections only
- **Input Sanitization**: XSS protection

## 🚀 Launch Checklist

Before going live, ensure:

### ✅ Technical
- [ ] All database migrations applied
- [ ] Environment variables configured
- [ ] Production build successful
- [ ] All tests passing
- [ ] Error handling implemented
- [ ] Loading states added

### ✅ Content
- [ ] Branding updated (YourAstro)
- [ ] Meta tags configured
- [ ] Favicon and images set
- [ ] Terms of service added
- [ ] Privacy policy added

### ✅ User Experience
- [ ] Signup flow tested
- [ ] Profile editing works
- [ ] Astrologer discovery functional
- [ ] Chat/call features working
- [ ] Wallet system operational
- [ ] Mobile responsive

### ✅ Business
- [ ] Payment integration ready
- [ ] Support system in place
- [ ] Analytics configured
- [ ] Monitoring set up
- [ ] Backup strategy defined

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the test suite for examples

---

**YourAstro** - Connecting cosmic wisdom with modern technology ✨
