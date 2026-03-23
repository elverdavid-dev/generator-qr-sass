import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Política de Privacidad | QR Generator',
	description: 'Cómo recopilamos, usamos y protegemos tus datos en QR Generator.',
	robots: { index: true, follow: true },
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
	<section className="mb-10">
		<h2 className="text-xl font-semibold mb-3">{title}</h2>
		<div className="text-default-600 space-y-3 leading-relaxed">{children}</div>
	</section>
)

const PrivacyPage = () => {
	const lastUpdated = '19 de marzo de 2026'

	return (
		<div className="max-w-3xl mx-auto py-16 px-4">
			<h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
			<p className="text-default-500 text-sm mb-12">Última actualización: {lastUpdated}</p>

			<Section title="1. Información que recopilamos">
				<p>Recopilamos los siguientes tipos de información:</p>
				<p className="font-medium mt-2">Información de cuenta:</p>
				<ul className="list-disc pl-6 space-y-1">
					<li>Nombre, apellido y dirección de correo electrónico al registrarte.</li>
					<li>Foto de perfil (opcional).</li>
					<li>Información de facturación gestionada por Lemon Squeezy (nunca almacenamos datos de tarjetas).</li>
				</ul>
				<p className="font-medium mt-2">Datos de escaneo de QR codes:</p>
				<ul className="list-disc pl-6 space-y-1">
					<li>Dirección IP del visitante (usada para geolocalización aproximada).</li>
					<li>País, región y ciudad de origen del escaneo.</li>
					<li>Tipo de dispositivo, sistema operativo y navegador.</li>
					<li>Fecha y hora del escaneo.</li>
					<li>Si el escaneo es único (mismo IP en las últimas 24 horas).</li>
				</ul>
				<p className="font-medium mt-2">Datos de uso:</p>
				<ul className="list-disc pl-6 space-y-1">
					<li>Registro de actividad general para mantener la seguridad del servicio.</li>
				</ul>
			</Section>

			<Section title="2. Cómo usamos tu información">
				<p>Utilizamos la información recopilada para:</p>
				<ul className="list-disc pl-6 space-y-1">
					<li>Proveer, mantener y mejorar el Servicio.</li>
					<li>Mostrarte analítica sobre tus QR codes.</li>
					<li>Gestionar tu suscripción y procesar pagos.</li>
					<li>Enviarte comunicaciones relacionadas con el Servicio (cambios importantes, facturas).</li>
					<li>Detectar y prevenir fraudes o uso abusivo.</li>
				</ul>
				<p>
					No vendemos ni alquilamos tu información personal a terceros.
				</p>
			</Section>

			<Section title="3. Retención de datos">
				<p>
					Conservamos tus datos mientras tu cuenta esté activa. Si cancelas tu cuenta,
					eliminaremos tus datos personales dentro de los 30 días siguientes a la solicitud,
					salvo que la ley nos obligue a conservarlos por más tiempo.
				</p>
				<p>
					Los datos de escaneo asociados a tus QR codes se eliminan junto con tu cuenta.
				</p>
			</Section>

			<Section title="4. Servicios de terceros">
				<p>El Servicio utiliza los siguientes proveedores externos:</p>
				<ul className="list-disc pl-6 space-y-1">
					<li>
						<strong>Supabase</strong> — base de datos y autenticación. Los datos se almacenan
						en servidores de Supabase (AWS).
					</li>
					<li>
						<strong>Lemon Squeezy</strong> — procesamiento de pagos y suscripciones. Consulta
						su{' '}
						<a
							href="https://www.lemonsqueezy.com/privacy"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary underline"
						>
							política de privacidad
						</a>
						.
					</li>
					<li>
						<strong>IPInfo</strong> — geolocalización de IPs para analítica de escaneos. Solo
						se envía la dirección IP; no se envían datos personales del usuario.
					</li>
				</ul>
			</Section>

			<Section title="5. Seguridad">
				<p>
					Implementamos medidas de seguridad técnicas y organizativas para proteger tu
					información, incluyendo:
				</p>
				<ul className="list-disc pl-6 space-y-1">
					<li>Transmisión de datos cifrada mediante TLS/HTTPS.</li>
					<li>Row Level Security (RLS) en la base de datos — cada usuario solo puede acceder a sus propios datos.</li>
					<li>API keys almacenadas como hashes bcrypt (nunca en texto plano).</li>
					<li>Autenticación gestionada por Supabase Auth con tokens JWT.</li>
				</ul>
				<p>
					Sin embargo, ningún sistema es 100% seguro. Te recomendamos usar contraseñas seguras
					y no compartir tus credenciales.
				</p>
			</Section>

			<Section title="6. Cookies">
				<p>
					El Servicio utiliza cookies de sesión para mantenerte autenticado y una cookie de
					preferencia de idioma (<code className="text-xs bg-default-100 px-1 py-0.5 rounded">NEXT_LOCALE</code>).
					No utilizamos cookies de rastreo publicitario.
				</p>
			</Section>

			<Section title="7. Tus derechos">
				<p>Tienes derecho a:</p>
				<ul className="list-disc pl-6 space-y-1">
					<li>Acceder a los datos personales que tenemos sobre ti.</li>
					<li>Corregir datos inexactos desde tu perfil en el dashboard.</li>
					<li>Solicitar la eliminación de tu cuenta y todos tus datos.</li>
					<li>Exportar tus datos de analítica en formato CSV.</li>
				</ul>
				<p>
					Para ejercer cualquiera de estos derechos, contáctanos en{' '}
					<a href="mailto:support@qrgenerator.app" className="text-primary underline">
						support@qrgenerator.app
					</a>
					.
				</p>
			</Section>

			<Section title="8. Menores de edad">
				<p>
					El Servicio no está dirigido a menores de 16 años. No recopilamos conscientemente
					información de menores. Si crees que un menor nos ha proporcionado datos personales,
					contáctanos para eliminarlos.
				</p>
			</Section>

			<Section title="9. Cambios a esta política">
				<p>
					Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos
					sobre cambios materiales por correo electrónico o mediante un aviso en el Servicio.
					El uso continuado del Servicio tras los cambios implica la aceptación de la nueva
					política.
				</p>
			</Section>

			<Section title="10. Contacto">
				<p>
					Si tienes preguntas o inquietudes sobre esta Política de Privacidad, escríbenos a{' '}
					<a href="mailto:support@qrgenerator.app" className="text-primary underline">
						support@qrgenerator.app
					</a>
					.
				</p>
			</Section>

			<div className="border-t border-default-200 pt-8 mt-8 text-sm text-default-400 flex gap-6">
				<Link href="/terms" className="hover:text-default-600 transition-colors">
					Términos de Servicio
				</Link>
				<Link href="/" className="hover:text-default-600 transition-colors">
					Volver al inicio
				</Link>
			</div>
		</div>
	)
}

export default PrivacyPage
