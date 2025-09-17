# Assignment Deadline Tracker

A smart deadline management system for students built with Laravel and React. Track assignments, manage deadlines, and stay organized throughout your academic journey.

## Features

- 📝 Assignment tracking and management
- ⏰ Smart deadline notifications
- 📊 Dashboard with analytics and charts
- 👤 User authentication and profiles
- 🎨 Dark/light theme support
- 📱 Responsive design with mobile support
- 🔍 Advanced filtering and search

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI primitives
- **Database**: SQLite (default) / MySQL / PostgreSQL
- **Charts**: Recharts
- **Icons**: Lucide React

## Prerequisites

Before setting up the development environment, ensure you have the following installed:

- **PHP 8.2 or higher**
- **Composer** (PHP dependency manager)
- **Node.js 18+ and npm** (or yarn/pnpm)
- **SQLite** (default database) or **MySQL/PostgreSQL**

## Development Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd assignment-deadline-tracker
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node.js Dependencies

```bash
npm install
```

### 4. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create SQLite database (if using SQLite)
touch database/database.sqlite
```

### 5. Database Setup

Run the database migrations:

```bash
php artisan migrate
```

Optionally, seed the database with sample data:

```bash
php artisan db:seed
```

### 6. Start Development Server

#### Option 1: Quick Start (Recommended)
Use the built-in development command that starts all services:

```bash
composer run dev
```

This command starts:
- Laravel development server (port 8000)
- Queue worker
- Log monitoring
- Vite dev server with HMR

#### Option 2: Manual Start
Start services individually:

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Frontend development server
npm run dev

# Terminal 3: Queue worker (optional)
php artisan queue:work

# Terminal 4: Log monitoring (optional)
php artisan pail
```

### 7. Access the Application

- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:8000 (Laravel server)
- **App URL**: http://assignment-deadline-tracker.test (configured in .env)

## Available Scripts

### PHP/Laravel Commands

```bash
# Start all development services
composer run dev

# Run tests
composer run test
php artisan test

# Code formatting
php artisan pint

# Database operations
php artisan migrate
php artisan migrate:fresh --seed
php artisan db:seed
```

### Node.js/Frontend Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Build with SSR
npm run build:ssr

# Type checking
npm run types

# Linting
npm run lint

# Code formatting
npm run format
npm run format:check
```

## Code Quality Tools

The project includes several code quality tools:

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **PHP Pint**: PHP code formatting
- **Pest**: PHP testing framework

## Project Structure

```
assignment-deadline-tracker/
├── app/                          # Laravel application code
├── database/                     # Database migrations, seeders, factories
├── resources/
│   ├── css/                     # Stylesheets
│   ├── js/                      # React/TypeScript frontend code
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── layouts/            # Layout components
│   │   ├── hooks/              # Custom React hooks
│   │   └── types/              # TypeScript type definitions
│   └── views/                   # Blade templates
├── routes/                       # Laravel routes
├── tests/                       # PHP tests
├── public/                      # Public assets
├── composer.json               # PHP dependencies
├── package.json               # Node.js dependencies
└── vite.config.ts             # Vite configuration
```

## Environment Variables

Key environment variables in `.env`:

```env
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://assignment-deadline-tracker.test

# Database (SQLite by default)
DB_CONNECTION=sqlite

# Queue and Cache
QUEUE_CONNECTION=database
CACHE_STORE=database

# Mail (logs by default)
MAIL_MAILER=log
```

## Database Configuration

### SQLite (Default)
No additional configuration needed. The database file is created automatically.

### MySQL
Update your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=assignment_tracker
DB_USERNAME=root
DB_PASSWORD=
```

### PostgreSQL
Update your `.env` file:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=assignment_tracker
DB_USERNAME=postgres
DB_PASSWORD=
```

## Production Deployment

1. Set environment to production:
   ```bash
   APP_ENV=production
   APP_DEBUG=false
   ```

2. Install production dependencies:
   ```bash
   composer install --optimize-autoloader --no-dev
   npm ci
   ```

3. Build assets:
   ```bash
   npm run build
   ```

4. Optimize Laravel:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `composer run test && npm run types`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Testing

Run the test suite:

```bash
# PHP tests
composer run test

# Type checking
npm run types

# Linting
npm run lint
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in `vite.config.ts` or Laravel server
2. **Permission errors**: Ensure proper file permissions for `storage/` and `bootstrap/cache/`
3. **Database connection**: Verify database configuration in `.env`
4. **Node.js version**: Ensure you're using Node.js 18+

### Reset Development Environment

```bash
# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# Reset database
php artisan migrate:fresh --seed

# Reinstall dependencies
rm -rf vendor node_modules
composer install
npm install
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.