'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/hero-kitchen.webp"
              alt="Chef preparing dishes in a professional kitchen"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                Simplifiez votre cuisine au quotidien
              </h1>
              <p className="mt-6 text-xl text-gray-200 max-w-3xl mx-auto">
                FoodFlow transforme vos recettes en plannings hebdomadaires et listes de courses intelligentes. 
                Cuisinez sereinement, sans prise de tête.
              </p>
              <div className="mt-10">
                <Link href="/register">
                  <Button size="lg" className="rounded-full px-8">
                    Commencer gratuitement
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Feature 1: Recipes */}
              <div className="text-center">
                <div className="h-40 relative rounded-lg mb-6">
                  <Image
                    src="/undraw_recipes.png"
                    alt="Illustration de recettes de cuisine"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Gestion de vos recettes
                </h3>
                <p className="text-muted-foreground">
                  Créez, organisez et retrouvez facilement toutes vos recettes préférées. 
                  Ajoutez des photos, des notes et des astuces personnelles.
                </p>
              </div>

              {/* Feature 2: Planning */}
              <div className="text-center">
                <div className="h-40 relative rounded-lg mb-6">
                  <Image
                    src="/undraw_planning.png"
                    alt="Illustration de planning de repas"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Planning intelligent
                </h3>
                <p className="text-muted-foreground">
                  Générez automatiquement votre planning de repas de la semaine. 
                  Équilibré, varié et adapté à vos préférences.
                </p>
              </div>

              {/* Feature 3: Shopping */}
              <div className="text-center">
                <div className="h-40 relative rounded-lg mb-6">
                  <Image
                    src="/undraw_shopping.png"
                    alt="Illustration de liste de courses"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Liste de courses optimisée
                </h3>
                <p className="text-muted-foreground">
                  Obtenez instantanément votre liste de courses, organisée par rayon 
                  et optimisée pour éviter le gaspillage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-8">
              Prêt à révolutionner votre cuisine ?
            </h2>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg">
                  Créer un compte
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
