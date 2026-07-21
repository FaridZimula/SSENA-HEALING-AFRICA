# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

## Backend & Database

This project uses a Node.js backend with Supabase (PostgreSQL).

### Prerequisites
1. Ensure you have a `.env` file in the `server/` directory with the following keys:
   - `MONGODB_URI` (for migration)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PORT` (default: 5000)

### Setup & Migration
1. **Install Server Dependencies**:
   ```sh
   cd server
   npm install
   ```

2. **Run Data Migration** (from MongoDB to Supabase):
   *Note: Ensure your current IP is whitelisted in MongoDB Atlas.*
   ```sh
   node server/migrate_data.js
   ```

3. **Seed Database** (Initial sample data):
   ```sh
   node server/seed_supabase.js
   ```

4. **Run API Verification Tests**:
   ```sh
   # Start the server first
   node server/index.js
   # In a new terminal
   node server/test_api.js
   ```

### API Endpoints
- `GET /api/status` - Health check
- `GET /api/projects` - List all projects
- `GET /api/leaders` - List leaders
- `POST /api/donate` - Initiate a donation (MarzPay integration)
- `POST /api/messages` - Send contact messages
- `POST /api/register` - Member registration
