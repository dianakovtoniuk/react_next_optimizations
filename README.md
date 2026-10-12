# NextPosts

A social-feed app built with **Next.js 14 (App Router)** and **TypeScript**. Users can browse posts, create new ones with an image upload, and like/unlike posts with optimistic UI updates.

## Features

- Home page with the latest posts (streamed with `Suspense`)
- Feed page with all posts and dynamic metadata (post count in the title)
- Create-post form powered by Server Actions with server-side validation
- Image uploads to Cloudinary
- Optimistic like/unlike via `useOptimistic`
- Optimized images with `next/image` and a custom Cloudinary loader
- Loading and error boundaries (`loading.tsx`, `error.tsx`)
- SQLite storage via `better-sqlite3` (auto-created and seeded)

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- React 18
- TypeScript
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [Cloudinary](https://cloudinary.com/)

## Getting Started

### Prerequisites

- Node.js 18.17 or newer
- A free Cloudinary account

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

You can find these values in the Cloudinary Console under **Dashboard → Product Environment Credentials**.

> The app throws an error on startup of `lib/cloudinary.ts` if any of these variables is missing. Restart the dev server after changing `.env.local`.

### Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other Scripts

| Script          | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the development server     |
| `npm run build` | Create a production build        |
| `npm run start` | Start the production server      |
| `npm run lint`  | Run ESLint                       |

## Project Structure

```
.
├── actions/
│   └── posts.ts          # Server Actions: createPost, togglePostLikeStatus
├── app/
│   ├── feed/             # /feed page, loading and error states
│   ├── new-post/         # /new-post page and error state
│   ├── globals.css
│   ├── layout.tsx        # Root layout with header
│   └── page.tsx          # Home page (latest posts)
├── assets/               # Static assets (logo)
├── components/
│   ├── form-submit.tsx   # Submit buttons with pending state
│   ├── header.tsx
│   ├── like-icon.tsx
│   ├── post-form.tsx     # Create-post form (useFormState)
│   └── posts.tsx         # Posts list with optimistic likes
├── lib/
│   ├── cloudinary.ts     # Cloudinary config and uploadImage()
│   ├── format.ts         # Date formatting
│   └── posts.ts          # SQLite access layer and Post types
├── public/
├── next.config.mjs
├── tsconfig.json
└── package.json
```

## Database

The SQLite database file `posts.db` is created automatically in the project root on first run. It contains three tables: `users`, `posts` and `likes`. Two demo users are inserted if the `users` table is empty.

## Notes

- There is no authentication. New posts are attached to user `1`, and likes are made as user `2`.
- Data-layer functions include an artificial 1-second delay to demonstrate loading states and optimistic updates. Remove the `setTimeout` calls in `lib/posts.ts` for real use.
- `posts.db` is a local file and will not persist on serverless platforms such as Vercel. Use a hosted database for production.
- Post images are served from Cloudinary through a custom `next/image` loader, so no `remotePatterns` configuration is needed.
