const Getcoin = artifacts.require('Getcoin');

const {
    expect
} = require('chai');

const {
    BN,
    constants,
    expectEvent,
    expectRevert,
} = require('@openzeppelin/test-helpers');

contract('Getcoin', function ([sender, receiver]) {
    beforeEach(async function () {
        this.getcoin = await Getcoin.new();
        this.value = new BN(0.001);
    });

    it('reverts when transferring tokens to the zero address', async function () {
        await expectRevert(
            this.getcoin.transfer(constants.ZERO_ADDRESS, this.value, {from: sender}),
            'ERC20: transfer to the zero address',
        );
    });

    it('emits a transfer event on successful transfers', async function () {
        const receipt = await this.getcoin.transfer(
            receiver,
            this.value,
            {from: sender}
        );

        expectEvent(receipt, 'Transfer', {
            from: sender,
            to: receiver,
            value: this.value,
        });
    });

    it('updates balances on successful transfers', async function () {
        this.getcoin.transfer(
            receiver,
            this.value,
            {from: sender}
        );

        expect(await this.getcoin.balanceOf(receiver)).to.be.bignumber.equal(this.value);
    });
});
