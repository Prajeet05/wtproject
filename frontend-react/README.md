# Smart Parking - React Frontend

A modern React-based frontend for the Smart Parking Slot Booking System built with Vite.

## Features

- ⚡ **Fast Development** - Vite for blazing fast dev server
- 🎨 **Modern UI** - Beautiful, responsive design with Cream + Brown theme
- 🔐 **Authentication** - Secure login and registration
- 📅 **Slot Booking** - Easy-to-use parking slot booking interface
- 👑 **Admin Panel** - Full administrative dashboard for managing slots and bookings
- 📱 **Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🔄 **Real-time Updates** - Live slot availability and booking status

## Prerequisites

- Node.js 16+ (npm or yarn)
- Backend server running on `http://localhost:5000`

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend-react
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional) to configure the API endpoint:
```
VITE_API_URL=http://localhost:5000/api
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Building

Create an optimized production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
frontend-react/
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/           # Page components (Auth, Dashboard, Admin)
│   ├── services/        # API service layer
│   ├── context/         # React context for state management
│   ├── styles/          # CSS stylesheets
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Application entry point
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── package.json         # Dependencies and scripts
└── .gitignore          # Git ignore rules
```

## Available Routes

- `/` - Login/Registration page (public)
- `/dashboard` - User dashboard for booking slots (protected)
- `/admin` - Admin panel for managing slots (admin only)

## Technologies Used

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS3** - Styling with custom properties

## Authentication

The app uses JWT tokens for authentication:
- Tokens are stored in localStorage
- Automatically included in all API requests
- Expired tokens trigger automatic logout and redirect to login

## API Integration

The frontend communicates with the backend API at:
- Base URL: `http://localhost:5000/api`
- Authentication: Bearer token in `Authorization` header

### Available API Endpoints

**Auth:**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

**Slots:**
- `GET /slots` - Get slots for a specific date
- `GET /slots/all` - Get all slots (admin)
- `POST /slots/book` - Book a slot
- `POST /slots/reset` - Reset all slots (admin)
- `PUT /slots/:id` - Update slot status (admin)

**Bookings:**
- `GET /bookings/user` - Get user's bookings
- `GET /bookings/all` - Get all bookings (admin)
- `POST /bookings/:id/cancel` - Cancel a booking

**Users:**
- `GET /users` - Get all users (admin)
- `GET /users/:id` - Get user details (admin)

## Environment Variables

Create a `.env` file in the frontend-react directory:

```env
# API endpoint
VITE_API_URL=http://localhost:5000/api

# Other options can be added here
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

**API Connection Error?**
- Make sure the backend server is running on `http://localhost:5000`
- Check the `VITE_API_URL` in your `.env` file
- Check browser console for CORS errors

**Build Issues?**
- Delete `node_modules` and `dist` folders
- Run `npm install` again
- Run `npm run build`

**Development Server Issues?**
- Ensure port 3000 is not in use
- Run `npm run dev` with explicit port: `npm run dev -- --port 3001`

## License

MIT
