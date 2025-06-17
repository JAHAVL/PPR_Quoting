# Quoting Software - Architecture Plan

## Purpose
A web application built with React and TypeScript to calculate the total charge for a customer based on job square footage and price per square foot, including sales and supervisor commissions.

## Platform
- Web application deployable to Netlify
- Built with React, TypeScript, and Next.js

## Features
- User inputs:
  - Square footage of the job
  - Price per square foot
- Calculates:
  - Base price (square footage × price per sq ft)
  - Sales commission (5% of base price)
  - Supervisor fee (10% of base price)
  - Total charge (base price + sales commission + supervisor fee)
- Displays a clear breakdown and the total charge

## File Structure
```
Quoting_Software/
│
├── ARCHITECTURE.md           # This plan
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
├── public/                   # Static assets
├── src/
│   ├── pages/
│   │   ├── _app.tsx          # App wrapper
│   │   ├── index.tsx         # Main page
│   ├── components/           # React components
│   ├── styles/               # CSS styling
```

## Next Steps
- Initialize Next.js project with TypeScript
- Develop the quoting calculator interface
- Setup styling with CSS modules or a UI framework
- Deploy to Netlify

---

**The application will be a single-page React app that can be deployed to Netlify.**
