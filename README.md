# HealthTick - Healthcare Coaching Calendar

A professional calendar booking application designed specifically for healthcare coaches to manage client appointments with intelligent scheduling and conflict prevention.

## Features

### 🗓️ Smart Calendar Management
- **Daily View**: Focus on one day at a time with clear time slot visualization
- **20-minute Intervals**: Optimized scheduling from 10:30 AM to 7:30 PM
- **Intelligent Conflict Detection**: Prevents overlapping appointments automatically

### 📞 Call Type Support
- **Onboarding Calls**: 40-minute one-time sessions (occupies 2 consecutive slots)
- **Follow-up Calls**: 20-minute recurring weekly sessions
- **Visual Differentiation**: Color-coded slots for easy identification

### 👥 Client Management
- **Searchable Database**: 20 pre-loaded dummy clients with names and phone numbers
- **Quick Selection**: Searchable dropdown with client details
- **Client Information**: Display client name, phone, and call type in booked slots

### 🔄 Recurring Logic
- **Weekly Recurrence**: Follow-up calls automatically repeat on the same day of the week
- **Smart Display**: Shows both one-time and recurring appointments for selected dates
- **Day-of-Week Matching**: Recurring calls appear on all matching weekdays

### 🎨 Modern UI/UX
- **Mercedes Benz Inspired Design**: Professional silver, charcoal, and blue color palette
- **Dark/Light Mode**: Complete theme support with smooth transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Micro-interactions**: Smooth animations and hover effects
- **Accessibility**: Focus rings, proper labels, and keyboard navigation

### 🏠 Professional Landing Page
- **Hero Section**: Clear value proposition and call-to-action
- **Features Showcase**: Highlighting key capabilities
- **Clean Footer**: Professional contact and company information

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for styling with custom Mercedes-inspired theme
- **Date-fns** for date manipulation and formatting
- **Heroicons** for consistent iconography
- **Clsx** for conditional CSS classes

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── BookingModal.tsx    # Call booking interface
│   ├── CalendarView.tsx    # Main calendar display
│   ├── DatePicker.tsx      # Date navigation
│   ├── Footer.tsx          # Site footer
│   ├── Header.tsx          # Site header
│   ├── HomePage.tsx        # Landing page
│   ├── ThemeToggle.tsx     # Dark/light mode switch
│   └── TimeSlot.tsx        # Individual time slot component
├── contexts/            # React contexts
│   └── ThemeContext.tsx    # Theme management
├── data/               # Static data
│   └── clients.ts          # Dummy client data
├── types/              # TypeScript definitions
│   └── index.ts           # All type definitions
├── utils/              # Utility functions
│   └── timeSlots.ts       # Time slot generation and validation
└── App.tsx             # Main application component
```

### Data Models

#### Client Interface
```typescript
interface Client {
  id: string;
  name: string;
  phone: string;
}
```

#### Call Interface
```typescript
interface Call {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  date: string;           // YYYY-MM-DD
  time: string;           // HH:MM (24h format)
  type: 'onboarding' | 'followup';
  recurring: boolean;
  dayOfWeek?: number;     // 0-6 for recurring calls
  createdAt: string;
}
```

## Backend Integration Points

The frontend is designed for easy backend integration with the following API expectations:

### API Endpoints

| Method | Endpoint | Purpose | Request Body |
|--------|----------|---------|--------------|
| GET | `/api/calls?date=YYYY-MM-DD` | Fetch calls for specific date | - |
| POST | `/api/calls` | Create new call booking | `BookingFormData` |
| DELETE | `/api/calls/:id` | Delete existing call | - |

### Expected Response Formats

**GET /api/calls**
```json
{
  "calls": [
    {
      "id": "1",
      "clientId": "3",
      "clientName": "Sriram Krishnan",
      "clientPhone": "+91 76543 21098",
      "date": "2025-01-16",
      "time": "11:10",
      "type": "onboarding",
      "recurring": false,
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

**POST /api/calls**
```json
{
  "clientId": "4",
  "callType": "followup",
  "date": "2025-01-16",
  "time": "15:50"
}
```

### Database Schema Recommendations

#### Calls Table
```sql
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(50) NOT NULL,
  client_name VARCHAR(100) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  call_date DATE NOT NULL,
  call_time TIME NOT NULL,
  call_type VARCHAR(20) NOT NULL CHECK (call_type IN ('onboarding', 'followup')),
  is_recurring BOOLEAN DEFAULT FALSE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for efficient date queries
CREATE INDEX idx_calls_date ON calls(call_date);
CREATE INDEX idx_calls_recurring ON calls(is_recurring, day_of_week) WHERE is_recurring = TRUE;
```

## Key Features Implementation

### Conflict Prevention
- **Smart Validation**: Checks for overlapping appointments before booking
- **Multi-slot Support**: Handles 40-minute onboarding calls spanning 2 slots
- **Visual Feedback**: Shows conflicts immediately in the UI

### Recurring Call Logic
1. Follow-up calls store `dayOfWeek` (0=Sunday, 6=Saturday)
2. When loading a date, system fetches:
   - All one-time calls for exact date match
   - All recurring calls where `dayOfWeek` matches selected date's weekday
3. Creates virtual instances without database duplication

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - Mobile: < 768px (stacked layout)
  - Tablet: 768-1024px (2-column grid)
  - Desktop: > 1024px (3-column grid)

### Theme System
- **CSS Custom Properties**: Dynamic theme switching
- **LocalStorage Persistence**: Remembers user preference
- **System Preference**: Respects OS dark/light mode

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd healthtick-calendar

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Deployment

### Frontend Deployment (Recommended: Vercel)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Backend Recommendations
- **Node.js with Express**: For REST API
- **Database**: PostgreSQL or MySQL for production
- **Hosting**: Railway, Render, or AWS
- **Authentication**: JWT-based if user management needed

## Future Enhancements

### Planned Features
- [ ] Multi-user support with authentication
- [ ] Email notifications for bookings
- [ ] Client portal for self-booking
- [ ] Advanced reporting and analytics
- [ ] Integration with calendar services (Google Calendar, Outlook)
- [ ] Payment processing integration
- [ ] Video call link generation
- [ ] Automated reminder system

### Technical Improvements
- [ ] Real-time updates with WebSockets
- [ ] Offline support with service workers
- [ ] Advanced caching strategies
- [ ] Performance monitoring
- [ ] Comprehensive test suite
- [ ] Internationalization (i18n)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please contact the development team or create an issue in the repository.