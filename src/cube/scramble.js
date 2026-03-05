// Notación estándar: U D L R F B + sufijo ' = antihorario, 2 = doble
export const SCRAMBLE_SEQUENCE = [
  'R', 'U', "R'", 'F', 'B2', 'L', "U'", 'R2',
  'F', "B'", 'U2', 'L', "R'", 'D', "F'", 'B',
  'U', "L'", 'R', 'D2'
];

// Inversa exacta del scramble
export const SOLUTION_SEQUENCE = SCRAMBLE_SEQUENCE.slice().reverse().map(move => {
  if (move.endsWith("'")) return move.slice(0, -1);
  if (move.endsWith('2')) return move; // doble es su propia inversa
  return move + "'";
});

// Distribuir movimientos en bloques para cada sección de scroll
export function getMovementsForSection(sectionIndex) {
  const perSection = Math.ceil(SOLUTION_SEQUENCE.length / 4);
  const start = sectionIndex * perSection;
  return SOLUTION_SEQUENCE.slice(start, start + perSection);
}
