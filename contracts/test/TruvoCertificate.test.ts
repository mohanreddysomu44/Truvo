import { expect } from "chai";
import hre from "hardhat";

describe("TruvoCertificate", function () {
  async function deployContract() {
    const { ethers } = await hre.network.connect();

    const [owner, issuer, learner, stranger] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("TruvoCertificate");

    const contract = await Factory.deploy();
    await contract.waitForDeployment();

    await contract.addIssuer(issuer.address);

    return {
      ethers,
      contract,
      owner,
      issuer,
      learner,
      stranger,
    };
  }

  describe("Deployment", function () {
    it("Should deploy with correct name and symbol", async function () {
      const { contract } = await deployContract();

      expect(await contract.name()).to.equal("TruvoCertificate");
      expect(await contract.symbol()).to.equal("TRUVO");
    });

    it("Should start with zero certificates", async function () {
      const { contract } = await deployContract();

      expect(await contract.totalIssued()).to.equal(0n);
    });
  });

  describe("Issuing Certificates", function () {
    it("Should issue certificate successfully", async function () {
      const { contract, issuer, learner } = await deployContract();

      await contract
        .connect(issuer)
        .issueCertificate(
          learner.address,
          "bafkreitest123",
          "Mohan Kumar",
          "Full Stack Development",
          "Truvo Institute",
        );

      expect(await contract.totalIssued()).to.equal(1n);
    });

    it("Should store correct data on-chain", async function () {
      const { contract, issuer, learner } = await deployContract();

      await contract
        .connect(issuer)
        .issueCertificate(
          learner.address,
          "bafkreitest123",
          "Mohan Kumar",
          "Full Stack Development",
          "Truvo Institute",
        );

      const cert = await contract.verifyCertificate(1n);

      expect(cert[0]).to.equal("bafkreitest123");
      expect(cert[1]).to.equal("Mohan Kumar");
      expect(cert[2]).to.equal("Full Stack Development");
      expect(cert[5]).to.equal(false);
    });

    it("Should reject if caller is not issuer", async function () {
      const { contract, stranger, learner } = await deployContract();

      await expect(
        contract
          .connect(stranger)
          .issueCertificate(
            learner.address,
            "bafkreitest123",
            "Mohan Kumar",
            "Full Stack Development",
            "Truvo Institute",
          ),
      )
        .to.be.revertedWithCustomError(
          contract,
          "AccessControlUnauthorizedAccount",
        )
        .withArgs(stranger.address, await contract.ISSUER_ROLE());
    });

    it("Should reject empty IPFS CID", async function () {
      const { contract, issuer, learner } = await deployContract();

      await expect(
        contract
          .connect(issuer)
          .issueCertificate(
            learner.address,
            "",
            "Mohan Kumar",
            "Full Stack Development",
            "Truvo Institute",
          ),
      ).to.be.revertedWith("Truvo: IPFS CID required");
    });

    it("Should reject zero address", async function () {
      const { contract, issuer, ethers } = await deployContract();

      await expect(
        contract
          .connect(issuer)
          .issueCertificate(
            ethers.ZeroAddress,
            "bafkreitest123",
            "Mohan Kumar",
            "Full Stack Development",
            "Truvo Institute",
          ),
      ).to.be.revertedWith("Truvo: invalid learner address");
    });
  });

  describe("Revocation", function () {
    it("Should revoke certificate", async function () {
      const { contract, issuer, learner } = await deployContract();

      await contract
        .connect(issuer)
        .issueCertificate(
          learner.address,
          "bafkreitest123",
          "Mohan Kumar",
          "Full Stack Development",
          "Truvo Institute",
        );

      await contract.connect(issuer).revokeCertificate(1n);

      const cert = await contract.verifyCertificate(1n);

      expect(cert[5]).to.equal(true);
    });

    it("Should reject revocation by non-issuer", async function () {
      const { contract, issuer, learner, stranger } = await deployContract();

      await contract
        .connect(issuer)
        .issueCertificate(
          learner.address,
          "bafkreitest123",
          "Mohan Kumar",
          "Full Stack Development",
          "Truvo Institute",
        );

      await expect(contract.connect(stranger).revokeCertificate(1n))
        .to.be.revertedWithCustomError(
          contract,
          "AccessControlUnauthorizedAccount",
        )
        .withArgs(stranger.address, await contract.ISSUER_ROLE());
    });

    it("Should reject double revocation", async function () {
      const { contract, issuer, learner } = await deployContract();

      await contract
        .connect(issuer)
        .issueCertificate(
          learner.address,
          "bafkreitest123",
          "Mohan Kumar",
          "Full Stack Development",
          "Truvo Institute",
        );

      await contract.connect(issuer).revokeCertificate(1n);

      await expect(
        contract.connect(issuer).revokeCertificate(1n),
      ).to.be.revertedWith("Truvo: already revoked");
    });
  });

  describe("Soulbound Token", function () {
    it("Should prevent certificate transfer", async function () {
      const { contract, issuer, learner, stranger } = await deployContract();

      await contract
        .connect(issuer)
        .issueCertificate(
          learner.address,
          "bafkreitest123",
          "Mohan Kumar",
          "Full Stack Development",
          "Truvo Institute",
        );

      await expect(
        contract
          .connect(learner)
          .transferFrom(learner.address, stranger.address, 1n),
      ).to.be.revertedWith("Truvo: certificates are non-transferable");
    });
  });

  describe("Learner Certificates", function () {
    it("Should return all certificate IDs for a learner", async function () {
      const { contract, issuer, learner } = await deployContract();

      for (let i = 0; i < 3; i++) {
        await contract
          .connect(issuer)
          .issueCertificate(
            learner.address,
            `bafkreitest${i}`,
            "Mohan Kumar",
            `Skill ${i}`,
            "Truvo Institute",
          );
      }

      const certs = await contract.getLearnerCertificates(learner.address);

      expect(certs.length).to.equal(3);
      expect(certs[0]).to.equal(1n);
      expect(certs[1]).to.equal(2n);
      expect(certs[2]).to.equal(3n);
    });
  });
});
