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

The theme needs an API key to communicate with Pterodactyl. Generate one using Laravel tinker:

```bash
php artisan tinker
```

Then run these commands in the tinker shell (replace `admin@localhost` with your admin email):

```php
// Create the token
$user = \Pterodactyl\Models\User::where('email', 'admin@localhost')->first();
$token = $user->createToken('MineIDE', null);
$plainToken = $token->plainTextToken;

// Get the identifier from the database
$apiKey = \Pterodactyl\Models\ApiKey::where('user_id', $user->id)
    ->where('memo', 'MineIDE')
    ->orderBy('id', 'desc')
    ->first();

// Output the FULL API key (identifier + token)
echo "Full API Key: " . $apiKey->identifier . $plainToken . "\n";
```

**Important:** The full API key format is `ptlc_identifier_randomtoken` - you need BOTH parts.

## Step 6: Configure Theme Environment

```bash
cd ../theme

# Copy environment file
cp .env.example .env
```

Edit `.env` with your values:

```env
VITE_PTERODACTYL_URL=http://localhost:8000
VITE_MINECRAFT_API_URL=http://localhost:3001
VITE_PTERODACTYL_API_KEY=ptlc_your_full_api_key_here
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
cd ../minecraft-service
npm start

# Terminal 3: Theme (Vite dev server)
cd ../theme
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
1. Make sure you generated the token using the tinker command above
2. Verify you used the FULL API key (identifier + token), not just the plainTextToken
3. Verify `VITE_PTERODACTYL_API_KEY` in theme/.env matches the full key
4. Check Pterodactyl is running on port 8000
5. Make sure your admin user has `root_admin = true`

### API returns "This account does not have permission to access the API"
Only admin users (root_admin) can access the application API. Make sure your admin user has admin privileges.

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
