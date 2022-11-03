import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { pfOperator, pfValueSD59x18 } from './utils';
import { PostfixNodeStruct } from '../typechain-types/UmpireFormulaResolver';
import { toBn } from 'evm-bn';

const numbersToTest = [0, 1, 2, 11, 100];
describe('UmpireFormulaResolverV2', function () {
  async function deployFormulaResolver() {
    const [owner, otherAccount] = await ethers.getSigners();

    const FormulaResolver = await ethers.getContractFactory('UmpireFormulaResolverV2');
    const instance = await FormulaResolver.deploy();

    return { instance, owner, otherAccount };
  }

  describe('resolve', function () {
    it('a + b = c', async function () {
      const { instance } = await loadFixture(deployFormulaResolver);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          const input: PostfixNodeStruct[] = [pfValueSD59x18(a), pfValueSD59x18(b), pfOperator('+')];

          expect(await instance.resolve(input, [])).to.equal(toBn(String(a + b)));
        }
      }
    });

    it('a + b + c = d', async function () {
      const { instance } = await loadFixture(deployFormulaResolver);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          for (let c of numbersToTest) {
            const input: PostfixNodeStruct[] = [
              pfValueSD59x18(a),
              pfValueSD59x18(b),
              pfOperator('+'),
              pfValueSD59x18(c),
              pfOperator('+'),
            ];

            expect(await instance.resolve(input, [])).to.equal(toBn(String(a + b + c)));
          }
        }
      }
    });

    it('a * b = c', async function () {
      const { instance } = await loadFixture(deployFormulaResolver);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          const input: PostfixNodeStruct[] = [pfValueSD59x18(a), pfValueSD59x18(b), pfOperator('*')];
          expect(await instance.resolve(input, [])).to.equal(toBn(String(a * b)));
        }
      }
    });

    it('a * b + c = d', async function () {
      const { instance } = await loadFixture(deployFormulaResolver);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          for (let c of numbersToTest) {
            const input: PostfixNodeStruct[] = [
              pfValueSD59x18(a),
              pfValueSD59x18(b),
              pfOperator('*'),
              pfValueSD59x18(c),
              pfOperator('+'),
            ];

            expect(await instance.resolve(input, [])).to.equal(toBn(String(a * b + c)));
          }
        }
      }
    });

    it('a * (b + c) = d', async function () {
      const { instance } = await loadFixture(deployFormulaResolver);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          for (let c of numbersToTest) {
            const input: PostfixNodeStruct[] = [
              pfValueSD59x18(a),
              pfValueSD59x18(b),
              pfValueSD59x18(c),
              pfOperator('+'),
              pfOperator('*'),
            ];

            expect(await instance.resolve(input, [])).to.equal(toBn(String(a * (b + c))));
          }
        }
      }
    });
  });

  describe('resolveFormula', function () {
    it('a + b = c', async function () {
      const { instance } = await loadFixture(deployFormulaResolver);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          expect(await instance.resolveFormula('V0V1+', [toBn(String(a)), toBn(String(b))], [])).to.equal(
            toBn(String(a + b))
          );
        }
      }
    });
  });
});
