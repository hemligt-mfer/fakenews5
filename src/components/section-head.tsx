export default function SectionHead({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-3 my-6">
            <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] whitespace-nowrap text-foreground">
                {title}
            </h2>
            <div className="flex-1 border-t border-[#c8a84b]" />
        </div>
    );
}
