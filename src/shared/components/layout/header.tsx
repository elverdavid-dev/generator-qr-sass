'use client'

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'
import Link from 'next/link'
import Logo from '@/shared/components/logo'
import ThemeToggle from '@/shared/components/theme/theme-toggle'

const Header = () => {
	return (
		<Navbar maxWidth="full" isBlurred className="bg-background/75">
			<NavbarBrand>
				<Logo />
			</NavbarBrand>
			<NavbarContent justify="end">
				<NavbarItem>
					<Link href="/login">Iniciar sesión</Link>
				</NavbarItem>
				<NavbarItem>
					<ThemeToggle />
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	)
}

export default Header
