# Paver Pressure and Repair - Quoting Tool

A web application built with React and TypeScript to calculate the total charge for a customer based on job square footage and price per square foot, including sales and supervisor commissions.

## Features

- Calculate quotes based on square footage and price per square foot
- Automatically adds:
  - 5% sales commission
  - 10% supervisor fee
- Clean, professional user interface
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js and npm must be installed on your system

### Installation

1. Install Node.js from [https://nodejs.org/](https://nodejs.org/) if not already installed
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Netlify

This project is configured for deployment to Netlify.

### Manual Deployment

1. Create a Netlify account if you don't have one
2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
3. Log in to Netlify:
   ```bash
   netlify login
   ```
4. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```

### Automatic Deployment via GitHub

1. Push this project to a GitHub repository
2. Connect your Netlify account to GitHub
3. Select the repository for deployment
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Deploy

## Project Structure

```
Quoting_Software/
│
├── src/
│   ├── pages/
│   │   ├── _app.tsx     # App wrapper
│   │   ├── index.tsx    # Main quoting page
│   ├── styles/          # CSS modules
│   │   ├── Home.module.css
│   │   ├── globals.css
├── public/              # Static assets
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
├── next.config.js       # Next.js configuration
├── netlify.toml         # Netlify configuration
```
