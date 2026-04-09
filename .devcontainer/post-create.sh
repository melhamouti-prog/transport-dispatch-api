#!/usr/bin/env bash
set -euo pipefail

cd /workspaces/app

cat > .env <<'EOF'
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/transport_dispatch?schema=public"
JWT_SECRET="change-me"
REFRESH_TOKEN_SECRET="change-me-refresh"
ACCESS_TOKEN_TTL="15m"
REFRESH_TOKEN_TTL="30d"
PORT=3000
POSTGRES_DB="transport_dispatch"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
EOF

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

npx prisma generate

echo "✅ Codespaces prêt. Lance maintenant : npm run codespaces:init puis npm run codespaces:start"
