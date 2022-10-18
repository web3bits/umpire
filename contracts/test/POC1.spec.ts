import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { pfOperator, pfValue } from './utils';
import { PostfixNodeStruct } from '../typechain-types/POC1';

const numbersToTest = [0, 1, 2, 11, 100];
describe('POC1', function () {
  async function deployPOC1() {
    const [owner, otherAccount] = await ethers.getSigners();

    const POC1 = await ethers.getContractFactory('POC1');
    const instance = await POC1.deploy();

    return { instance, owner, otherAccount };
  }

  describe('resolve', function () {
    it('a + b = c', async function () {
      const { instance } = await loadFixture(deployPOC1);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          const input: PostfixNodeStruct[] = [pfValue(a), pfValue(b), pfOperator('+')];

          expect(await instance.resolve(input, [])).to.equal(a + b);
        }
      }
    });

    it('a + b + c = d', async function () {
      const { instance } = await loadFixture(deployPOC1);

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
      const { instance } = await loadFixture(deployPOC1);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          const input: PostfixNodeStruct[] = [pfValue(a), pfValue(b), pfOperator('*')];

          expect(await instance.resolve(input, [])).to.equal(a * b);
        }
      }
    });

    it('a * b + c = d', async function () {
      const { instance } = await loadFixture(deployPOC1);

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
      const { instance } = await loadFixture(deployPOC1);

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
      const { instance } = await loadFixture(deployPOC1);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          expect(await instance.resolveFormula('V0V1+', [a, b], [])).to.equal(a + b);
        }
      }
    });
  });
});
