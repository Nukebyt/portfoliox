Personal portfolio built with Next.js (App Router), TypeScript and Tailwind.

## How content works

There is no database or admin site. Everything the site shows lives in the repo:

- `content/*.json`: projects, blogs, events, certificates and skills
- `public/uploads/`: images added through the editor
- `src/lib/content.ts`: the static parts (technologies, education)

You edit content with a terminal tool on your laptop. Publishing commits those files and pushes, and Netlify rebuilds the site.

## Posting content

```bash
npm run post
```

An interactive menu opens:

1. Pick a section (Projects, Blogs, Events, Certificates, Skills).
2. Add, edit, delete or reorder items. On edit, press Enter to keep a field as is.
3. Pick **Publish** to commit and push. Quit also offers to publish.

Notes:

- **Blogs:** paste a Blogspot post URL. The title and cover image are fetched for you.
- **Images:** give a file path (drag the file into the terminal) or an `https://` URL. It is copied into `public/uploads/`. Limit is 5 MB, so shrink big photos first. Type `-` on an edit to remove an image.
- Publish only stages `content/` and `public/uploads/`, so unrelated code changes are never swept into a content commit.
- To preview before publishing, run `npm run dev` in another terminal. Changes show on save.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Environment variables

Only the contact form needs any (set them in `.env.local` and in Netlify):

- `NEXT_PUBLIC_FORMSPREE_ACTION`: Formspree endpoint URL
- `NEXT_PUBLIC_CONTACT_EMAIL`: address shown in the contact section
