# Portfolio Frontend

Modern, responsive React frontend with Tailwind CSS for a portfolio website.

## Tech Stack

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

## Features

- Modern, responsive design
- Smooth animations with Framer Motion
- Multiple pages:
  - Home
  - Projects
  - About
  - Blog
  - Contact
- API integration with backend
- Contact form with validation
- Mobile-friendly navigation
- Toast notifications

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API endpoint (optional):
Edit `src/services/api.ts` if your backend runs on a different port:
```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

### Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

The frontend will run on `http://localhost:5173`

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── Navbar.tsx
│   └── Footer.tsx
├── pages/             # Page components
│   ├── Home.tsx
│   ├── Projects.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   └── Blog.tsx
├── services/          # API services
│   └── api.ts
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Fonts

Change fonts in `tailwind.config.js`:
```javascript
fontFamily: {
  sans: ['Your Font', 'system-ui', 'sans-serif'],
  heading: ['Your Heading Font', 'sans-serif'],
}
```

### Content

Update personal information in:
- `src/pages/Home.tsx` - Hero section
- `src/pages/About.tsx` - About content
- `src/pages/Contact.tsx` - Contact information
- `src/components/Footer.tsx` - Footer links and social media

## Building for Production

1. Build the project:
```bash
npm run build
```

2. The build output will be in the `dist/` directory

3. Deploy to your preferred hosting platform:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3
   - etc.

## Environment Variables

Create a `.env` file for environment-specific configuration:
```env
VITE_API_URL=http://localhost:3001/api
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## License

MIT
# falcon-frontend
