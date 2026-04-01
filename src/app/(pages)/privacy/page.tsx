import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'

export const metadata: Metadata = {
	title: 'Privacy Policy | QR Generator',
	description: 'How we collect, use, and protect your data at QR Generator.',
	robots: { index: true, follow: true },
}

const Section = ({
	title,
	children,
}: {
	title: string
	children: React.ReactNode
}) => (
	<section className="mb-10">
		<h2 className="text-xl font-semibold mb-3">{title}</h2>
		<div className="text-default-600 space-y-3 leading-relaxed">{children}</div>
	</section>
)

const content = {
	en: {
		title: 'Privacy Policy',
		lastUpdated: 'Last updated: March 19, 2026',
		sections: [
			{
				title: '1. Information We Collect',
				groups: [
					{
						label: 'Account information:',
						items: [
							'Name and email address when you register.',
							'Profile photo (optional).',
							'Billing information managed by Lemon Squeezy (we never store card data).',
						],
					},
					{
						label: 'QR code scan data:',
						items: [
							"Visitor's IP address (used for approximate geolocation).",
							'Country, region, and city of the scan origin.',
							'Device type, operating system, and browser.',
							'Date and time of the scan.',
							'Whether the scan is unique (same IP in the last 24 hours).',
						],
					},
					{
						label: 'Usage data:',
						items: ['General activity logs to maintain service security.'],
					},
				],
			},
			{
				title: '2. How We Use Your Information',
				intro: 'We use the collected information to:',
				list: [
					'Provide, maintain, and improve the Service.',
					'Show you analytics about your QR codes.',
					'Manage your subscription and process payments.',
					'Send you service-related communications (important changes, invoices).',
					'Detect and prevent fraud or abusive use.',
				],
				footer:
					'We do not sell or rent your personal information to third parties.',
			},
			{
				title: '3. Data Retention',
				body: 'We retain your data while your account is active. If you cancel your account, we will delete your personal data within 30 days of the request, unless the law requires us to retain it longer. Scan data associated with your QR codes is deleted along with your account.',
			},
			{
				title: '4. Third-Party Services',
				intro: 'The Service uses the following external providers:',
				providers: [
					{
						name: 'Supabase',
						desc: 'database and authentication. Data is stored on Supabase servers (AWS).',
					},
					{
						name: 'Lemon Squeezy',
						desc: 'payment and subscription processing.',
						link: 'https://www.lemonsqueezy.com/privacy',
						linkText: 'privacy policy',
					},
					{
						name: 'IPInfo',
						desc: 'IP geolocation for scan analytics. Only the IP address is sent; no personal user data is transmitted.',
					},
				],
			},
			{
				title: '5. Security',
				intro:
					'We implement technical and organizational security measures to protect your information, including:',
				list: [
					'Encrypted data transmission via TLS/HTTPS.',
					'Row Level Security (RLS) in the database — each user can only access their own data.',
					'API keys stored as bcrypt hashes (never in plain text).',
					'Authentication managed by Supabase Auth with JWT tokens.',
				],
				footer:
					'However, no system is 100% secure. We recommend using strong passwords and not sharing your credentials.',
			},
			{
				title: '6. Cookies',
				body: 'The Service uses session cookies to keep you authenticated and a language preference cookie (NEXT_LOCALE). We do not use advertising tracking cookies.',
			},
			{
				title: '7. Your Rights',
				intro: 'You have the right to:',
				list: [
					'Access the personal data we hold about you.',
					'Correct inaccurate data from your profile in the dashboard.',
					'Request deletion of your account and all your data.',
					'Export your analytics data in CSV format.',
				],
				email: 'support@qrgenerator.app',
				emailPrefix: 'To exercise any of these rights, contact us at',
			},
			{
				title: '8. Minors',
				body: 'The Service is not directed to children under 16. We do not knowingly collect information from minors. If you believe a minor has provided us with personal data, contact us to have it deleted.',
			},
			{
				title: '9. Changes to This Policy',
				body: 'We may update this Privacy Policy periodically. We will notify you of material changes by email or through a notice on the Service. Continued use of the Service after changes implies acceptance of the new policy.',
			},
			{
				title: '10. Contact',
				body: 'If you have questions or concerns about this Privacy Policy, write to us at',
				email: 'support@qrgenerator.app',
			},
		],
		footer: { terms: 'Terms of Service', home: 'Back to home' },
	},
	es: {
		title: 'Política de Privacidad',
		lastUpdated: 'Última actualización: 19 de marzo de 2026',
		sections: [
			{
				title: '1. Información que recopilamos',
				groups: [
					{
						label: 'Información de cuenta:',
						items: [
							'Nombre y dirección de correo electrónico al registrarte.',
							'Foto de perfil (opcional).',
							'Información de facturación gestionada por Lemon Squeezy (nunca almacenamos datos de tarjetas).',
						],
					},
					{
						label: 'Datos de escaneo de QR codes:',
						items: [
							'Dirección IP del visitante (usada para geolocalización aproximada).',
							'País, región y ciudad de origen del escaneo.',
							'Tipo de dispositivo, sistema operativo y navegador.',
							'Fecha y hora del escaneo.',
							'Si el escaneo es único (mismo IP en las últimas 24 horas).',
						],
					},
					{
						label: 'Datos de uso:',
						items: [
							'Registro de actividad general para mantener la seguridad del servicio.',
						],
					},
				],
			},
			{
				title: '2. Cómo usamos tu información',
				intro: 'Utilizamos la información recopilada para:',
				list: [
					'Proveer, mantener y mejorar el Servicio.',
					'Mostrarte analítica sobre tus QR codes.',
					'Gestionar tu suscripción y procesar pagos.',
					'Enviarte comunicaciones relacionadas con el Servicio (cambios importantes, facturas).',
					'Detectar y prevenir fraudes o uso abusivo.',
				],
				footer: 'No vendemos ni alquilamos tu información personal a terceros.',
			},
			{
				title: '3. Retención de datos',
				body: 'Conservamos tus datos mientras tu cuenta esté activa. Si cancelas tu cuenta, eliminaremos tus datos personales dentro de los 30 días siguientes a la solicitud, salvo que la ley nos obligue a conservarlos por más tiempo. Los datos de escaneo asociados a tus QR codes se eliminan junto con tu cuenta.',
			},
			{
				title: '4. Servicios de terceros',
				intro: 'El Servicio utiliza los siguientes proveedores externos:',
				providers: [
					{
						name: 'Supabase',
						desc: 'base de datos y autenticación. Los datos se almacenan en servidores de Supabase (AWS).',
					},
					{
						name: 'Lemon Squeezy',
						desc: 'procesamiento de pagos y suscripciones.',
						link: 'https://www.lemonsqueezy.com/privacy',
						linkText: 'política de privacidad',
					},
					{
						name: 'IPInfo',
						desc: 'geolocalización de IPs para analítica de escaneos. Solo se envía la dirección IP; no se envían datos personales del usuario.',
					},
				],
			},
			{
				title: '5. Seguridad',
				intro:
					'Implementamos medidas de seguridad técnicas y organizativas para proteger tu información, incluyendo:',
				list: [
					'Transmisión de datos cifrada mediante TLS/HTTPS.',
					'Row Level Security (RLS) en la base de datos — cada usuario solo puede acceder a sus propios datos.',
					'API keys almacenadas como hashes bcrypt (nunca en texto plano).',
					'Autenticación gestionada por Supabase Auth con tokens JWT.',
				],
				footer:
					'Sin embargo, ningún sistema es 100% seguro. Te recomendamos usar contraseñas seguras y no compartir tus credenciales.',
			},
			{
				title: '6. Cookies',
				body: 'El Servicio utiliza cookies de sesión para mantenerte autenticado y una cookie de preferencia de idioma (NEXT_LOCALE). No utilizamos cookies de rastreo publicitario.',
			},
			{
				title: '7. Tus derechos',
				intro: 'Tienes derecho a:',
				list: [
					'Acceder a los datos personales que tenemos sobre ti.',
					'Corregir datos inexactos desde tu perfil en el dashboard.',
					'Solicitar la eliminación de tu cuenta y todos tus datos.',
					'Exportar tus datos de analítica en formato CSV.',
				],
				email: 'support@qrgenerator.app',
				emailPrefix:
					'Para ejercer cualquiera de estos derechos, contáctanos en',
			},
			{
				title: '8. Menores de edad',
				body: 'El Servicio no está dirigido a menores de 16 años. No recopilamos conscientemente información de menores. Si crees que un menor nos ha proporcionado datos personales, contáctanos para eliminarlos.',
			},
			{
				title: '9. Cambios a esta política',
				body: 'Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos sobre cambios materiales por correo electrónico o mediante un aviso en el Servicio. El uso continuado del Servicio tras los cambios implica la aceptación de la nueva política.',
			},
			{
				title: '10. Contacto',
				body: 'Si tienes preguntas o inquietudes sobre esta Política de Privacidad, escríbenos a',
				email: 'support@qrgenerator.app',
			},
		],
		footer: { terms: 'Términos de Servicio', home: 'Volver al inicio' },
	},
}

