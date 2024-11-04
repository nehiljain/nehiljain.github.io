import { buttonVariants } from '@/components/ui/button';
import { cn, sortPosts } from '@/lib/utils';
import Link from 'next/link';
import BlurFade from '@/components/magicui/blur-fade';
import BlurFadeText from '@/components/magicui/blur-fade-text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DATA } from '@/data/resume';
import { posts } from '#site/content';
import { PostItem } from '@/components/post-item';
import { Card, CardContent, Badge } from '@/components/ui/card';

const BLUR_FADE_DELAY = 0.04;

export default function Home() {
  const latestPosts = sortPosts(posts).slice(0, 5);

  return (
    <main className="container max-w-4xl mx-auto flex flex-col min-h-[100dvh] space-y-10 py-8">
      {/* Hero Section */}
      <section id="hero">
        <div className="mx-auto w-full space-y-8">
          <div className="gap-2 flex justify-between">
            <div className="flex-col flex flex-1 space-y-1.5">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-2xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                yOffset={8}
                text={`Hello, I'm ${DATA.name} 👋`}
              />
              <BlurFadeText
                className="max-w-[600px] md:text-xl text-muted-foreground"
                delay={BLUR_FADE_DELAY}
                text={DATA.currentFocus}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <Avatar className="size-28 border">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="flex min-h-0 flex-col gap-y-3">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-2xl font-bold">About</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <p className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
            {DATA.description}
          </p>
        </BlurFade>
      </section>

      {/* Latest Posts Section */}
      <section id="posts" className="flex min-h-0 flex-col gap-y-3">
        <BlurFade delay={BLUR_FADE_DELAY * 7}>
          <h2 className="text-2xl font-bold">Latest Posts</h2>
        </BlurFade>
        <ul className="flex flex-col">
          {latestPosts.map(
            (post, idx) =>
              post.published && (
                <BlurFade key={post.title} delay={BLUR_FADE_DELAY * (8 + idx)}>
                  <li
                    key={post.slug}
                    className="first:border-t first:border-border"
                  >
                    <PostItem
                      slug={post.slug}
                      title={post.title}
                      description={post.description}
                      date={post.date}
                      tags={post.tags}
                    />
                  </li>
                </BlurFade>
              )
          )}
        </ul>
        <Link
          href="/writing"
          className={cn(buttonVariants({ variant: 'outline' }), 'mt-4')}
        >
          View All Posts →
        </Link>
      </section>

      {/* Contact Section */}
      <section id="contact" className="flex min-h-0 flex-col gap-y-3">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <div className="space-y-3">
            <h2 className="text-xl font-bold">Get in Touch</h2>
            <p className="prose max-w-[600px] text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
              Feel free to reach out for collaborations or just a friendly hello
            </p>
            <Link
              href={`mailto:${DATA.email}`}
              className={buttonVariants({ size: 'lg' })}
            >
              Say Hello
            </Link>
          </div>
        </BlurFade>
      </section>
    </main>
  );
}
