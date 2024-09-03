// Import necessary modules from Hardhat
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SecureVoting", function () {
    let SecureVoting;
    let secureVoting;
    let admin;
    let voter1;
    let voter2;

    before(async function () {
      SecureVoting = await ethers.getContractFactory("SecureVoting");
      [admin, voter1, voter2] = await ethers.getSigners();
      secureVoting = await SecureVoting.deploy();
      // await secureVoting.deployed(); 
  });

    it("Should allow admin to create a proposal", async function () {
        await secureVoting.connect(admin).createProposal("Sample Proposal 1");
        const proposal = await secureVoting.getProposal(0);
        expect(proposal.description).to.equal("Sample Proposal 1");
    });

    it("Should allow voters to register", async function () {
        await secureVoting.connect(voter1).registerVoter();
        const voter = await secureVoting.voters(voter1.address);
        expect(voter.isRegistered).to.equal(true);
    });

    it("Should allow registered voters to vote", async function () {
        await secureVoting.connect(voter1).vote(0);
        const voter = await secureVoting.voters(voter1.address);
        expect(voter.hasVoted).to.equal(true);

        const proposal = await secureVoting.getProposal(0);
        expect(proposal.voteCount).to.equal(1);
    });
});