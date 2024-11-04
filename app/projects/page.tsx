import { DATA } from '@/data/resume';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import BlurFade from '@/components/magicui/blur-fade';

const BLUR_FADE_DELAY = 0.04;

export default function ProjectsPage() {
  return (
    <main className="container max-w-4xl mx-auto py-8 space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">🛠️ Projects & Experiments</h1>
        <p className="text-muted-foreground">
          A collection of AI tools and experiments I&apos;ve built - from
          hackathon wins to weekend hacks.
        </p>
      </section>

      <section className="grid gap-6">
        {DATA.projects.map((project, idx) => (
          <BlurFade key={project.title} delay={BLUR_FADE_DELAY * (idx + 1)}>
            <Card className="group hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {project.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {project.industry} • {project.role}
                      </p>
                    </div>
                    <Badge
                      variant={
                        project.status === 'current' ? 'default' : 'secondary'
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>

                  {project.impact && (
                    <p className="text-sm border-l-2 border-primary pl-4 py-1">
                      {project.impact}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </section>
    </main>
  );
}
