import { SITE_URL } from '@/lib/site'
import MathClient from './MathClient'

export const metadata = {
  title: 'Matemáticas Mayas — Sistema Vigesimal y Numeración de Puntos y Barras',
  description: 'El sistema numérico maya en base 20 (vigesimal): puntos, barras y el símbolo del cero. Convierte números decimales al sistema de numeración de los antiguos mayas.',
  alternates: { canonical: '/math' },
  openGraph: { url: `${SITE_URL}/math` },
}

export default function MathPage() {
  return (
    <>
      <article className="px-4 pt-6 pb-2 md:px-6 max-w-2xl mx-auto">
        <h2 className="text-base font-bold text-maya-text mb-2">Matemáticas Mayas: el Sistema Vigesimal</h2>
        <p className="text-sm text-maya-muted leading-relaxed">
          Los mayas desarrollaron un sistema de numeración posicional en base 20 (vigesimal), uno de los más sofisticados de la antigüedad. Utiliza solo tres símbolos: un punto para las unidades (1), una barra para los cincos (5) y un glifo con forma de concha o cero para el valor nulo. El sistema es posicional y vertical: las posiciones se leen de abajo hacia arriba, multiplicando cada nivel por potencias de 20 (1, 20, 400, 8.000…). Excepcionalmente, la tercera posición vale 360 en lugar de 400 en el contexto calendárico, facilitando el registro de años de 360 días. El concepto del cero — representado gráficamente como concha o flor — fue desarrollado por los mayas de forma independiente, siglos antes de su uso en Europa. Según Lounsbury (1978), este sistema fue fundamental para la astronomía computacional maya, permitiendo predicciones de eclipses y ciclos venusinos con notable precisión.
        </p>
      </article>
      <MathClient />
    </>
  )
}
