export const SITE = {
  name: "인테리어레시피",
  // 실제 상담 신청 채널(이메일, 폼, 카카오톡 채널 등)이 정해지면 이 값만 바꿔주세요.
  // 모든 상담 신청 버튼이 이 링크 하나를 함께 사용합니다.
  contactHref: "mailto:hello@interiorrecipe.kr",
  // 상담 신청 버튼들이 연결되는 체크리스트 폼 경로입니다.
  reservationHref: "/reservation",
  // public/videos/hero.mp4 자리에 영상 파일을 넣으면 히어로 배경으로 바로 재생됩니다.
  // 자동재생 조건상 소리가 없는(무음) mp4여야 하며, 10~20MB 이하로 압축하는 걸 권장합니다.
  heroVideoSrc: "/videos/hero.mp4",
  heroPosterSrc: "/videos/hero-poster.jpg",
  // 쿠팡파트너스 전용 스토어 링크
  shopHref: "https://influencers.coupang.com/s/interior_recipe",
  // public 폴더에 logo.png (또는 logo.svg) 파일을 넣으면 헤더 로고로 표시됩니다.
  logoSrc: "/logo.png",
};

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/interior_recipe.zip",
  youtube: "https://www.youtube.com/@interior_recipe",
  kakao: "https://pf.kakao.com/_xjLaTn",
};

export const NAV_LINKS = [
  { href: "/#problem", label: "문제" },
  { href: "/#solution", label: "솔루션" },
  { href: "/#process", label: "프로세스" },
  { href: "/#before-after", label: "사례" },
  { href: "/#brand", label: "브랜드" },
];
