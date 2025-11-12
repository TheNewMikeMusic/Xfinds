# Hero Background Images

Place hero background images in this directory.

## Default Image

- **File**: `xfinds-hero-default.jpg`
- **Usage**: If this file exists, it will be used as the hero background
- **Fallback**: If the file is missing, a CSS gradient will be used automatically

## Image Requirements

- Recommended size: 1920x1080px or larger
- Format: JPG, PNG, or WebP
- File size: Optimize for web (under 500KB recommended)

## Configuration

The hero background is configured in `content/hero.ts`:

```typescript
background: {
  kind: "image",
  src: "/hero/xfinds-hero-default.jpg",
  alt: "Xfinds hero background",
}
```

To use a different image, update the `src` path in `content/hero.ts`.

