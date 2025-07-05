'use client'

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'
import Link from 'next/link'
import Logo from './logo'
import ThemeToggle from './theme/theme-toggle'

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
