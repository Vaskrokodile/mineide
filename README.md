# MineIDE

A custom Pterodactyl panel theme with a modern, dark UI design and built-in Minecraft server management.

## Features

- **Modern dark theme** with purple accents
- **Responsive sidebar navigation**
- **Dashboard** with server/node health overview
- **Server, User, Node, and Location management** pages
- **Settings page** with configuration options
- **Minecraft Server Creator** - Create and manage local Minecraft servers
  - Multiple server types (Vanilla, Paper, Spigot, Purpur)
  - Full configuration options (RAM, difficulty, PvP, whitelist, etc.)
  - Real-time console with command support
  - Server start/stop/restart
  - World backups
  - Plugin management

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State**: React Query
- **Backend**: Pterodactyl Panel API
- **Minecraft Service**: Node.js (Express + WebSocket)

## Setup

### Prerequisites

- Node.js 18+
- Java (for Minecraft servers)
- PHP 8.2+ (for Pterodactyl backend)
- MySQL/PostgreSQL (for Pterodactyl backend)

### Theme Installation

```bash
cd theme
npm install
```

### Minecraft Service Installation

```bash
cd minecraft-service
npm install
```

### Configuration

Create a `.env` file in the theme directory:

```bash
VITE_PTERODACTYL_URL=http://localhost:8000
VITE_MINECRAFT_API_URL=http://localhost:3001
```

### Running Services

1. **Pterodactyl Backend** (in panel directory):
   ```bash
   php artisan serve --port=8000
   ```

2. **Minecraft Service** (in minecraft-service directory):
   ```bash
   npm start
   ```

3. **Theme Dev Server** (in theme directory):
   ```bash
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

## Minecraft Server Features

### Server Types
- **Vanilla** - Default Minecraft server
- **Paper** - Optimized for performance
- **Spigot** - High performance with plugin support
- **Purpur** - Fully configurable

### Configuration Options
- Server name and MOTD
- Version selection (1.12.2 - 1.21.4)
- Port and max players
- RAM allocation (512MB - 16GB)
- Difficulty (Peaceful, Easy, Normal, Hard)
- Gameplay (PvP, Whitelist, Flight)
- World (Seed, Animals, Monsters, NPCs)
- View Distance
- Online Mode

### Console Features
- Real-time console output via WebSocket
- Send commands directly from the UI
- Color-coded output (errors, warnings, info)
- Server start/stop/restart controls

## Project Structure

```
├── theme/                 # Custom React theme
│   ├── src/
│   │   ├── api/          # API clients for Pterodactyl & Minecraft
│   │   ├── components/   # UI and layout components
│   │   ├── pages/        # Dashboard & Minecraft pages
│   │   └── types/        # TypeScript interfaces
│   └── ...
│
├── minecraft-service/     # Minecraft server management service
│   ├── servers/          # Created server instances
│   ├── cache/            # Downloaded server JARs
│   └── server.js         # Express + WebSocket API
│
└── panel/                 # Pterodactyl panel (fork)
    ├── app/              # PHP application
    ├── resources/        # Frontend assets
    └── ...
```

## License

This project includes Pterodactyl which is licensed under the [GPL-3.0 License](https://github.com/pterodactyl/panel/blob/develop/LICENSE.md).

The custom theme code and Minecraft service are open source and free to use.
