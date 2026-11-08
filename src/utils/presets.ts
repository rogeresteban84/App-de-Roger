export interface PresetCollection {
  id: string;
  name: string;
  description: string;
  items: string[];
}

export const PRESET_COLLECTIONS: PresetCollection[] = [
  {
    id: 'nombres',
    name: 'Nombres al Azar',
    description: '10 participantes para sorteos y turnos',
    items: [
      'Alejandro', 'Valentina', 'Mateo', 'Camila', 'Santiago',
      'Sofía', 'Lucas', 'Mariana', 'Daniel', 'Lucía'
    ]
  },
  {
    id: 'comida',
    name: '¿Qué Comer Hoy?',
    description: 'Decide el menú del almuerzo o cena',
    items: [
      'Pizza', 'Hamburguesas', 'Tacos', 'Sushi',
      'Pasta Italiana', 'Comida China', 'Ensalada Fresca',
      'Pollo a la Brasa', 'Empanadas', 'Shawarma'
    ]
  },
  {
    id: 'premios',
    name: 'Sorteo de Premios',
    description: 'Ideal para rifas, eventos o promociones',
    items: [
      'Premio Mayor: $100', 'Vale de Compra $50', 'Descuento 30%',
      'Cena para Dos', 'Tarjeta Regalo', 'Souvenir Especial',
      'Intenta de Nuevo', 'Descuento 15%'
    ]
  },
  {
    id: 'verdad_reto',
    name: 'Verdad o Reto',
    description: 'Juegos de fiesta y reuniones',
    items: [
      'Verdad: Secreto', 'Reto: Baile gracioso', 'Verdad: Mayor vergüenza',
      'Reto: Imitar a alguien', 'Verdad: Tu crush', 'Reto: Llamada sorpresa',
      'Comodín', 'Doble Reto'
    ]
  },
  {
    id: 'equipos',
    name: 'Equipos / Grupos',
    description: 'Organiza grupos de estudio o juego',
    items: [
      'Equipo Alfa', 'Equipo Bravo', 'Equipo Charlie',
      'Equipo Delta', 'Equipo Eco', 'Equipo Fénix'
    ]
  },
  {
    id: 'numeros_30',
    name: 'Números 1 al 20',
    description: 'Selección numérica para rifas y turnos',
    items: Array.from({ length: 20 }, (_, i) => `Número ${i + 1}`)
  }
];
