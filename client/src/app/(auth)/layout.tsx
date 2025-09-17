import Image from "next/image";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container flex flex-col max-w-7xl justify-center items-center min-h-screen">
      <Link href="/">
        <img src="/images/logo.png" alt="Logo" className="h-12 w-auto" />
      </Link>
      {children}
    </main>
  );
}
