# Polling App - Frontend

## Overview

This project is a real-time polling system that allows teachers to create live polls and students to participate in them. The frontend is built with **React** (using Vite as the build tool). **Socket.IO** is used for real-time communication between the server and clients.

## Features

- **Teacher Features**:

  - Create polls with options and set a timer for voting.
  - View real-time results as students vote.
  - View poll history.
  - Kick students out of the room.

- **Student Features**:
  - Join a poll room created by a teacher.
  - Vote in real-time on polls.
  - Redirect to a "kicked out" page if removed by the teacher.

## Tech Stack

- **React** (with Vite for fast development)
- **Socket.IO** (for real-time communication)
- **Bootstrap** (for styling)
- **Session Storage** (for session management)

---

## Frontend Setup

### Prerequisites

Make sure you have the following installed:

- Node.js (developed with 22.5.1)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Suresh-Choudhary15/Live-Polling-System-Project-Frontend.git
   cd Polling-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

<<<<<<< HEAD
3. Start the development server:
   ```bash
   npm run dev
   ```

## Running the Application

1. The frontend will be available at:
   ```
   http://localhost:5173/
   ```
=======
3. **Setup environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Environment Variables

| Variable                   | Description          | Default                 |
| -------------------------- | -------------------- | ----------------------- |
| `REACT_APP_API_URL`        | Backend API URL      | `http://localhost:5000` |
| `REACT_APP_SOCKET_URL`     | Socket.IO server URL | `http://localhost:5000` |
| `REACT_APP_ENV`            | Environment mode     | `development`           |
| `REACT_APP_ENABLE_CHAT`    | Enable chat feature  | `true`                  |
| `REACT_APP_ENABLE_HISTORY` | Enable poll history  | `true`                  |
| `REACT_APP_DEBUG_MODE`     | Enable debug logging | `true`                  |

## Features Overview

### Welcome Page

- Role selection (Teacher/Student)
- Clean, intuitive interface
- Responsive design

### Teacher Dashboard

- **Create Polls**: Design questions with multiple choice options
- **Live Results**: Real-time poll result visualization
- **Student Management**: View and manage connected students
- **Poll History**: Access past poll results and statistics
- **Time Management**: Set custom time limits for polls

### Student Dashboard

- **Name Entry**: Simple registration process
- **Poll Participation**: Answer questions within time limits
- **Live Results**: View results after submission
- **Real-time Updates**: Instant notifications for new polls

## Component Architecture

### Common Components

- **Button**: Reusable button with multiple variants
- **Input**: Form input with validation support
- **Timer**: Countdown timer with visual indicators

### Teacher Components

- **CreatePoll**: Poll creation form with validation
- **PollResults**: Live result display with progress tracking
- **ParticipantsList**: Student management with chat functionality
- **PollHistory**: Historical poll data visualization

### Student Components

- **StudentEntry**: Name registration interface
- **PollQuestion**: Interactive question answering
- **WaitingScreen**: Idle state while waiting for polls
- **ResultsView**: Poll result visualization for students

## Socket Events

### Teacher Events

- `join-teacher`: Join as teacher
- `create-poll`: Create new poll
- `remove-student`: Remove student from session
- `get-poll-history`: Request poll history

### Student Events

- `join-student`: Join as student with name
- `submit-answer`: Submit poll answer

### Broadcast Events

- `new-poll`: New poll available
- `poll-results-update`: Live result updates
- `poll-completed`: Poll finished
- `students-update`: Student list changes

## Custom Hooks

### useSocket

Base socket management hook with connection handling.

### useTeacherSocket

Teacher-specific socket events and state management.

### useStudentSocket

Student-specific socket events and poll participation.

### useSocketError

Centralized error handling for socket operations.

## Styling System

### CSS Variables

- Color palette matching Figma designs
- Consistent spacing and typography
- Responsive breakpoints

### Component Styles

- Modular CSS architecture
- BEM-inspired naming convention
- Mobile-first responsive design

### Design Tokens

- Primary colors: Purple theme (#4F0DCE, #77650A, #576700)
- Neutral colors: Grays and whites
- Semantic colors: Success, error, warning states

## State Management

### React Hooks

- `useState` for local component state
- `useEffect` for side effects and lifecycle
- `useContext` for shared state (if needed)

### Socket State

- Real-time synchronization
- Automatic reconnection
- Error handling and recovery

## Performance Optimizations

- Component memoization where appropriate
- Efficient re-rendering strategies
- Optimized socket event handling
- Lazy loading for large components

## Responsive Design

### Breakpoints

- Mobile: 480px and below
- Tablet: 768px and below
- Desktop: 1024px and above

### Adaptive Layout

- Flexible grid systems
- Collapsible navigation
- Touch-friendly interactions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

### Analyze Bundle

```bash
npm run analyze
```

## Building for Production

### Standard Build

```bash
npm run build
```

### Environment-specific Builds

```bash
# Staging
REACT_APP_ENV=staging npm run build

# Production
REACT_APP_ENV=production npm run build
```

## Deployment

### Static Hosting (Netlify, Vercel)

```bash
npm run build
# Deploy the build/ folder
```

### Docker

```dockerfile
FROM nginx:alpine
COPY build/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### AWS S3 + CloudFront

```bash
aws s3 sync build/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Troubleshooting

### Common Issues

1. **Socket Connection Failed**

   - Check REACT_APP_SOCKET_URL in .env
   - Ensure backend server is running
   - Verify CORS configuration

2. **Build Fails**

   - Clear node_modules and reinstall
   - Check for dependency conflicts
   - Verify Node.js version compatibility

3. **Styling Issues**
   - Check CSS import order
   - Verify CSS variable definitions
   - Clear browser cache

### Debug Mode

Enable debug logging by setting:

```bash
REACT_APP_DEBUG_MODE=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper testing
4. Submit a pull request

## License

MIT License

## Support

For support and questions:

- Check the troubleshooting section
- Review the component documentation
- Contact the development team
>>>>>>> 3ca43479e13d3af9568d4e9b92fe36e8d03cc774
