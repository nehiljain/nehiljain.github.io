import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { slug } from 'github-slugger';
import { type Post, type Link } from '#site/content';
import readingTime from 'reading-time';

type Taggable = { date: string; tags?: string[]; published: boolean };
type Datable = { date: string };
type SluggableTaggable = { tags?: string[] };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function sortPosts<T extends Datable>(items: Array<T>): Array<T> {
  return items.sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });
}

export function getAllTags(items: Array<Taggable>) {
  const tags: Record<string, number> = {};
  items.forEach((item) => {
    if (item.published) {
      item.tags?.forEach((tag: string) => {
        tags[tag] = (tags[tag] ?? 0) + 1;
      });
    }
  });

  return tags;
}

export function sortTagsByCount(tags: Record<string, number>) {
  return Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
}

export function getPostsByTagSlug<T extends SluggableTaggable>(
  items: Array<T>,
  tag: string
): Array<T> {
  return items.filter((item) => {
    if (!item.tags) return false;
    const slugifiedTags = item.tags.map((t: string) => slug(t));
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

export function getReadingTime(text: string | undefined) {
  if (!text) return '1 min read'; // Default fallback
  const stats = readingTime(text);
  return `${Math.ceil(stats.minutes)} min read`;
}
