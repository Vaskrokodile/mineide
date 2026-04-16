# MineIDE

A custom Pterodactyl panel theme with a modern, dark UI design.

## Features

- Modern dark theme with purple accents
- Responsive sidebar navigation
- Dashboard with server/node health overview
- Server, User, Node, and Location management pages
- Settings page with configuration options

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State**: React Query
- **Backend**: Pterodactyl Panel API

## Setup

### Prerequisites

- Node.js 18+
- PHP 8.2+ (for Pterodactyl backend)
- MySQL/PostgreSQL (for Pterodactyl backend)

### Theme Installation

```bash
cd theme
npm install
```

### Configuration

Create a `.env` file in the theme directory:

```bash
VITE_PTERODACTYL_URL=http://localhost:8000
```

### Development

```bash
cd theme
npm run dev
```

The theme will be available at http://localhost:5173/

### Build for Production

```bash
cd theme
npm run build
```

## Pterodactyl Backend Setup

The `panel/` directory contains the Pterodactyl backend. For full setup instructions, visit the [Pterodactyl documentation](https://pterodactyl.io/).

### Quick Setup

```bash
cd panel

# Install dependencies
composer install

# Copy and configure environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Create admin user
php artisan tinker --execute="
\$user = new Pterodactyl\Models\User();
\$user->uuid = Illuminate\Support\Str::uuid()->toString();
\$user->username = 'admin';
\$user->email = 'admin@localhost';
\$user->name_first = 'Admin';
\$user->name_last = 'User';
\$user->password = bcrypt('YourPassword123!');
\$user->root_admin = true;
\$user->save();
"

# Start server
php artisan serve --port=8000
```

## Project Structure

```
├── theme/                 # Custom React theme
│   ├── src/
│   │   ├── api/          # API clients for Pterodactyl
│   │   ├── components/   # UI and layout components
│   │   ├── pages/        # Dashboard pages
│   │   └── types/        # TypeScript interfaces
│   └── ...
│
└── panel/                 # Pterodactyl panel (fork)
    ├── app/              # PHP application
    ├── resources/        # Frontend assets
    └── ...
```

## License

This project includes Pterodactyl which is licensed under the [GPL-3.0 License](https://github.com/pterodactyl/panel/blob/develop/LICENSE.md).

The custom theme code is open source and free to use.
