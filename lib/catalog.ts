import { Product } from '@/models/product';

export type CatalogProduct = {
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  features: string[];
};

export const CATALOG: CatalogProduct[] = [
  {
    slug: 'gym-premium-membership',
    name: 'Gym Premium Membership',
    description: '1 Month of exclusive premium features',
    price: 500,
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
    features: ['Personalized workout plans', 'Nutrition tracking', 'Priority support'],
  },
  {
    slug: 'zara-t-shirt',
    name: 'Zara T Shirt',
    description: 'Zara Cotton T Shirt',
    price: 100,
    image:
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2069&auto=format&fit=crop',
    features: ['5 resistance levels', '100% Cotton', 'M Size'],
  },
  {
    slug: 'smart-water-bottle',
    name: 'Smart Water Bottle',
    description: 'Track your hydration with smart sensors',
    price: 1,
    image:
      'https://images.unsplash.com/photo-1555667865-f4be32e8cc29?q=80&w=2070&auto=format&fit=crop',
    features: ['LED indicators', 'App connectivity', 'Temperature sensing'],
  },
  {
    slug: 'darjeeling-tour-package',
    name: 'Darjeeling Tour Package',
    description: '3 days and 2 nights in Darjeeling',
    price: 4000,
    image:
      'https://images.unsplash.com/photo-1622308644420-b20142dc993c?q=80&w=2070&auto=format&fit=crop',
    features: ['Hotel stay', 'Sightseeing', 'Meals included'],
  },
];

export async function ensureProductsSeeded(): Promise<void> {
  await Product.bulkWrite(
    CATALOG.map((product) => ({
      updateOne: {
        filter: { slug: product.slug },
        update: {
          $setOnInsert: {
            ...product,
            active: true,
          },
        },
        upsert: true,
      },
    }))
  );
}
