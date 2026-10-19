"use client"

import { Card } from '@/components/ui/card';
import { Coins, Star, Package, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from "next/image";
import { Sidebar } from './sidebar';
import { useState, useEffect, useCallback } from 'react';
import type { LucideIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type StoreProduct = {
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  features: string[];
};

const PRODUCT_ICONS: Record<string, LucideIcon> = {
  'gym-premium-membership': Star,
  'zara-t-shirt': Package,
  'smart-water-bottle': Zap,
  'darjeeling-tour-package': Package,
};

export default function RewardsDashboard() {
  const [tokens, setTokens] = useState(0);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch('/api/getCurrUser');
      if (!response.ok) {
        throw new Error('Failed to load token balance');
      }
      const data = await response.json();
      setTokens(data.data.user.tokens);
    } catch (err) {
      console.error("Error occurred while getting tokens:", err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      console.error("Error occurred while getting products:", err);
      toast({ title: 'Unable to load rewards store', variant: 'destructive' });
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchProducts();
  }, [fetchUserData, fetchProducts]);

  const handlePurchase = async (product: StoreProduct) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/user/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Purchase failed');
      }

      toast({ title: `Purchase successful: ${product.name}`, variant: 'success' });

      if (data.purchaseId) {
        await fetch('/api/user/sendEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ purchaseId: data.purchaseId }),
        }).catch((err) => console.error('Confirmation email failed:', err));
      }
    } catch (err) {
      console.error("Error while purchasing:", err);
      toast({
        title: 'Purchase failed. Please try again.',
        description: err instanceof Error ? err.message : undefined,
        variant: 'destructive',
      });
    } finally {
      await fetchUserData();
      setIsLoading(false);
    }
  };

  return (
    <div className="block sm:flex h-screen bg-background">
      <div className="w-[100%] sm:w-64 block">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-blue-500">Rewards Store</h1>
                <p className="text-muted-foreground mt-2">
                  Redeem your tokens for exclusive rewards
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
                <Coins className="h-5 w-5 text-primary" />
                <span className="font-semibold">{tokens} tokens</span>
              </div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((product) => {
              const Icon = PRODUCT_ICONS[product.slug] || Package;
              return (
                <Card key={product.slug} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute right-4 top-4 rounded-full bg-background/90 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      <div className="flex items-center gap-1 text-primary">
                        <Coins className="h-4 w-4" />
                        <span>{product.price}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium">Features:</h4>
                      <ul className="mt-2 space-y-2">
                        {product.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      className="mt-4 w-full"
                      onClick={() => handlePurchase(product)}
                      disabled={product.price > tokens}
                    >
                      {product.price > tokens ? 'Not Enough Tokens' : isLoading ? "Redeeming..." : 'Redeem Now'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
