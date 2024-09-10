async function main() {
    const SecureVoting = await ethers.getContractFactory("SecureVoting");
    const secureVoting = await SecureVoting.deploy();
    // await secureVoting.deployed();
    console.log("SecureVoting contract deployed to:", secureVoting.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
