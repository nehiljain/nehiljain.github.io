import { HomeHero } from '@/components/home/hero';
import { HomeNowSection } from '@/components/home/now-section';
import { HomeLatestPosts } from '@/components/home/latest-posts';

export default function Home() {
  return (
    <main className="mx-auto max-w-content px-4 pb-20 pt-16 sm:px-8">
      <HomeHero />
      <HomeNowSection />
      <HomeLatestPosts />
    </main>
  );
}
