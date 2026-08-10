import { SOCIAL_LINKS } from "@/lib/site-config";

const LINKS = [
  {
    href: SOCIAL_LINKS.instagram,
    label: "인스타그램",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: SOCIAL_LINKS.youtube,
    label: "유튜브",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect
          x="3"
          y="5.5"
          width="18"
          height="13"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M10.5 9.5L14.5 12L10.5 14.5V9.5Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: SOCIAL_LINKS.kakao,
    label: "카카오톡 채널",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M12 4C7 4 3 7.2 3 11.2C3 13.7 4.6 15.9 7 17.2L6.2 20.4L9.8 18.2C10.5 18.3 11.2 18.4 12 18.4C17 18.4 21 15.2 21 11.2C21 7.2 17 4 12 4Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function SocialQuickMenu() {
  return (
    <div className="fixed top-1/2 right-4 z-40 flex -translate-y-1/2 flex-col gap-2 md:right-6">
      {LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-sm transition-colors hover:bg-mist"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
