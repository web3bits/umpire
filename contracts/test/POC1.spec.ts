import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { PostfixNodeStruct } from '../typechain-types/POC1.sol/POC1';
import { pfOperator, pfValue } from './utils';

const numbersToTest = [0, 1, 2, 3, 5, 10, 51, 123];
describe('POC1', function () {
  async function deployPOC1() {
    const [owner, otherAccount] = await ethers.getSigners();

    const POC1 = await ethers.getContractFactory('POC1');
    const instance = await POC1.deploy();

    return { instance, owner, otherAccount };
  }

  describe('Resolve', function () {
    it('a + b = c', async function () {
      const { instance } = await loadFixture(deployPOC1);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          const input: PostfixNodeStruct[] = [pfValue(a), pfValue(b), pfOperator('+')];

          expect(await instance.resolve(input)).to.equal(a + b);
        }
      }
    });

    it('a + b + c = d', async function () {
      const { instance } = await loadFixture(deployPOC1);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          for (let c of numbersToTest) {
            const input: PostfixNodeStruct[] = [pfValue(a), pfValue(b), pfOperator('+'), pfValue(c), pfOperator('+')];

            expect(await instance.resolve(input)).to.equal(a + b + c);
          }
        }
      }
    });

    it('a * b = c', async function () {
      const { instance } = await loadFixture(deployPOC1);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          const input: PostfixNodeStruct[] = [pfValue(a), pfValue(b), pfOperator('*')];

          expect(await instance.resolve(input)).to.equal(a * b);
        }
      }
    });

    it('a * b + c = d', async function () {
      const { instance } = await loadFixture(deployPOC1);

      for (let a of numbersToTest) {
        for (let b of numbersToTest) {
          for (let c of numbersToTest) {
            const input: PostfixNodeStruct[] = [pfValue(a), pfValue(b), pfOperator('*'), pfValue(c), pfOperator('+')];

            expect(await instance.resolve(input)).to.equal(a * b + c);
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

            expect(await instance.resolve(input)).to.equal(a * (b + c));
          }
        }
      }
    });
  });
});
