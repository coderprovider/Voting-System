// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SecureVoting {
    address public admin;

    struct Proposal {
        string description; 
        uint256 voteCount; 
        bool exists; 
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted; 
        uint256 vote;
    }

    Proposal[] public proposals;

    mapping(address => Voter) public voters; 

    event ProposalCreated(uint256 indexed proposalId, string description);

    event VoterRegistered(address indexed voter);

    event VoteCast(address indexed voter, uint256 indexed proposalId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyRegisteredVoter() {
        require(
            voters[msg.sender].isRegistered,
            "You must be registered to vote"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createProposal(string calldata _description) external onlyAdmin {
        proposals.push(
            Proposal({description: _description, voteCount: 0, exists: true})
        );

        emit ProposalCreated(proposals.length - 1, _description);
    }

    function registerVoter() external {
        require(!voters[msg.sender].isRegistered, "You are already registered");

        voters[msg.sender] = Voter({
            isRegistered: true,
            hasVoted: false,
            vote: 0
        });

        emit VoterRegistered(msg.sender);
    }

    function vote(uint256 _proposalId) external onlyRegisteredVoter {
        Voter storage voter = voters[msg.sender];
        require(!voter.hasVoted, "You have already voted");
        require(_proposalId < proposals.length, "Invalid proposal ID");
        require(proposals[_proposalId].exists, "Proposal does not exist");

        voter.hasVoted = true;
        voter.vote = _proposalId;

        proposals[_proposalId].voteCount += 1;

        emit VoteCast(msg.sender, _proposalId);
    }

    function getProposal(
        uint256 _proposalId
    ) external view returns (string memory description, uint256 voteCount) {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        return (proposal.description, proposal.voteCount);
    }

    function getProposalsCount() external view returns (uint256) {
        return proposals.length;
    }
}
