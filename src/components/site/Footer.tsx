import { GithubIcon } from "@/components/icons/GithubIcon";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import { CopyEmailIconButton } from "@/components/site/CopyEmailIconButton";

export function Footer({
  fullName,
  email,
  githubUrl,
  linkedinUrl,
}: {
  fullName: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string | null;
}) {
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
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="transition-colors hover:text-foreground"
            >
              <LinkedinIcon size={18} />
            </a>
          )}
          <CopyEmailIconButton email={email} size={18} />
        </div>
      </div>
    </footer>
  );
}
