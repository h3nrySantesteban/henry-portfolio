import { Mail } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

export function Footer({ fullName, email, githubUrl }: { fullName: string; email: string; githubUrl: string }) {
  return (
    <footer className="border-t border-surface/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-sm text-foreground/50 sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {fullName}
        </p>
        <div className="flex items-center gap-4">
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="transition-colors hover:text-foreground"
          >
            <GithubIcon size={18} />
          </a>
          <a href={`mailto:${email}`} aria-label="Email" className="transition-colors hover:text-foreground">
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
