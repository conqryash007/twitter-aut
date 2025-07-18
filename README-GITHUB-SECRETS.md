# Setting up GitHub Repository Secrets

To run this bot in GitHub Actions, you need to add your API keys as repository secrets:

## Steps:

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** for each of the following:

### Required Secrets:

- `APP_KEY` - Your Twitter App Key
- `APP_SECRET` - Your Twitter App Secret
- `ACCESS_TOKEN` - Your Twitter Access Token
- `ACCESS_SECRET` - Your Twitter Access Token Secret
- `GEMINI_API_KEY` - Your Google Gemini API Key

## Getting Twitter API Keys:

1. Go to https://developer.twitter.com/
2. Create a new app or use existing one
3. Get your keys from the app dashboard

## Getting Gemini API Key:

1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the key

⚠️ **Important**: Never commit your actual API keys to the repository. Always use repository secrets for production deployments.
