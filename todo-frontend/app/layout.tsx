import "@/styles/globals.css";
import { Metadata } from "next";
import { Providers } from "./providers";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

export const metadata: Metadata = {
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className="min-h-screen bg-background ">
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<div className="relative flex flex-col h-screen ">
						<main className="flex pt-16 px-6 justify-center w-full">
							{children}
						</main>

					</div>
				</Providers>
			</body>
		</html>
	);
}
