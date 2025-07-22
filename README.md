# HealthTick - Healthcare Coaching Calendar    

A professional calendar booking application designed specifically for healthcare coaches to manage client appointments with intelligent scheduling and conflict prevention.

- Demo Link : https://calendar-booking-beta.vercel.app/
## OverView


### Note -> Please click on the day or date to see the available slots and book a slot or check for conflicts.

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
├── types/              # TypeScript definitions
│   └── index.ts           # All type definitions
├── utils/              # Utility functions
│   └── timeSlots.ts       # Time slot generation and validation
└── App.tsx             # Main application component
```
 ### ScreenShorts
 - Dark Mode HomePage
<img width="1915" height="911" alt="Screenshot 2025-07-22 233423" src="https://github.com/user-attachments/assets/8be8e5c8-de32-4862-9ba9-36edffb1cbaa" />
 - Light mode View
   <img width="1913" height="844" alt="Screenshot 2025-07-22 233556" src="https://github.com/user-attachments/assets/9b0e63ca-3101-4a57-b17c-4216e3f81181" />
   
<img width="1917" height="913" alt="Screenshot 2025-07-22 233606" src="https://github.com/user-attachments/assets/76f70bf9-3ac5-4d8a-9466-f77f9c06780c" />

<img width="1918" height="916" alt="Screenshot 2025-07-22 233452" src="https://github.com/user-attachments/assets/2234cfe6-e574-4eb1-b722-c6250a8b9d94" />
- Calendar Page View
<img width="1919" height="910" alt="Screenshot 2025-07-22 233510" src="https://github.com/user-attachments/assets/006f60c2-002e-4db8-a611-ea4c4749186f" />
-Slot View
<img width="1919" height="886" alt="Screenshot 2025-07-22 233523" src="https://github.com/user-attachments/assets/e91e6e3e-8182-4778-a26e-91885b02c060" /><img width="1912" height="898" alt="Screenshot 2025-07-22 235832" src="https://github.com/user-attachments/assets/d8291e2a-063b-440f-aa54-6c82c0719771" />

<img width="807" height="606" alt="Screenshot 2025-07-22 235815" src="https://github.com/user-attachments/assets/0076a581-d6ad-46f7-883b-e61a085b646b" />
-Call Booking Form
<img width="1608" height="811" alt="Screenshot 2025-07-22 233539" src="https://github.com/user-attachments/assets/1aee6dd7-4342-439e-9ef2-5a08776ab9e6" />

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

### Theme System
- **CSS Custom Properties**: Dynamic theme switching
- **LocalStorage Persistence**: Remembers user preference
- **System Preference**: Respects OS dark/light mode

### Installation
```bash
# Clone the repository
- git clone https://github.com/Anuragsingh198/CalendarBooking

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
## Deployment

## Deployment 
Demo Link : https://calendar-booking-beta.vercel.app/

### Backend 
- **Node.js with Express**
- **Database**: MongoDB
- **Hosting**: Railway

