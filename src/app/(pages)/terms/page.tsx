import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'

export const metadata: Metadata = {
	title: 'Terms of Service | QR Generator',
	description: 'Terms and conditions for using QR Generator.',
	robots: { index: true, follow: true },
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
	<section className="mb-10">
		<h2 className="text-xl font-semibold mb-3">{title}</h2>
		<div className="text-default-600 space-y-3 leading-relaxed">{children}</div>
	</section>
)

const content = {
	en: {
		title: 'Terms of Service',
		lastUpdated: 'Last updated: March 19, 2026',
		sections: [
			{
				title: '1. Acceptance of Terms',
				body: 'By accessing or using QR Generator ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.',
			},
			{
				title: '2. Description of Service',
				body: 'QR Generator is a SaaS platform that allows users to create, customize, and track dynamic QR codes. The Service is offered in three plans: Free, Pro, and Business, each with different limits and features.',
			},
			{
				title: '3. User Accounts',
				intro: 'To access the features of the Service, you must register and create an account. You are responsible for:',
				list: [
					'Maintaining the confidentiality of your access credentials.',
					'All activity that occurs under your account.',
					'Notifying us immediately of any unauthorized use.',
				],
				footer: 'We reserve the right to cancel accounts that violate these terms or show fraudulent activity.',
			},
			{
				title: '4. Plans and Billing',
				intro: 'The Free plan is available at no cost. Pro and Business plans are paid, available monthly or annually. When subscribing to a paid plan:',
				list: [
					'Payments are processed through Lemon Squeezy.',
					'Subscriptions renew automatically at the end of each period.',
					'You may cancel at any time from the billing portal.',
					'No refunds are offered for partial periods, unless required by law.',
				],
			},
			{
				title: '5. Usage Limits',
				body: 'Each plan has specific limits (number of QR codes, scans per month, etc.). Exceeding your plan limits may result in service interruption until you upgrade your subscription or the next billing period begins.',
			},
			{
				title: '6. Acceptable Use',
				intro: 'By using the Service, you agree NOT to:',
				list: [
					'Create QR codes pointing to illegal, malicious, or deceptive content.',
					'Use the Service to distribute spam, malware, or phishing.',
					'Attempt unauthorized access to systems or data of other users.',
					'Resell or redistribute the Service without express authorization.',
					'Reverse engineer or attempt to extract the source code.',
				],
				footer: 'We reserve the right to suspend or cancel accounts that violate this policy without prior notice.',
			},
			{
				title: '7. Intellectual Property',
				body: 'The Service and its original content (excluding content provided by users) are and will remain the exclusive property of QR Generator and its licensors. Your QR codes and analytics data are your property.',
			},
			{
				title: '8. Privacy and Scan Data',
				body: 'The Service collects scan data from QR codes (IP address, device, operating system, browser, approximate geographic location) to provide analytics to QR code owners.',
				linkText: 'Privacy Policy',
				linkHref: '/privacy',
				linkSuffix: 'for more details.',
			},
			{
				title: '9. Service Availability',
				body: 'We strive to keep the Service continuously available, but we do not guarantee 100% uptime. We may temporarily interrupt the Service for maintenance, updates, or force majeure.',
			},
			{
				title: '10. Limitation of Liability',
				body: 'To the maximum extent permitted by applicable law, QR Generator shall not be liable for indirect, incidental, special, or consequential damages resulting from the use or inability to use the Service.',
			},
			{
				title: '11. Modifications',
				body: 'We reserve the right to modify these terms at any time. We will notify you of material changes by email or through a prominent notice on the Service. Continued use of the Service after such changes constitutes your acceptance of the new terms.',
			},
			{
				title: '12. Governing Law',
				body: 'These terms are governed by applicable laws. Any dispute will be resolved through arbitration or in the competent courts of the jurisdiction of the Service provider.',
			},
			{
				title: '13. Contact',
				body: 'If you have questions about these Terms of Service, contact us at',
				email: 'support@qrgenerator.app',
			},
		],
		footer: { privacy: 'Privacy Policy', home: 'Back to home' },
	},
	es: {
		title: 'Términos de Servicio',
		lastUpdated: 'Última actualización: 19 de marzo de 2026',
		sections: [
			{
				title: '1. Aceptación de los términos',
				body: 'Al acceder o utilizar QR Generator ("el Servicio"), aceptas quedar vinculado por estos Términos de Servicio. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al Servicio.',
			},
			{
				title: '2. Descripción del servicio',
				body: 'QR Generator es una plataforma SaaS que permite a los usuarios crear, personalizar y rastrear códigos QR dinámicos. El Servicio se ofrece en tres planes: Free, Pro y Business, cada uno con diferentes límites y funcionalidades.',
			},
			{
				title: '3. Cuentas de usuario',
				intro: 'Para acceder a las funcionalidades del Servicio, debes registrarte y crear una cuenta. Eres responsable de:',
				list: [
					'Mantener la confidencialidad de tus credenciales de acceso.',
					'Toda la actividad que ocurra bajo tu cuenta.',
					'Notificarnos de inmediato ante cualquier uso no autorizado.',
				],
				footer: 'Nos reservamos el derecho de cancelar cuentas que violen estos términos o que presenten actividad fraudulenta.',
			},
			{
				title: '4. Planes y facturación',
				intro: 'El plan Free está disponible sin costo. Los planes Pro y Business son de pago, disponibles en modalidad mensual o anual. Al suscribirte a un plan de pago:',
				list: [
					'Los pagos se procesan a través de Lemon Squeezy.',
					'Las suscripciones se renuevan automáticamente al final de cada período.',
					'Puedes cancelar en cualquier momento desde el portal de facturación.',
					'No se ofrecen reembolsos por períodos parciales, salvo que la ley lo requiera.',
				],
			},
			{
				title: '5. Límites de uso',
				body: 'Cada plan tiene límites específicos (número de QR codes, escaneos por mes, etc.). Superar los límites de tu plan puede resultar en la interrupción del servicio hasta que actualices tu suscripción o comience el siguiente período de facturación.',
			},
			{
				title: '6. Uso aceptable',
				intro: 'Al utilizar el Servicio, te comprometes a NO:',
				list: [
					'Crear QR codes que apunten a contenido ilegal, malicioso o engañoso.',
					'Usar el Servicio para distribuir spam, malware o phishing.',
					'Intentar acceder de forma no autorizada a sistemas o datos de otros usuarios.',
					'Revender o redistribuir el Servicio sin autorización expresa.',
					'Realizar ingeniería inversa o intentar extraer el código fuente.',
				],
				footer: 'Nos reservamos el derecho de suspender o cancelar cuentas que violen esta política sin previo aviso.',
			},
			{
				title: '7. Propiedad intelectual',
				body: 'El Servicio y su contenido original (excluyendo el contenido proporcionado por los usuarios) son y seguirán siendo propiedad exclusiva de QR Generator y sus licenciantes. Tus QR codes y datos analíticos son de tu propiedad.',
			},
			{
				title: '8. Privacidad y datos de escaneo',
				body: 'El Servicio recopila datos de escaneo de los códigos QR (dirección IP, dispositivo, sistema operativo, navegador, ubicación geográfica aproximada) para proporcionar analítica a los propietarios de los QR codes.',
				linkText: 'Política de Privacidad',
				linkHref: '/privacy',
				linkSuffix: 'para más detalles.',
			},
			{
				title: '9. Disponibilidad del servicio',
				body: 'Nos esforzamos por mantener el Servicio disponible de forma continua, pero no garantizamos una disponibilidad del 100%. Podemos interrumpir el Servicio temporalmente por mantenimiento, actualizaciones o causas de fuerza mayor.',
			},
			{
				title: '10. Limitación de responsabilidad',
				body: 'En la máxima medida permitida por la ley aplicable, QR Generator no será responsable por daños indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar el Servicio.',
			},
			{
				title: '11. Modificaciones',
				body: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Notificaremos cambios materiales por correo electrónico o mediante un aviso prominente en el Servicio. El uso continuado del Servicio después de dichos cambios constituye tu aceptación de los nuevos términos.',
			},
			{
				title: '12. Ley aplicable',
				body: 'Estos términos se rigen por las leyes aplicables. Cualquier disputa será resuelta mediante arbitraje o en los tribunales competentes de la jurisdicción del proveedor del Servicio.',
			},
			{
				title: '13. Contacto',
				body: 'Si tienes preguntas sobre estos Términos de Servicio, contáctanos en',
				email: 'support@qrgenerator.app',
			},
		],
		footer: { privacy: 'Política de Privacidad', home: 'Volver al inicio' },
	},
}

