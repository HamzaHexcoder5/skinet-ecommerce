## Features

- .NET 8 Web API with clean architecture
- Angular 18 frontend using standalone components and Angular Material
- Tailwind CSS for modern styling
- Admin panel for order management and refunds
- Coupon/voucher support for discounts
- Stripe payments with webhook integration
- SignalR real-time notifications (order completion, etc.)
- Dockerized SQL Server and Redis for local development
- Robust error handling and user experience
- JWT authentication and role-based authorization
- Database seeding for demo/testing

## Prerequisites

- Docker
- .NET SDK v8
- Node.js (v20.11.1 or higher)
- Git

## Getting Started

Clone the repository:

```bash
git clone <your-repo-url>
cd skinet-2024-enhanced
```

Restore .NET packages:

```bash
dotnet restore
```

Install client dependencies:

```bash
cd client
npm install
```

Start SQL Server and Redis with Docker:

```bash
# From the root directory
docker compose up -d
```

Configure Stripe (optional for payments):

- Create a Stripe account and get your API keys.
- In `API/appsettings.Development.json`, add your Stripe keys under `StripeSettings` (create the section if missing):

```json
"StripeSettings": {
  "PublishableKey": "pk_test_REPLACEME",
  "SecretKey": "sk_test_REPLACEME",
  "WhSecret": "whsec_REPLACEME"
}
```

For webhooks, install [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

```bash
stripe login
stripe listen --forward-to https://localhost:5001/api/payments/webhook -e payment_intent.succeeded
```

Run the API:

```bash
cd API
dotnet run
# API runs at https://localhost:5001
```

Run the Angular client:

(Optional) Install a self-signed SSL certificate for local HTTPS:

```bash
cd client/ssl
mkcert localhost
```

Start the client:

```bash
cd client
npm start
# Client runs at https://localhost:4200
```

Browse the app:

- API: https://localhost:5001
- Client: https://localhost:4200

## Admin Panel

- Access the admin panel at `/admin` (e.g., https://localhost:4200/admin)
- Only users with the Admin role can access admin features (order management, refunds)
- To create an admin user, manually assign the Admin role in the database or extend the seeding logic

## Coupons & Vouchers

- Apply coupon codes at checkout for discounts
- Coupon validation is handled via the `/api/coupons/{code}` endpoint

## Real-time Notifications

- Order completion notifications are sent via SignalR
- The client automatically connects to the notification hub

## API Endpoints

- `/api/products` - Product catalog (CRUD for admins)
- `/api/cart` - Shopping cart operations
- `/api/orders` - Order creation and history
- `/api/payments` - Stripe payment integration
- `/api/coupons` - Coupon validation
- `/api/admin` - Admin-only endpoints

## Testing

Backend:

- Add and run tests using your preferred .NET test framework

Frontend:

- Run Angular unit tests:

```bash
npm test
```

## Database Seeding

- On first run, the API seeds the database with demo products and users
- Default users are created; update the seeding logic for custom admin accounts

## Environment Variables

- API: Configure in `API/appsettings.Development.json`
- Client: Configure in `client/src/environments/environment*.ts`

## Technologies Used

- .NET 8, Entity Framework Core
- Angular 18, Angular Material, Tailwind CSS
- Stripe, SignalR, Docker, SQL Server, Redis
