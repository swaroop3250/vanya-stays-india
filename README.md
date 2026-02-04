
# Vanya Stays India

## Project Setup & Development

To run this project locally:

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm install --prefix server
npx prisma generate --schema server/prisma/schema.prisma
npx prisma db seed --schema server/prisma/schema.prisma
npm run dev
```

This starts:
- Frontend: http://localhost:8080 (may auto-switch to 8081 if busy)
- Backend: http://localhost:4000

If the backend port is busy, stop the process using port 4000 and rerun:
```sh
# PowerShell
Get-NetTCPConnection -LocalPort 4000 -State Listen | Select-Object -ExpandProperty OwningProcess
Stop-Process -Id <PID> -Force
```

## API & Images

- API base: `http://localhost:4000/api`
- Images: `http://localhost:4000/images`
- Vite proxy is configured for `/api` and `/images`

## Database

This project uses SQLite with Prisma.

Useful commands:
```sh
# From repo root
npx prisma migrate dev --schema server/prisma/schema.prisma
npx prisma db seed --schema server/prisma/schema.prisma
npx prisma studio --schema server/prisma/schema.prisma
```

## Environment Variables

Backend env file: `server/.env`

Required keys:
- `PORT`
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`
- `PUBLIC_BASE_URL`

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Express.js
- Prisma
- SQLite
