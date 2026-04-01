import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
	return (
		<Link href="/" className="flex items-center gap-2">
			<Image src="/logo.svg" alt="Logo" width={35} height={35} style={{ width: 35, height: 'auto' }} />
			<span className="text-xl font-bold hidden md:block">QR Generator</span>
		</Link>
	)
}

export default Logo
