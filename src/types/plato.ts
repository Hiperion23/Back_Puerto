export interface Plato {
  id: string
  name: string
  description: string
  price: number
  categoria_id: string
  categoria?: {
    id: string
    nombre: string
  }
  image: string
  images: string[]
  tags: string[]
  ingredients: string[]
  allergens: string[]
  disponible: boolean
  orden: number | null
  created_at: string
}