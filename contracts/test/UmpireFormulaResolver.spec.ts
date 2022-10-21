import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { pfOperator, pfValue } from './utils';
import { PostfixNodeStruct } from '../typechain-types/UmpireFormulaResolver';

const numbersToTest = [0, 1, 2, 11, 100];
describe('POC1', function () {
  async function deployFormularesolver() {
    const [owner, otherAccount] = await ethers.getSigners();

    const FormulaResolver = await ethers.getContractFactory('UmpireFormulaResolver');
    const instance = await FormulaResolver.deploy();

    return { instance, owner, otherAccount };
  }

  describe('resolve', function () {
    it('a + b = c', async function () {
      const { instance } = await loadFixture(deployFormularesolver);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          const input: PostfixNodeStruct[] = [pfValue(a), pfValue(b), pfOperator('+')];

          expect(await instance.resolve(input, [])).to.equal(a + b);
        }
      }
    });

    it('a + b + c = d', async function () {
      const { instance } = await loadFixture(deployFormularesolver);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          for (let c of numbersToTest) {
            const input: PostfixNodeStruct[] = [pfValue(a), pfValue(b), pfOperator('+'), pfValue(c), pfOperator('+')];

            expect(await instance.resolve(input, [])).to.equal(a + b + c);
          }
        }
      }
    });

    it('a * b = c', async function () {
      const { instance } = await loadFixture(deployFormularesolver);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          const input: PostfixNodeStruct[] = [pfValue(a), pfValue(b), pfOperator('*')];

          expect(await instance.resolve(input, [])).to.equal(a * b);
        }
      }
    });

    it('a * b + c = d', async function () {
      const { instance } = await loadFixture(deployFormularesolver);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          for (let c of numbersToTest) {
            const input: PostfixNodeStruct[] = [pfValue(a), pfValue(b), pfOperator('*'), pfValue(c), pfOperator('+')];

            expect(await instance.resolve(input, [])).to.equal(a * b + c);
          }
        }
      }
    });

    it('a * (b + c) = d', async function () {
      const { instance } = await loadFixture(deployFormularesolver);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          for (let c of numbersToTest) {
            const input: PostfixNodeStruct[] = [pfValue(a), pfValue(b), pfValue(c), pfOperator('+'), pfOperator('*')];

            expect(await instance.resolve(input, [])).to.equal(a * (b + c));
          }
        }
      }
    });
  });

  describe('resolveFormula', function () {
    it('a + b = c', async function () {
      const { instance } = await loadFixture(deployFormularesolver);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          expect(await instance.resolveFormula('V0V1+', [a, b], [])).to.equal(a + b);
        }
      }
    });
  });
});
