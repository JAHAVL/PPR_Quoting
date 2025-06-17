#!/bin/bash

# Kill any processes running on port 3001
echo "Killing any processes on port 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "No processes found on port 3001"

# Start the development server on port 3001
echo "Starting development server on port 3001..."
npm run dev
