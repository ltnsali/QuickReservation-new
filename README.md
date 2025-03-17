# QuickReservation - Cross-Platform Retail Reservation App

A modern reservation system that helps retailers manage appointments and bookings efficiently across web, Android, and iOS platforms.

## 🚀 Tech Stack

- **Frontend Framework**: React Native + Expo
- **State Management**: Redux Toolkit
- **UI Components**: React Native Paper
- **Navigation**: Expo Router
- **Authentication**: Firebase Auth (coming soon)
- **Code Quality**: ESLint & Prettier
- **Language**: TypeScript
- **Testing**: Jest & React Testing Library (coming soon)

## 📱 Supported Platforms

- Web (Primary development platform)
- Android (via Expo)
- iOS (via Expo)

## 🛠️ Project Structure

```
quickreservation/
├── app/                    # Main application code
│   ├── (app)/             # Protected app routes
│   │   ├── _layout.tsx    # App layout with bottom tabs
│   │   ├── index.tsx      # Home screen
│   │   ├── bookings.tsx   # Bookings screen
│   │   └── profile.tsx    # Profile screen
│   ├── (auth)/            # Authentication routes
│   │   ├── login.tsx      # Login screen
│   │   └── register.tsx   # Registration screen
│   └── _layout.tsx        # Root layout
├── store/                  # Redux store configuration
│   ├── index.ts           # Store setup
│   └── slices/            # Redux slices
│       └── authSlice.ts   # Authentication slice
├── components/            # Reusable components
├── constants/             # App constants
├── hooks/                # Custom hooks
└── assets/              # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd quickreservation
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
# For web
npm run web

# For iOS
npm run ios

# For Android
npm run android
```

## 🔐 Authentication

The app includes a complete authentication flow with:

- User registration
- Login
- Password recovery (coming soon)
- Protected routes

## 📱 Features

### Current Features

- Modern UI with React Native Paper
- Bottom tab navigation
- Responsive layouts
- Type-safe development with TypeScript
- State management with Redux Toolkit
- Authentication flow UI

### Coming Soon

- Firebase integration
- Real-time updates
- Booking management
- Push notifications
- Payment processing
- Admin dashboard

## 🧪 Development

### Code Style

The project uses ESLint and Prettier for code formatting. Configuration files are included:

- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier configuration

To format your code:

```bash
# Check formatting
npm run lint

# Fix formatting
npm run lint:fix
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
