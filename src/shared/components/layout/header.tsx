import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import Logo from '@/shared/components/logo'
import ThemeToggle from '@/shared/components/theme/theme-toggle'
import LanguageSwitcher from '@/shared/components/language-switcher'

const Header = async () => {
	const t = await getTranslations('nav')
	const locale = await getLocale()

	return (
		<Navbar maxWidth="full" isBlurred className="bg-background/75">
			<NavbarBrand>
				<Logo />
			</NavbarBrand>
			<NavbarContent justify="end">
				<NavbarItem>
					<Link href="/login">{t('login')}</Link>
				</NavbarItem>
				<NavbarItem>
					<LanguageSwitcher currentLocale={locale} />
				</NavbarItem>
				<NavbarItem>
					<ThemeToggle />
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	)
}

export default Header
