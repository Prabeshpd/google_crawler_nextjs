# Next JS Google Crawler


## Docker Compose

- ### Start Development Server

  ```bash
  cp .env.example .env

  make dev-start
  ```

  Make sure to update the .env variables.

  ```
  POSTGRES_DB_CONNECTION_URL = postgresql://postgres:Password@1234@localhost:5432/web_scrapers
  ```

  Open http://localhost:3000 with your browser to see the result.

- ### Test Application

  ```bash
  cp .env.example .env.test

  make test
  ```

  Make sure to update the .env.test variables.

  ```
  POSTGRES_DB_CONNECTION_URL = postgresql://postgres:Password@1234@localhost:5432/web_scrapers_test
  ```

## Getting Started

### Development

1. Install all dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

2. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open http://localhost:3000 with your browser to see the result.

### Test

1. Unit test

   ```bash
   yarn test
   ```

2. UI Test

   ```bash
   yarn cypress:test:open
   ```
