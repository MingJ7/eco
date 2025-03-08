import { checkAdmin } from "../Components/Auth/AdminControl";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await checkAdmin()
  return children;
}
