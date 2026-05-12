import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const datos = [
  { nombre: 'Juan', nota: 4.5 },
  { nombre: 'María', nota: 3.8 },
  { nombre: 'Pedro', nota: 4.9 },
];

export default function SimpleBarChart() {
  return (
        <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        {/* El gráfico principal pasándole la data */}
        <BarChart data={datos}>
          
          {/* Ejes X y Y */}
          <XAxis dataKey="nombre" /> 
          <YAxis />
          
          {/* Tooltip: la cajita de información al pasar el mouse */}
          <Tooltip />
          
          {/* Las barras, definiendo qué propiedad graficar */}
          <Bar dataKey="nota" fill="#3b82f6" />
          
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
