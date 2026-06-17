import Image from "next/image";

export default function HeroTunnel() {
  return (
    <div className="hero-tunnel" aria-hidden="true">
      <Image
        src="/images/ibm-tunnel-desktop.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-tunnel-desktop"
      />
      <Image
        src="/images/ibm-tunnel-mobile.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-tunnel-mobile"
      />
    </div>
  );
}