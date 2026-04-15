# Wedding — Shopify Theme

A custom Shopify 2.0 theme built from a clean skeleton structure.

## Structure

```
Wedding/
├── assets/          # CSS, JS, images, fonts
├── config/          # Theme settings (schema + data)
├── layout/          # theme.liquid, password.liquid
├── locales/         # Translation files (en, fr)
├── sections/        # Section files (header, footer, main-*)
├── snippets/        # Reusable Liquid snippets
└── templates/       # JSON templates (Shopify 2.0)
    └── customers/   # Customer account templates
```

## Development

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Connect and preview locally
shopify theme dev --store=your-store.myshopify.com

# Push to Shopify
shopify theme push
```

## Sections incluses

| Section | Fichier |
|---|---|
| Header | `sections/header.liquid` |
| Footer | `sections/footer.liquid` |
| Product | `sections/main-product.liquid` |
| Collection | `sections/main-collection.liquid` |
| Page | `sections/main-page.liquid` |
| Cart | `sections/main-cart.liquid` |
| Blog | `sections/main-blog.liquid` |
| Article | `sections/main-article.liquid` |
| Search | `sections/main-search.liquid` |
| 404 | `sections/main-404.liquid` |
| Password | `sections/main-password.liquid` |

## Customisation

Tous les paramètres globaux (couleurs, typographie) sont configurables depuis le **Theme Editor** Shopify via `config/settings_schema.json`.
