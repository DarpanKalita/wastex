# Wastex - Solar Solutions Website

A modern, responsive website for Wastex, a solar panel and solar street light company. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Responsive design with dark mode support
- Product catalog with categories
- Contact form
- Admin panel for content management
- Blog section
- Solar calculator
- Testimonials section

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Redux Toolkit
- NextAuth.js
- MongoDB
- React Icons
- Framer Motion

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wastex.git
cd wastex
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add the following environment variables:
```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── layout/         # Layout components
│   ├── ui/            # UI components
│   ├── products/      # Product-related components
│   └── admin/         # Admin panel components
├── lib/                # Utility functions and configurations
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
├── hooks/              # Custom React hooks
└── styles/             # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)
Project Link: [https://github.com/yourusername/wastex](https://github.com/yourusername/wastex)
