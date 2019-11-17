import Circuit from './Circuit';
import Unit from './Circuit.Unit';
import { createElectronic, EC, Coordinate } from './Electronic';
// import { ElectronicUnitType } from './Electronic.Unit';

let circuit: Circuit;
let result: Array<Array<Unit>>;

function createCircuitGrid(col: number, row: number) {
  return Array.from(Array(row)).map(() =>
    Array.from(Array(col)).map(() => new Unit())
  );
}

function resetCircuitGrid(w: number, h?: number) {
  circuit = new Circuit(w, h || w);
  result = createCircuitGrid(w, h || w);
}

beforeEach(() => {
  resetCircuitGrid(5);
});

describe('Lib: Circuit', () => {
  it('creates a circuit instance', () => {
    expect(circuit.layout).toMatchObject(result);
    expect(circuit.electronics).toMatchObject([]);
  });

  describe('Circuit.canAttachComponent', () => {
    describe('Out of Bound Error', () => {
      it('returns false if to-be attached component is out of circuit bound', () => {
        const testCases: Array<[Coordinate, boolean]> = [
          [[2, 1],  true],  // -> No Confliction
          [[4, 1], false],  // -> Out of Bound
          [[1, 1],  true],  // -> No Confliction
          [[0, 1], false],  // -> Out of Bound
        ];
  
        testCases.forEach(([coordinate, result]) => {
          expect(
            circuit.canAttachComponent(
              createElectronic(EC.Resistor, { coordinate })
            )
          ).toBe(result);  
        });
      });  
    });

    describe('Components Confliction Error', () => {
      it('returns false if to-be attached component is overlapped to another component', () => {
        // [[a, n, o, n, a]]
        circuit.appendElectronics(
          createElectronic(EC.Resistor, {
            coordinate: [2, 0]
          })
        );
  
        const testCases: Array<[Coordinate, boolean]> = [
          [[1, 0], false],  // -> Confliction
          [[3, 0], false],  // -> Confliction
          [[4, 0], false],  // -> Confliction
        ];
  
        testCases.forEach(([coordinate, result]) => {
          expect(
            circuit.canAttachComponent(
              createElectronic(EC.Resistor, { coordinate })
            )
          ).toBe(result);
        });
      });

      it('returns false if to-be attached component is partially conflicted to another component', () => {
        resetCircuitGrid(6, 2);

        // [[n, o, n, a, a, a]]
        // [[a, a, a, n, o, n]]
        circuit.appendElectronics(
          createElectronic(EC.Resistor, {
            coordinate: [1, 0]
          })
        );
        circuit.appendElectronics(
          createElectronic(EC.Resistor, {
            coordinate: [4, 1]
          })
        );

        const testCases: Array<[Coordinate, boolean]> = [
          [[2, 0], false],
          [[3, 0], true],
          [[3, 1], false],
          [[2, 1], true],
        ];
  
        testCases.forEach(([coordinate, result]) => {
          const e = createElectronic(EC.Resistor, { coordinate });
          const testResult = circuit.canAttachComponent(e);
          expect(testResult).toBe(result);
        });
      });
    });
  });

  describe('Attaching Components', () => {
    it('performs simple attachment', () => {
      circuit.appendElectronics(
        createElectronic(EC.Resistor, {
          coordinate: [1, 0]
        })
      );

      result[0][0].connect('right');
      result[0][1].setOccupied();
      result[0][2].connect('left');
      expect(circuit.electronics.length).toBe(1);
      expect(circuit.layout).toMatchObject(result);

      circuit.appendElectronics(
        createElectronic(EC.Resistor, {
          coordinate: [3, 2]
        })
      );

      result[2][2].connect('right');
      result[2][3].setOccupied();
      result[2][4].connect('left');
      expect(circuit.electronics.length).toBe(2);
      expect(circuit.layout).toMatchObject(result);
    });

    it('performs rotated components simple attachment', () => {
      const resistor = createElectronic(EC.Resistor, { coordinate: [1, 1] });
      resistor.rotate();
      circuit.appendElectronics(resistor);

      result[0][1].connect('bottom');
      result[1][1].setOccupied();
      result[2][1].connect('top');
      expect(circuit.layout).toMatchObject(result);
    });

    it('performs components pin-to-pin attachment', () => {
      resetCircuitGrid(6, 1);

      circuit.appendElectronics(
        createElectronic(EC.Resistor, {
          coordinate: [1, 0],
        })
      );
      circuit.appendElectronics(
        createElectronic(EC.Resistor, {
          coordinate: [3, 0],
        })
      );

      result[0][0].connect('right');
      result[0][1].setOccupied();
      result[0][2].connect('left');
      result[0][2].connect('right');
      result[0][3].setOccupied();
      result[0][4].connect('left');
      expect(circuit.layout).toMatchObject(result);
    });
  });

  it('performs rotated components pin-to-pin attachment', () => {
    const resistor1 = createElectronic(EC.Resistor, { coordinate: [2, 1] });
    resistor1.rotate();

    const resistor2 = createElectronic(EC.Resistor, { coordinate: [3, 2] });
    resistor2.rotate();
    resistor2.rotate();

    const resistor3 = createElectronic(EC.Resistor, { coordinate: [2, 3] });
    resistor3.rotate();
    resistor3.rotate();
    resistor3.rotate();

    const resistor4 = createElectronic(EC.Resistor, { coordinate: [1, 2] });
    resistor4.rotate();
    resistor4.rotate();
    resistor4.rotate();
    resistor4.rotate();

    circuit.appendElectronics(resistor1);
    circuit.appendElectronics(resistor2);
    circuit.appendElectronics(resistor3);
    circuit.appendElectronics(resistor4);

    // [ a a n a a ]
    // [ a a o a a ]
    // [ n o n o n ]
    // [ a a o a a ]
    // [ a a n a a ]
    result[0][2].connect('bottom');
    result[1][2].setOccupied();
    result[2][0].connect('right');
    result[2][1].setOccupied();
    result[2][2].connect('left');
    result[2][2].connect('top');
    result[2][2].connect('right');
    result[2][2].connect('bottom');
    result[2][3].setOccupied();
    result[2][4].connect('left');
    result[3][2].setOccupied();
    result[4][2].connect('top');
    expect(circuit.layout).toMatchObject(result);
  });
});
