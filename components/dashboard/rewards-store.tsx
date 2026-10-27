"use client"

import { Card } from '@/components/ui/card';
import { Coins, Star, Package, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from "next/image";
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
      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Rewards Store</h1>
                <p className="mt-3 max-w-2xl text-lg text-zinc-400">
                  Redeem your tokens for exclusive rewards
                </p>
              </div>
              <div className="flex w-fit items-center gap-2 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-5 py-3 text-yellow-400">
                <Coins className="h-5 w-5" />
                <span className="font-bold">{tokens.toLocaleString()} tokens</span>
              </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {products.map((product) => {
              const Icon = PRODUCT_ICONS[product.slug] || Package;
              return (
                <Card key={product.slug} className="overflow-hidden rounded-3xl border-2 border-white/10 bg-zinc-900/50 text-white shadow-2xl shadow-black/50 backdrop-blur-xl">
                  <div className="relative h-48 sm:h-56">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute right-4 top-4 rounded-2xl border border-white/10 bg-zinc-900/90 p-3">
                      <Icon className="h-5 w-5 text-yellow-400" />
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-bold text-white">{product.name}</h3>
                      <div className="flex shrink-0 items-center gap-1 rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-3 py-2 font-bold text-yellow-400">
                        <Coins className="h-4 w-4" />
                        <span>{product.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                      {product.description}
                    </p>
                    <div className="mt-6">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Features</h4>
                      <ul className="mt-2 space-y-2">
                        {product.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-2 text-sm text-zinc-300"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      className="mt-8 w-full rounded-2xl bg-yellow-400 py-6 text-base font-black text-black shadow-xl shadow-yellow-500/20 hover:bg-yellow-300"
                      onClick={() => handlePurchase(product)}
                      disabled={isLoading || product.price > tokens}
                    >
                      {isLoading ? 'REDEEMING...' : product.price > tokens ? 'NOT ENOUGH TOKENS' : 'REDEEM NOW'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
  );
}
