# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/5107c8d3-0377-458c-b37c-f5b15b2b0325

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5107c8d3-0377-458c-b37c-f5b15b2b0325) and start prompting.

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

# Step 4: Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Environment Variables

This project uses environment variables to securely store API keys. You need to set up the following environment variables:

1. Copy the example environment file:
```sh
cp .env.example .env
```

2. Edit the `.env` file with your API keys:
```
# Supabase Configuration
VITE_SUPABASE_URL="your-supabase-url"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Gemini API Configuration
VITE_GEMINI_API_KEY="your-gemini-api-key"
```

3. Restart your development server if it's already running.

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

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend)
- Google Gemini AI

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5107c8d3-0377-458c-b37c-f5b15b2b0325) and click on Share -> Publish.

When deploying, make sure to set up the environment variables in your hosting provider.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
