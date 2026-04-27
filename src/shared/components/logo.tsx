import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
	return (
		<Link href="/" className="flex items-center">
			{/* Mobile: solo el mark */}
			<Image
				src="/brand/crowii-mark.svg"
				alt="Crowii"
				width={28}
				height={28}
				className="block dark:hidden md:hidden"
				style={{ width: 28, height: 'auto' }}
			/>
			<Image
				src="/brand/crowii-mark-dark.svg"
				alt="Crowii"
				width={28}
				height={28}
				className="hidden dark:block md:dark:hidden"
				style={{ width: 28, height: 'auto' }}
			/>
			{/* Desktop: horizontal */}
			<Image
				src="/brand/crowii-horizontal.svg"
				alt="Crowii"
				width={130}
				height={44}
				className="hidden md:block md:dark:hidden"
				style={{ width: 130, height: 'auto' }}
			/>
			<Image
				src="/brand/crowii-horizontal-dark.svg"
				alt="Crowii"
				width={130}
				height={44}
				className="hidden md:dark:block"
				style={{ width: 130, height: 'auto' }}
			/>
		</Link>
	)
}

export default Logo
