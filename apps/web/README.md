This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

## Getting Started

Use Node.js 20.9 or newer. The repository lockfile is managed by Bun 1.2.21;
install dependencies from the repository root with:

```bash
bun install --frozen-lockfile
```

After installing dependencies, start both web apps from the repository root:

```bash
npm run dev
```

To start only this app from the repository root, run
`npm run dev -- --filter=web`. Alternatively, run `npm run dev` from
`apps/web`. Open [http://localhost:3000](http://localhost:3000) in your
browser. The root `.npmrc` allows npm to run scripts despite the unchanged
workspace's Bun-only `devEngines` declaration.

The map, calendar, and cluster evidence screens fetch the synthetic fixture at
`public/resources/data/demo.json`. Its provenance identifies the values as
illustrative demo data; they are not live fire observations.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to optimize its Inter, Space Grotesk, and JetBrains Mono fonts.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
