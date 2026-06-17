import Image from "next/image";

export default function CgaHeroStrip() {
  return (
    <div className="cga-hero-strip" aria-hidden="true">
      <Image
        src="/images/ibm-pc-cga-desktop.jpg"
        alt=""
        fill
        sizes="100vw"
        className="cga-hero-strip-desktop"
      />
      <Image
        src="/images/ibm-pc-cga-mobile.jpg"
        alt=""
        fill
        sizes="100vw"
        className="cga-hero-strip-mobile"
      />
    </div>
  );
}