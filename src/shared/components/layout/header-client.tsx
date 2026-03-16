'use client'

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'
import Link from 'next/link'
import Logo from '@/shared/components/logo'
import ThemeToggle from '@/shared/components/theme/theme-toggle'
import LanguageSwitcher from '@/shared/components/language-switcher'

interface Props {
	loginLabel: string
	currentLocale: string
	langSelectLabel: string
	langLoadingMessage: string
}

const HeaderClient = ({ loginLabel, currentLocale, langSelectLabel, langLoadingMessage }: Props) => {
	return (
		<Navbar maxWidth="full" isBlurred className="bg-background/75">
			<NavbarBrand>
				<Logo />
			</NavbarBrand>
			<NavbarContent justify="end">
				<NavbarItem>
					<Link href="/login">{loginLabel}</Link>
				</NavbarItem>
				<NavbarItem>
					<LanguageSwitcher
						currentLocale={currentLocale}
						selectLabel={langSelectLabel}
						loadingMessage={langLoadingMessage}
					/>
				</NavbarItem>
				<NavbarItem>
					<ThemeToggle />
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	)
}

export default HeaderClient
