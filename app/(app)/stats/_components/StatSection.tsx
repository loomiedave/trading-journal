export default function StatSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="text-[15px] tracking-[0.2em] text-muted-foreground mt-5 mb-[10px]">
        {title}
      </div>
      {children}
    </>
  );
}
