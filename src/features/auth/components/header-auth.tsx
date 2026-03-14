'use client'
import { Navbar, NavbarBrand, NavbarContent } from '@heroui/react'
import Logo from '@/shared/components/logo'
import ThemeToggle from '@/shared/components/theme/theme-toggle'

const HeaderAuth = () => {
	return (
		<Navbar maxWidth="full" isBlurred={false}>
			<NavbarBrand>
				<Logo />
			</NavbarBrand>
			<NavbarContent justify="end">
				<ThemeToggle />
			</NavbarContent>
		</Navbar>
	)
}

export default HeaderAuth