const TermsPage = async () => {
	const locale = await getLocale()
	const c = locale === 'en' ? content.en : content.es

	return (
		<div className="max-w-3xl mx-auto py-16 px-4">
			<h1 className="text-3xl font-bold mb-2">{c.title}</h1>
			<p className="text-default-500 text-sm mb-12">{c.lastUpdated}</p>

			{c.sections.map((s) => (
				<Section key={s.title} title={s.title}>
					{'intro' in s && s.intro && <p>{s.intro}</p>}
					{'body' in s && s.body && !('linkText' in s) && <p>{s.body}</p>}
					{'linkText' in s && s.linkText && (
						<p>
							{s.body}{' '}
							<Link href={s.linkHref ?? '/privacy'} className="text-primary underline">
								{s.linkText}
							</Link>{' '}
							{s.linkSuffix}
						</p>
					)}
					{'list' in s && s.list && (
						<ul className="list-disc pl-6 space-y-1">
							{s.list.map((item) => <li key={item}>{item}</li>)}
						</ul>
					)}
					{'footer' in s && s.footer && <p>{s.footer}</p>}
					{'email' in s && s.email && (
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
				<Link href="/privacy" className="hover:text-default-600 transition-colors">
					{c.footer.privacy}
				</Link>
				<Link href="/" className="hover:text-default-600 transition-colors">
					{c.footer.home}
				</Link>
			</div>
		</div>
	)
}

export default TermsPage
