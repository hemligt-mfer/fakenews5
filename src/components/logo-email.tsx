
export default function LogoEmail() {
  return (
    <span className="flex items-center p-2 justify-start">
          <div className="my-auto w-full max-w-160 pt-2">
            <div className="flex items-center gap-3 -mb-3">
              <div className="flex-1 h-px bg-black"></div>
              <span className="font-serif font-bold text-lg tracking-widest">
                THE
              </span>
              <div className="flex-1 h-px bg-black"></div>
            </div>
            <span className="block text-center  whitespace-nowrap font-serif font-bold text-5xl leading-tight tracking-tight -mb-1">
              Daily Commit
            </span>
            <div className="border-b-4 border-primary mt-1"></div>
            <p className="text-center text-xs tracking-wide mt-2">
              YOUR DAILY DOSE OF NEWS.{" "}
              <span className="text-primary font-bold">COMMITTED</span> TO THE
              TRUTH.
            </p>
          </div>
    </span>
  );
}