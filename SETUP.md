# MineIDE Setup Guide

A custom Pterodactyl-themed panel with Minecraft server management and AI coding assistant.

## Prerequisites

- macOS (this guide uses Homebrew)
- MySQL 8.0+
- PHP 8.2+ with extensions (mcrypt, curl, gd, pdo_mysql, zip, tokenizer)
- Composer
- Node.js 18+
- Yarn
- Java (for Minecraft servers)

## Step 1: Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Vaskrokodile/mineide.git
cd mineide

# Install PHP dependencies for panel
cd panel && composer install

# Install Node dependencies for theme
cd ../theme && npm install

# Install Node dependencies for Minecraft service
cd ../minecraft-service && npm install
```

## Step 2: MySQL Setup

```bash
# Install MySQL via Homebrew
brew install mysql
brew services start mysql

# Secure MySQL installation
mysql_secure_installation

# Create database and user
mysql -u root -p
```

```sql
CREATE DATABASE pterodactyl;
CREATE USER 'pterodactyl'@'127.0.0.1' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON pterodactyl.* TO 'pterodactyl'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

## Step 3: Configure Panel Environment

```bash
cd panel

# Copy environment file
cp .env.example .env
# OR for quick setup, copy from below and edit credentials

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate --seed
```

## Step 4: Create Admin User

```bash
php artisan p:user:make
# Follow prompts to set email, username, password
```

## Step 5: Generate Pterodactyl API Key

The application API key is required for the theme to authenticate. Generate it:

```bash
php artisan tinker
```

Then run this in the tinker shell (replace `admin@example.com` with your admin email):

```php
$user = \Pterodactyl\Models\User::where('email', 'admin@example.com')->first();
$token = $user->createToken('MineIDE', ['*']);
echo $token->plainTextToken;
```

Copy the token (format: `ptlc_...`). You'll use it in the theme setup.

## Step 6: Configure Theme Environment

```bash
cd ../theme

# Copy environment file
cp .env.example .env
```

Edit `.env`:
```env
VITE_PTERODACTYL_URL=http://localhost:8000
VITE_MINECRAFT_API_URL=http://localhost:3001
VITE_PTERODACTYL_API_KEY=ptlc_your_token_here
```

## Step 7: Build Theme

```bash
npm run build
```

## Step 8: Configure Minecraft Service

```bash
cd ../minecraft-service
cp .env.example .env
# Edit .env if needed (defaults work for local dev)
```

## Step 9: Run Services

```bash
# Terminal 1: Pterodactyl Panel
cd panel
php artisan serve --port=8000

# Terminal 2: Minecraft Service
cd minecraft-service
npm start

# Terminal 3: Theme (Vite dev server)
cd theme
npm run dev
```

## Access Points

- **Theme UI:** http://localhost:5173
- **Pterodactyl API:** http://localhost:8000/api
- **Minecraft API:** http://localhost:3001

## Quick Start with Local Credentials

For local development, copy your credentials to these files (gitignored):

### `panel/.env.local`
Your Pterodactyl panel environment variables.

### `theme/.env.local`
Your theme environment variables including API key.

### `minecraft-service/.env.local`
Your Minecraft service configuration.

These `.local` files are gitignored and won't be pushed to GitHub.

## Troubleshooting

### "Command not found: php"
```bash
brew install php
```

### "Command not found: composer"
```bash
brew install composer
```

### "MySQL connection refused"
```bash
brew services restart mysql
```

### Theme shows "Invalid API key"
- Make sure you generated the token using `createToken()` method
- Verify `VITE_PTERODACTYL_API_KEY` in theme/.env matches
- Check Pterodactyl is running on port 8000

## Project Structure

```
mineide/
├── panel/              # Pterodactyl Laravel backend
│   ├── app/           # Application code
│   └── bootstrap/     # Laravel bootstrap
├── theme/             # Custom React + Vite frontend
│   ├── src/
│   │   ├── api/      # API clients
│   │   ├── components/ # UI components
│   │   ├── pages/    # Page components
│   │   └── context/  # React context
│   └── dist/         # Built assets
└── minecraft-service/ # Node.js Minecraft manager
    ├── server.js     # Express + WebSocket API
    └── servers/      # Minecraft server data
```
