# IC-NextJs-Prabesh-Dahal

The application is bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

## License

This project is Copyright (c) 2014 and onwards Nimble. It is free software and may be redistributed under the terms specified in the [LICENSE] file.

[LICENSE]: /LICENSE

## About

<a href="https://nimblehq.co/">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://assets.nimblehq.co/logo/dark/logo-dark-text-160.png">
    <img alt="Nimble logo" src="https://assets.nimblehq.co/logo/light/logo-light-text-160.png">
  </picture>
</a>

This project is maintained and funded by Nimble.

We ❤️ open source and do our part in sharing our work with the community!
See [our other projects][community] or [hire our team][hire] to help build your product.

Want to join? [Check out our Jobs][jobs]!

[community]: https://github.com/nimblehq
[hire]: https://nimblehq.co/
[jobs]: https://jobs.nimblehq.co/