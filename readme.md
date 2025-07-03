# Multi-Cloud Function

_This is a work in progress_

## Deployment

Each platform can be deployed separately using its specific CLI.

### Azure

Requirements:
- Azure CLI (az)
- Azure Functions Core Tools

```sh
# Create a new function app
az login
az group create --name my-rg --location eastus
az storage account create --name mystorage1234 --location eastus --resource-group my-rg --sku Standard_LRS
az functionapp create \
  --resource-group my-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --functions-version 4 \
  --name app-name \
  --storage-account mystorage1234

# Deploy using core tools
func azure functionapp publish app-name

```

### Cloudflare Worker

Requirements:
- wrangler CLI
- A Cloudflare account

```sh
# Login & init
npx wrangler login
npx wrangler init my-worker

# Replace wrangler.toml & index.ts with your logic
# Then deploy:
npx wrangler deploy
```

Set secrets/env vars using:

```sh
npx wrangler secret put API_KEY
```

### DigitalOcean

Requirements:
- doctl CLI (brew install doctl or from https://docs.digitalocean.com/reference/doctl/)
- A DigitalOcean account & token

```sh
doctl auth init
doctl serverless init
doctl serverless deploy path/to/my-func-dir
```

### Google Cloud

Requirements:
- Google Cloud SDK (gcloud)
- Project and billing enabled

```sh
gcloud auth login
gcloud config set project [PROJECT_ID]

# Deploy function
gcloud functions deploy myFunction \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point handler \
  --region us-central1 \
  --source .
```

> `handler` should match the exported function name

### Heroku

Requirements:
- heroku CLI
- Git repo with Procfile

```sh
heroku login
heroku create my-function-app
echo "web: node index.js" > Procfile

git init
git add .
git commit -m "deploy function"
git push heroku master
```

> Function must expose a web server (e.g., via Express)

### Netlify

Requirements:
- netlify-cli
- Netlify account

```sh
npm install -g netlify-cli
netlify login

# Deploy directory
netlify init
netlify deploy --build
```

### Oracle

Requirements:
- OCI CLI
- Docker installed
- Fn Project CLI (fn)

```sh
fn init --runtime node --name my-func
fn -v deploy --app my-app --create-app
```
