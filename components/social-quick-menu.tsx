import { SOCIAL_LINKS } from "@/lib/site-config";

const LINKS = [
  {
    href: SOCIAL_LINKS.instagram,
    label: "인스타그램",
    background:
      "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)",
    iconColor: "#fff",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: SOCIAL_LINKS.youtube,
    label: "유튜브",
    background: "#FF0000",
    iconColor: "#fff",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect x="3" y="5.5" width="18" height="13" rx="4" fill="currentColor" />
        <path d="M10.3 9.3L15 12L10.3 14.7V9.3Z" fill="#FF0000" />
      </svg>
    ),
  },
  {
    href: SOCIAL_LINKS.kakao,
    label: "카카오톡 채널",
    background: "#FEE500",
    iconColor: "#391B1B",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M12 4C7 4 3 7.2 3 11.2C3 13.7 4.6 15.9 7 17.2L6.2 20.4L9.8 18.2C10.5 18.3 11.2 18.4 12 18.4C17 18.4 21 15.2 21 11.2C21 7.2 17 4 12 4Z"
          fill="currentColor"
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
          style={{ background: link.background, color: link.iconColor }}
          className="flex h-11 w-11 items-center justify-center rounded-full shadow-sm transition-transform hover:scale-105"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
