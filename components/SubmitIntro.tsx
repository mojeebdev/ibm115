import Image from "next/image";

export default function SubmitIntro() {
  return (
    <div className="submit-intro">
      <div className="submit-intro-image">
        <Image
          src="/images/retro-pc-shell-desktop.jpg"
          alt="Vintage IBM PC with monitor, tower, keyboard, and mouse"
          width={640}
          height={480}
          sizes="(max-width: 900px) 100vw, 50vw"
          className="submit-intro-desktop"
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
        <Image
          src="/images/retro-pc-shell-mobile.jpg"
          alt="Vintage IBM PC with monitor, tower, keyboard, and mouse"
          width={640}
          height={480}
          sizes="100vw"
          className="submit-intro-mobile"
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      </div>
      <p className="submit-intro-caption">
        What machine brought you into the IBM family?
      </p>
    </div>
  );
}