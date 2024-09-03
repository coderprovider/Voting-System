// src/App.js
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { CONTRACT_ADDRESS, ABI } from "./config";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [voteCounts, setVoteCounts] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    async function loadBlockchainData() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          const votingContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
          setContract(votingContract);

          const proposalsCount = await votingContract.methods.getProposalsCount().call();
          const proposals = [];
          const voteCounts = [];
          for (let i = 0; i < proposalsCount; i++) {
            const proposal = await votingContract.methods.getProposal(i).call();
            proposals.push(proposal[0]);
            voteCounts.push(proposal[1]);
          }
          setProposals(proposals);
          setVoteCounts(voteCounts);

          const voter = await votingContract.methods.voters(accounts[0]).call();
          setIsRegistered(voter.registered);
          setHasVoted(voter.voted);
        } catch (error) {
          console.error("Error connecting to blockchain:", error);
        }
      }
    }

    loadBlockchainData();
  }, []);

  const registerVoter = async () => {
    if (contract && account) {
      try {
        await contract.methods.registerVoter(account).send({ from: account });
        setIsRegistered(true);
      } catch (error) {
        console.error("Registration failed:", error);
      }
    }
  };

  const vote = async (proposalIndex) => {
    if (contract && account) {
      try {
        await contract.methods.vote(proposalIndex).send({ from: account });
        setHasVoted(true);
        const updatedVoteCounts = [...voteCounts];
        updatedVoteCounts[proposalIndex] += 1;
        setVoteCounts(updatedVoteCounts);
      } catch (error) {
        console.error("Voting failed:", error);
      }
    }
  };

  return (
    <div>
      <h1>Voting DApp</h1>
      <p>Your account: {account}</p>
      {!isRegistered && (
        <button onClick={registerVoter}>Register as a Voter</button>
      )}
      {isRegistered && !hasVoted && (
        <div>
          <h2>Proposals</h2>
          {proposals.map((proposal, index) => (
            <div key={index}>
              <p>{proposal}</p>
              <p>Votes: {voteCounts[index]}</p>
              <button onClick={() => vote(index)}>Vote</button>
            </div>
          ))}
        </div>
      )}
      {hasVoted && <p>You have already voted!</p>}
    </div>
  );
}

export default App;
