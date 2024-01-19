import type { Metadata } from 'next'
import './globals.css';
import { Providers } from "./providers";
import Navbar from '@/components/navbar';

export const metadata: Metadata = {
	title: 'beacon host',
	description: 'Generated by create next app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<Providers>
					<Navbar/>
					{children}
				</Providers>
			</body>
		</html>
	);
}