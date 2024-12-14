# FoodFlow - Application de gestion de recettes

### Description
Application de gestion de recettes qui suggère un planning hebdomadaire et prépare une liste de courses.

### État actuel du développement
1. Configuration initiale effectuée :
   - Next.js 15 avec TypeScript
   - Supabase pour l'authentification et la base de données
   - ShadCn/UI pour les composants
   - Configuration des couleurs (thème orange #D5896F)

2. Structure du projet :
```
src/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── hooks/
│   └── useAuth.ts
└── lib/
    └── supabase/
        ├── client.ts
        └── server.ts
```

3. Configurations techniques effectuées :
   - Configuration Supabase (authentification)
   - Configuration des paths TypeScript (@/*)
   - Configuration du thème Tailwind
   - Middleware d'authentification

### Prochaines étapes
1. Page de connexion :
   - Formulaire email/mot de passe
   - Connexion avec Google
   - Réinitialisation du mot de passe

2. Formulaire d'ajout de recettes :
   - Upload d'image
   - Liste d'ingrédients
   - Étapes de préparation (éditeur WYSIWYG)
   - Système de tags
   - Sélection du nombre de personnes

3. Page de liste des recettes :
   - Filtrage par tags
   - Sélection pour planning hebdomadaire

4. Page de liste de courses :
   - Catégorisation (produits frais, épices, fruits, etc.)
   - Export de la liste

### Informations techniques importantes
1. Variables d'environnement requises :
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Dépendances principales :
   - @supabase/ssr
   - @supabase/auth-helpers-nextjs
   - shadcn/ui
   - TipTap (à installer pour l'éditeur WYSIWYG)
   - Zustand (à installer pour la gestion d'état)

3. Thème de couleurs :
   - Primaire : #D5896F
   - Déclinaisons configurées dans tailwind.config.ts

### Contexte
- Interface en français
- Focus sur l'expérience utilisateur
- Structure propre avec séparation claire des hooks, utils, et composants UI
- Gestion des erreurs à chaque niveau 