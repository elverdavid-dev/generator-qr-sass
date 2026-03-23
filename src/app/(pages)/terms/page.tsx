import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Términos de Servicio | QR Generator',
	description: 'Términos y condiciones de uso de QR Generator.',
	robots: { index: true, follow: true },
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
	<section className="mb-10">
		<h2 className="text-xl font-semibold mb-3">{title}</h2>
		<div className="text-default-600 space-y-3 leading-relaxed">{children}</div>
	</section>
)

const TermsPage = () => {
	const lastUpdated = '19 de marzo de 2026'

	return (
		<div className="max-w-3xl mx-auto py-16 px-4">
			<h1 className="text-3xl font-bold mb-2">Términos de Servicio</h1>
			<p className="text-default-500 text-sm mb-12">Última actualización: {lastUpdated}</p>

			<Section title="1. Aceptación de los términos">
				<p>
					Al acceder o utilizar QR Generator ("el Servicio"), aceptas quedar vinculado por
					estos Términos de Servicio. Si no estás de acuerdo con alguna parte de los términos,
					no podrás acceder al Servicio.
				</p>
			</Section>

			<Section title="2. Descripción del servicio">
				<p>
					QR Generator es una plataforma SaaS que permite a los usuarios crear, personalizar
					y rastrear códigos QR dinámicos. El Servicio se ofrece en tres planes: Free, Pro y
					Business, cada uno con diferentes límites y funcionalidades.
				</p>
			</Section>

			<Section title="3. Cuentas de usuario">
				<p>
					Para acceder a las funcionalidades del Servicio, debes registrarte y crear una
					cuenta. Eres responsable de:
				</p>
				<ul className="list-disc pl-6 space-y-1">
					<li>Mantener la confidencialidad de tus credenciales de acceso.</li>
					<li>Toda la actividad que ocurra bajo tu cuenta.</li>
					<li>Notificarnos de inmediato ante cualquier uso no autorizado.</li>
				</ul>
				<p>
					Nos reservamos el derecho de cancelar cuentas que violen estos términos o que
					presenten actividad fraudulenta.
				</p>
			</Section>

			<Section title="4. Planes y facturación">
				<p>
					El plan Free está disponible sin costo. Los planes Pro y Business son de pago,
					disponibles en modalidad mensual o anual. Al suscribirte a un plan de pago:
				</p>
				<ul className="list-disc pl-6 space-y-1">
					<li>Los pagos se procesan a través de Lemon Squeezy.</li>
					<li>Las suscripciones se renuevan automáticamente al final de cada período.</li>
					<li>Puedes cancelar en cualquier momento desde el portal de facturación.</li>
					<li>No se ofrecen reembolsos por períodos parciales, salvo que la ley lo requiera.</li>
				</ul>
			</Section>

			<Section title="5. Límites de uso">
				<p>
					Cada plan tiene límites específicos (número de QR codes, escaneos por mes, etc.).
					Superar los límites de tu plan puede resultar en la interrupción del servicio hasta
					que actualices tu suscripción o comience el siguiente período de facturación.
				</p>
			</Section>

			<Section title="6. Uso aceptable">
				<p>Al utilizar el Servicio, te comprometes a NO:</p>
				<ul className="list-disc pl-6 space-y-1">
					<li>Crear QR codes que apunten a contenido ilegal, malicioso o engañoso.</li>
					<li>Usar el Servicio para distribuir spam, malware o phishing.</li>
					<li>Intentar acceder de forma no autorizada a sistemas o datos de otros usuarios.</li>
					<li>Revender o redistribuir el Servicio sin autorización expresa.</li>
					<li>Realizar ingeniería inversa o intentar extraer el código fuente.</li>
				</ul>
				<p>
					Nos reservamos el derecho de suspender o cancelar cuentas que violen esta política
					sin previo aviso.
				</p>
			</Section>

			<Section title="7. Propiedad intelectual">
				<p>
					El Servicio y su contenido original (excluyendo el contenido proporcionado por los
					usuarios) son y seguirán siendo propiedad exclusiva de QR Generator y sus
					licenciantes. Tus QR codes y datos analíticos son de tu propiedad.
				</p>
			</Section>

			<Section title="8. Privacidad y datos de escaneo">
				<p>
					El Servicio recopila datos de escaneo de los códigos QR (dirección IP, dispositivo,
					sistema operativo, navegador, ubicación geográfica aproximada) para proporcionar
					analítica a los propietarios de los QR codes. Consulta nuestra{' '}
					<Link href="/privacy" className="text-primary underline">
						Política de Privacidad
					</Link>{' '}
					para más detalles.
				</p>
			</Section>

			<Section title="9. Disponibilidad del servicio">
				<p>
					Nos esforzamos por mantener el Servicio disponible de forma continua, pero no
					garantizamos una disponibilidad del 100%. Podemos interrumpir el Servicio
					temporalmente por mantenimiento, actualizaciones o causas de fuerza mayor.
				</p>
			</Section>

			<Section title="10. Limitación de responsabilidad">
				<p>
					En la máxima medida permitida por la ley aplicable, QR Generator no será
					responsable por daños indirectos, incidentales, especiales o consecuentes que
					resulten del uso o la imposibilidad de usar el Servicio.
				</p>
			</Section>

			<Section title="11. Modificaciones">
				<p>
					Nos reservamos el derecho de modificar estos términos en cualquier momento.
					Notificaremos cambios materiales por correo electrónico o mediante un aviso
					prominente en el Servicio. El uso continuado del Servicio después de dichos cambios
					constituye tu aceptación de los nuevos términos.
				</p>
			</Section>

			<Section title="12. Ley aplicable">
				<p>
					Estos términos se rigen por las leyes aplicables. Cualquier disputa será resuelta
					mediante arbitraje o en los tribunales competentes de la jurisdicción del proveedor
					del Servicio.
				</p>
			</Section>

			<Section title="13. Contacto">
				<p>
					Si tienes preguntas sobre estos Términos de Servicio, contáctanos en{' '}
					<a href="mailto:support@qrgenerator.app" className="text-primary underline">
						support@qrgenerator.app
					</a>
					.
				</p>
			</Section>

			<div className="border-t border-default-200 pt-8 mt-8 text-sm text-default-400 flex gap-6">
				<Link href="/privacy" className="hover:text-default-600 transition-colors">
					Política de Privacidad
				</Link>
				<Link href="/" className="hover:text-default-600 transition-colors">
					Volver al inicio
				</Link>
			</div>
		</div>
	)
}

export default TermsPage
