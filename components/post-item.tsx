import { EditorialRow } from '@/components/writing/editorial-row';

interface PostItemProps {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  content?: string;
  image?: string;
}

export function PostItem({ content, ...rest }: PostItemProps) {
  return <EditorialRow post={{ ...rest, body: content }} />;
}
