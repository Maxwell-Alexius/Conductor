import SimultaneousEquations from './Circuit.SimultaneousEquations';
import Equation from './Circuit.Equation';

describe('Lib: Circuit.SimultaneousEquations', () => {
  describe('Simultaneous Equations Establishment', () => {
    let eq1: Equation, eq2: Equation, eqUnmatched1: Equation, eqUnmatched2: Equation, eqUnmatched3: Equation;
    beforeEach(() => {
      [eq1, eq2, eqUnmatched1, eqUnmatched2, eqUnmatched3] = Array.from(Array(5)).map(() => new Equation());
      eq1.unknown('x', 3).unknown('y', -2).constant(9);
      eq2.unknown('x', 1).unknown('y', 1).constant(-7);
      eqUnmatched1.unknown('x', 1).unknown('z', 1).constant(-7);
      eqUnmatched2.unknown('x', 1).unknown('y', 1).unknown('z', 123).constant(-7);
      eqUnmatched3.unknown('x', 1).constant(-7);
    });

    it('initializes simultaneous equations by array of equations', () => {
      const se = new SimultaneousEquations([eq1, eq2]);
      expect(se.unknowns).toMatchObject(new Set<string>(['x', 'y']));
      expect(se.equations).toMatchObject(new Set<Equation>([eq1, eq2]));
    });

    it('throws error when there are unmatched unknown in array of equations', () => {
      expect(() => new SimultaneousEquations([eq1, eqUnmatched1]))
        .toThrowError('Name of the unknown is unmatched among the equations set');

      expect(() => new SimultaneousEquations([eq1, eqUnmatched2]))
        .toThrowError('The quantity of unknown is unmatched among the equations set');
    });

    it('throws error when adding equations less than 2 unknowns', () => {
      const msg = 'Equation to be included into Simultaneous Equations should contain at least two unknowns';
      expect(() => new SimultaneousEquations([new Equation()])).toThrowError(msg);
      expect(() => new SimultaneousEquations([eqUnmatched3])).toThrowError(msg);
    });

    it('establishes simultaneous equations by adding multiple equations', () => {
      const se = new SimultaneousEquations();
      se.addEquation(eq1);
      se.addEquation(eq2);

      expect(se.unknowns).toMatchObject(new Set<string>(['x', 'y']));
      expect(se.equations).toMatchObject(new Set<Equation>([eq1, eq2]));
    });

    it('throws error when adding unmatched unknown equations', () => {
      const se = new SimultaneousEquations();
      se.addEquation(eq1);
      se.addEquation(eq2);

      expect(() => se.addEquation(eqUnmatched1))
        .toThrowError('Name of the unknown is unmatched among the equations set');
      expect(() => se.addEquation(eqUnmatched2))
        .toThrowError('The quantity of unknown is unmatched among the equations set');
      expect(() => se.addEquation(eqUnmatched3))
        .toThrowError('Equation to be included into Simultaneous Equations should contain at least two unknowns');
    });
  });

  describe('Simultaneous Equations Solution', () => {
    it.todo('solves the simultaneous equations when there are sufficient requirements');
    it.todo('throws error when there aren\'t enough equations to solve');
    it.todo('solves the simultaneous equations with provided known values');
    it.todo('throws error when provided known values aren\'t matching the name of the unknowns in simultaneous equations');
    it.todo('throws error when provided known values still not enough to solve the simultaneous equations');
  });

  describe('Linear Dependent', () => {
    describe('Circuit.SimultaneousEquations#hasLinearlyDependentEquations', () => {
      it.todo('returns true if detected linearly dependent equations');
    });

    describe('Circuit.SimultaneousEquations#simplify', () => {
      it.todo('simplifys the equations by removing one of the equations in linearly dependent equation pairs (or more)');
    });
  });
});
