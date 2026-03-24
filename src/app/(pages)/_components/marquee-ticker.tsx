'use client'

const items = [
	'QR Dinámicos',
	'Analytics en tiempo real',
	'Personalización total',
	'Sin límite de escaneos',
	'Exportación SVG y PNG',
	'Redirección condicional',
	'Gestión de equipo',
	'API REST',
	'Webhooks',
	'Protección con contraseña',
	'Fecha de expiración',
	'Carpetas y organización',
]

export function MarqueeTicker() {
	return (
		<>
			<style>{`
        @keyframes ticker {
          from { transform: translateX(0) }
          to { transform: translateX(-50%) }
        }
      `}</style>
			<div className="overflow-hidden border-t border-b border-divider py-4 select-none">
				<div
					className="flex w-max"
					style={{ animation: 'ticker 30s linear infinite' }}
				>
					{[...items, ...items].map((item, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: decorative duplicate list
							key={i}
							className="flex items-center gap-6 px-6"
						>
							<span className="text-xs font-semibold text-default-400 uppercase tracking-widest whitespace-nowrap">
								{item}
							</span>
							<span className="w-1 h-1 rounded-full bg-primary/40 shrink-0" />
						</div>
					))}
				</div>
			</div>
		</>
	)
}
