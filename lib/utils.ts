import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { slug } from 'github-slugger';
import { type Post } from '#site/content';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export function sortPosts(posts: Array<Post>) {
  return posts.sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });
}

export function getAllTags(posts: Array<Post>) {
  const tags: Record<string, number> = {};
  posts.forEach((post) => {
    if (post.published) {
      post.tags?.forEach((tag: string) => {
        tags[tag] = (tags[tag] ?? 0) + 1;
      });
    }
  });

  return tags;
}

export function sortTagsByCount(tags: Record<string, number>) {
  return Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
}

export function getPostsByTagSlug(posts: Array<Post>, tag: string) {
  return posts.filter((post) => {
    if (!post.tags) return false;
    const slugifiedTags = post.tags.map((tag: string) => slug(tag));
    return slugifiedTags.includes(tag);
  });
}

export function generateActivityData(posts: Array<Post>) {
  const activityMap = new Map<string, number>();

  posts.forEach((post) => {
    if (post.published) {
      const date = new Date(post.date).toISOString().split('T')[0];
      activityMap.set(date, (activityMap.get(date) || 0) + 1);
    }
  });

  // Create a date spine for the last 365 days
  const today = new Date();
  const dateSpine = Array.from({ length: 365 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  // Add counts to the date spine
  const activityData = dateSpine.map((date) => ({
    date,
    count: activityMap.get(date) || 0,
    level: activityMap.get(date) ? 1 : 0
  }));

  return activityData;
}
