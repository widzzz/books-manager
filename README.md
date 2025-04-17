# Books Manager

A modern web application for managing books, built for Azura Lab's Intern Assessment. This application allows users to browse, search, and manage their book collection with a clean and intuitive interface.

Available at https://books.widzzz.com

## Features

- 📚 Book management system
- 📱 Responsive design
- 🏎️ Fast and efficient performance
- 🚀 CI/CD with Jenkins

## Tech Stack

- **Framework**: [Nuxt.js](https://nuxt.com/) with [Nitro](https://nuxt.com/docs/guide/concepts/server-engine)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (I was trying to add shadcn-ui but it seems not work well in Nuxt.js, or it's just me that skill issue)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Storage**: [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/)

## Prerequisites

- Node.js
- npm
- MongoDB instance
- Cloudflare account

## Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd azura-intern-assesment
```

2. Create a `.env` file in the root directory with the following variables:
```env
BASE_URL=https://your-site
# Optional in development

# MongoDB Configuration
MONGODB_STRING=your_mongodb_connection_string

# Session Configuration
NUXT_SESSION_SECRET=your_session_secret
NUXT_SESSION_PASSWORD=your_session_password

# Cloudflare R2 Configuration
CF_API_TOKEN=your_cloudflare_api_token
S3_ACCESS_KEY=your_r2_access_key
S3_SECRET_KEY=your_r2_secret_key
S3_ENDPOINT=your_r2_endpoint
S3_BUCKET_NAME=your_bucket_name
S3_PUBLIC_ENDPOINT=your_public_endpoint
```

## Installation

Install project dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Vue components
├── layouts/        # Page layouts
├── lib/            # Utility libraries
├── pages/          # Application pages
├── public/         # Public static files
├── server/         # Server-side code
├── app.vue         # Root application component
├── nuxt.config.ts  # Nuxt.js configuration
└── package.json    # Project dependencies and scripts
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.