# Personal Website (Astro)

Stylish single-page portfolio built with Astro + Tailwind.

## Quick start

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 4321
```

## Customize content

Update text, links, and sections in:

- `src/data/site.ts`

## Add your resume

Place your PDF at:

```
public/resume.pdf
```

The site already links to `/resume.pdf`, so the button and quick links will work as soon as you drop the file in.

## Add your photo

Replace the placeholder image at:

```
public/headphoto.jpg
```

The hero section pulls from `photoPath` in `src/data/site.ts`.