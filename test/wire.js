const { Binary } = require('jsbinary');

const Connector = require('../src/connector');
const Wire = require('../src/wire');

var assert = require('assert/strict');

describe('Wire Test', () => {
    describe('Base test', () => {
        it('Constructor', () => {
            let w1 = new Wire('wire1', 4);
            assert.equal(w1.name, 'wire1');
            assert.equal(w1.dataWidth, 4);
        });

        it('Set data', () => {
            let w1 = new Wire('wire1', 4);
            let b1 = Binary.fromBinaryString('0000', 4);

            // https://nodejs.org/api/assert.html#assert_assert_value_message
            assert(Binary.equals(w1.data, b1));

            let b2 = Binary.fromBinaryString('1010', 4);
            w1.setData(b2);
            assert(Binary.equals(w1.data, b2));

            let b3 = Binary.fromBinaryString('1111', 4);
            w1.setData(b3);
            assert(Binary.equals(w1.data, b3));
        });
    });

    describe('Transit test', () => {
        it('Add lisener', (done) => {
            let w1 = new Wire('wire1', 4);

            let b1 = Binary.fromBinaryString('1010', 4);

            w1.addListener(data => {
                assert(Binary.equals(data, b1));
                done();
            });

            w1.setData(b1);
        });

        it('Add multiple liseners', (done) => {
            let w1 = new Wire('wire1', 4);

            let b1 = Binary.fromBinaryString('1010', 4);

            let count = 0;
            let plusOne = () => {
                count++;
                if (count === 3) {
                    done();
                }
            };

            w1.addListener(() => {
                plusOne();
            });

            w1.addListener(() => {
                plusOne();
            });

            w1.addListener(() => {
                plusOne();
            });

            w1.setData(b1);
        });
    });

    describe('Connect test', ()=>{
        it('Chain multiple wires', (done) => {
            let w1 = new Wire('wire1', 4);
            let w2 = new Wire('wire2', 4);
            let w3 = new Wire('wire3', 4);

            w2.connect(w1);
            w3.connect(w2);

            let b1 = Binary.fromBinaryString('1010', 4);

            w3.addListener(data => {
                assert(Binary.equals(data, b1));
                done();
            });

            w1.setData(b1);

            assert(Binary.equals(w1.data, b1));
            assert(Binary.equals(w2.data, b1));
            assert(Binary.equals(w3.data, b1));
        });

        it('Connect multiple wires', ()=>{
            let w1 = new Wire('wire1', 2);
            let w2 = new Wire('wire2', 2);
            let d1 = new Wire('dest1', 2);
            let d2 = new Wire('dest2', 2);

            Connector.connects([w1, w2], [d1, d2]);

            let b1 = Binary.fromBinaryString('10', 2);
            let b2 = Binary.fromBinaryString('11', 2);

            w1.setData(b1);
            w2.setData(b2);

            assert(Binary.equals(d1.data, b1));
            assert(Binary.equals(d2.data, b2));
        });
    });
});
