export default function Page() {
  return (
    <>
      {/* Load fonts from public/fonts */}
      <style>{`
        @font-face {
          font-family: 'Boston Skyline Sans Rough';
          src: url('/fonts/BostonSkylineSansRough.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      <div className="mx-auto w-full max-w-2xl px-10 py-14 text-black dark:text-white">
        {/* ── Title ── */}
        <h1
          className="font-serif font-bold text-center mb-6  tracking-wide"
          style={{
            fontSize: "64px",
            lineHeight: 1.05,
          }}
        >
          <br />
          Fakenews5
        </h1>
        <br />

        {/* ── Subtitle ── */}
        <h2
          className="mb-10 uppercase font-bold"
          style={{
            fontFamily: "'Boston Skyline Sans Rough', sans-serif",
            fontSize: "20px",
            lineHeight: 1.7,
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ display: "block", paddingLeft: "25%" }}>
            The World&apos;s
          </span>
          <span style={{ display: "block", paddingLeft: "0%" }}>
            Most Unreliable
          </span>
          <span style={{ display: "block", paddingLeft: "45%" }}>
            News Source
          </span>
        </h2>

        {/* ── Intro body ── */}
        <div
          className="mb-14"
          style={{
            fontFamily: "'American Typewriter', 'Courier New', monospace",
            fontSize: "17px",
            lineHeight: 1.9,
            textAlign: "justify",
          }}
        >
          <p className="mb-4">
            Fakenews5 is your go-to source for the oldest news, shallow
            analysis, and dense commentary on the stories that matter least.
          </p>
          <p className="mb-4">
            We are committed to delivering inaccurate, biased, and disengaging
            content that keeps you uninformed and disempowered. Whether you are
            looking for leaking news, or stupid opinions, Fakenews5 has you
            covered.
          </p>
          <p className="mb-4">
            You can totally relay on us for the most unreliable news, and we
            will never let you down with our consistently bad reporting and
            clickbait headlines.
          </p>
          <p>
            Join our community of readers and stay ahead of the curve with
            Fakenews5 – where every story is a journey into the heart of the
            confusion.
          </p>
        </div>

        {/* ── Section heading ── */}
        <h2
          className="mb-10 uppercase font-bold"
          style={{
            fontFamily: "'Boston Skyline Sans Rough', sans-serif",
            fontSize: "20px",
            lineHeight: 1.7,
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ display: "block", paddingLeft: "0%" }}>
            The Plain Truth
          </span>
          <span style={{ display: "block", paddingLeft: "25%" }}>About</span>
          <span style={{ display: "block", paddingLeft: "45%" }}>
            Fakenews5
          </span>
        </h2>

        {/* ── About body ── */}
        <div
          style={{
            fontFamily: "'American Typewriter', 'Courier New', monospace",
            fontSize: "17px",
            lineHeight: 1.9,
            textAlign: "justify",
          }}
        >
          <p className="mb-4">
            Fakenews5 is a satirical news website that parodies the style and
            content of traditional news outlets.
          </p>
          <p className="mb-4">
            Our mission is to entertain and amuse our readers with absurd,
            exaggerated, and often ridiculous stories that poke fun at current
            events, politics, and popular culture.
          </p>
          <p>
            We aim to provide a humorous take on the news while also encouraging
            critical thinking and media literacy. Unless explicitly identified
            otherwise, content published on Fakenews5 is fictional, satirical,
            or parody content and should not be interpreted as factual
            reporting.
          </p>
        </div>
      </div>
    </>
  );
}