const PrivacyPage = async () => {
	const locale = await getLocale()
	const c = locale === 'en' ? content.en : content.es

	return (
		<div className="max-w-3xl mx-auto py-16 px-4">
			<h1 className="text-3xl font-bold mb-2">{c.title}</h1>
			<p className="text-default-500 text-sm mb-12">{c.lastUpdated}</p>

			{c.sections.map((s) => (
				<Section key={s.title} title={s.title}>
					{'intro' in s && s.intro && <p>{s.intro}</p>}
					{'groups' in s &&
						s.groups &&
						s.groups.map((g) => (
							<div key={g.label}>
								<p className="font-medium mt-2">{g.label}</p>
								<ul className="list-disc pl-6 space-y-1">
									{g.items.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</div>
						))}
					{'providers' in s && s.providers && (
						<ul className="list-disc pl-6 space-y-1">
							{s.providers.map((p) => (
								<li key={p.name}>
									<strong>{p.name}</strong> — {p.desc}
									{'link' in p && p.link && (
										<>
											{' '}
											<a
												href={p.link}
												target="_blank"
												rel="noopener noreferrer"
												className="text-primary underline"
											>
												{p.linkText}
											</a>
										</>
									)}
								</li>
							))}
						</ul>
					)}
					{'list' in s && s.list && (
						<ul className="list-disc pl-6 space-y-1">
							{s.list.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					)}
					{'body' in s && s.body && !('email' in s) && <p>{s.body}</p>}
					{'footer' in s && s.footer && <p>{s.footer}</p>}
					{'email' in s && s.email && 'emailPrefix' in s && (
						<p>
							{s.emailPrefix}{' '}
							<a href={`mailto:${s.email}`} className="text-primary underline">
								{s.email}
							</a>
							.
						</p>
					)}
					{'email' in s && s.email && !('emailPrefix' in s) && (
						<p>
							{s.body}{' '}
							<a href={`mailto:${s.email}`} className="text-primary underline">
								{s.email}
							</a>
							.
						</p>
					)}
				</Section>
			))}

			<div className="border-t border-default-200 pt-8 mt-8 text-sm text-default-400 flex gap-6">
				<Link
					href="/terms"
					className="hover:text-default-600 transition-colors"
				>
					{c.footer.terms}
				</Link>
				<Link href="/" className="hover:text-default-600 transition-colors">
					{c.footer.home}
				</Link>
			</div>
		</div>
	)
}

export default PrivacyPage
