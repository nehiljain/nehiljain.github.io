import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DATA } from '@/data/resume';
import BlurFade from '@/components/magicui/blur-fade';
import BlurFadeText from '@/components/magicui/blur-fade-text';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

const BLUR_FADE_DELAY = 0.04;

export default function AboutPage() {
  return (
    <main className="container max-w-4xl mx-auto py-8 space-y-12">
      {/* Hero Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-8">
          <BlurFade delay={BLUR_FADE_DELAY}>
            <Avatar className="size-32 border">
              <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
              <AvatarFallback>{DATA.initials}</AvatarFallback>
            </Avatar>
          </BlurFade>
          <div className="space-y-2">
            <BlurFadeText
              text={DATA.name}
              className="text-3xl font-bold"
              delay={BLUR_FADE_DELAY}
            />
            <BlurFadeText
              text={`${DATA.title} @ ${DATA.org}`}
              className="text-xl text-muted-foreground"
              delay={BLUR_FADE_DELAY * 2}
            />
            <BlurFadeText
              text={DATA.location}
              className="text-muted-foreground"
              delay={BLUR_FADE_DELAY * 3}
            />
          </div>
        </div>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <div className="flex gap-2">
            {Object.entries(DATA.contact.social).map(([name, social]) => (
              <Link
                key={name}
                href={social.url}
                className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                target="_blank"
              >
                <social.icon className="size-5" />
              </Link>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* Skills Section */}
      <section className="space-y-4">
        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <h2 className="text-2xl font-bold">Skills</h2>
        </BlurFade>
        <div className="space-y-6">
          {DATA.skills.map((skillGroup, idx) => (
            <BlurFade key={skillGroup.type} delay={BLUR_FADE_DELAY * (6 + idx)}>
              <Card>
                <CardHeader className="font-semibold">
                  {skillGroup.type}
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {skillGroup.tools.map((tool) => (
                    <Badge key={tool} variant="secondary">
                      {tool}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="space-y-4">
        <BlurFade delay={BLUR_FADE_DELAY * 8}>
          <h2 className="text-2xl font-bold">Experience</h2>
        </BlurFade>
        <div className="space-y-4">
          {DATA.work.map((job, idx) => (
            <BlurFade key={job.title} delay={BLUR_FADE_DELAY * (9 + idx)}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <Link
                        href={job.href}
                        className="text-muted-foreground hover:text-primary"
                        target="_blank"
                      >
                        {job.company}
                      </Link>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {job.start} - {job.end}
                    </p>
                  </div>
                  {job.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {job.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="space-y-4">
        <BlurFade delay={BLUR_FADE_DELAY * 14}>
          <h2 className="text-2xl font-bold">Education</h2>
        </BlurFade>
        {DATA.education.map((edu, idx) => (
          <BlurFade key={edu.school} delay={BLUR_FADE_DELAY * (15 + idx)}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{edu.school}</h3>
                    <p className="text-muted-foreground">{edu.degree}</p>
                    <p className="text-sm text-muted-foreground">
                      {edu.location}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {edu.start} - {edu.end}
                  </p>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </section>

      {/* Projects Section */}
      <section className="space-y-4">
        <BlurFade delay={BLUR_FADE_DELAY * 16}>
          <h2 className="text-2xl font-bold">Projects</h2>
        </BlurFade>
        <div className="space-y-6">
          {DATA.projects.map((project, idx) => (
            <BlurFade key={project.title} delay={BLUR_FADE_DELAY * (17 + idx)}>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {project.title}
                        </h3>
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
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                      {project.impact && (
                        <p className="text-sm text-muted-foreground">
                          {project.impact}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>
      </section>
    </main>
  );
}
