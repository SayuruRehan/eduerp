# EduERP - Education Management System

A comprehensive education management system built with React, TypeScript, and MySQL.

## Features

- Role-based access control (RBAC)
- User management
- Course management
- Student management
- Batch management
- Registration management
- Payment tracking
- Certificate management
- Marketing and sales tracking

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Vite
  - shadcn/ui
  - Tailwind CSS
  - React Router
  - TanStack Table

- Backend:
  - Node.js
  - MySQL
  - TypeScript

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd eduerp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a MySQL database
   - Run the schema.sql file to create the required tables:
     ```bash
     mysql -u your_username -p < schema.sql
     ```

4. Create a .env file in the root directory with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=eduerp
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- The project uses Vite for fast development and building
- shadcn/ui components are used for the UI
- Tailwind CSS is used for styling
- TypeScript is used for type safety
- React Router is used for routing
- TanStack Table is used for data tables

## Project Structure

```
src/
  ├── api/          # API services
  ├── components/   # React components
  │   ├── ui/      # UI components
  │   └── layout/  # Layout components
  ├── lib/         # Utility functions and configurations
  ├── pages/       # Page components
  ├── types/       # TypeScript types and interfaces
  └── utils/       # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
