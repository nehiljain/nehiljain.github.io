import { EditorialRow } from '@/components/writing/editorial-row';

interface PostItemProps {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  content?: string;
  image?: string;
  index?: number;
}

export function PostItem({ index = 0, content, ...rest }: PostItemProps) {
  return <EditorialRow post={{ ...rest, body: content }} index={index} />;
}
