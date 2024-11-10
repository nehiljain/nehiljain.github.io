import HeroVideoDialog from '@/components/ui/hero-video-dialog';

interface YouTubeProps {
  id: string;
  title?: string;
  thumbnail?: string;
}

export function YouTube({ id, title, thumbnail }: YouTubeProps) {
  return (
    <div className="relative my-8">
      <HeroVideoDialog
        animationStyle="from-center"
        videoSrc={`https://www.youtube.com/embed/${id}`}
        thumbnailSrc={
          thumbnail || `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
        }
        thumbnailAlt={title || 'YouTube Video'}
      />
    </div>
  );
}
