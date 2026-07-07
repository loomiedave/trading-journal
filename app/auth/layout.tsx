export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-[#0e1015] min-h-screen">{children}</div>;
}
