// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title TruvoCertificate
 * @dev Soulbound NFT certificate — once issued, cannot be transferred
 * Each certificate stores an IPFS CID pointing to the actual PDF
 */
contract TruvoCertificate is ERC721, AccessControl {

    // Anyone with ISSUER_ROLE can issue and revoke certificates
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    // Simple counter — OpenZeppelin v5 removed Counters.sol, use plain uint256
    uint256 private _tokenIdCounter;

    // All data stored for each certificate
    struct Certificate {
        string  ipfsCid;      // IPFS CID of the certificate PDF
        string  learnerName;  // Full name of learner
        string  skillName;    // Skill being certified
        string  issuingOrg;   // Name of training organisation
        uint256 issuedAt;     // Timestamp when issued
        bool    revoked;      // True if certificate is revoked
    }

    // tokenId => Certificate data
    mapping(uint256 => Certificate) private _certificates;

    // learner wallet => list of their token IDs
    mapping(address => uint256[]) private _learnerCerts;

    // Events — backend and n8n will listen to these
    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed learner,
        string  ipfsCid,
        string  skillName,
        uint256 issuedAt
    );

    event CertificateRevoked(
        uint256 indexed tokenId,
        address indexed revokedBy,
        uint256 revokedAt
    );

    // Constructor runs once when contract is deployed
    // The deployer wallet becomes the admin and first issuer
    constructor() ERC721("TruvoCertificate", "TRUVO") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
    }

    // Admin can add new issuers (training organisations)
    function addIssuer(address issuer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(ISSUER_ROLE, issuer);
    }

    // Admin can remove issuers
    function removeIssuer(address issuer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(ISSUER_ROLE, issuer);
    }

    // Issue a new certificate — only issuers can call this
    function issueCertificate(
        address learner,
        string calldata ipfsCid,
        string calldata learnerName,
        string calldata skillName,
        string calldata issuingOrg
    ) external onlyRole(ISSUER_ROLE) returns (uint256) {
        require(learner != address(0), "Truvo: invalid learner address");
        require(bytes(ipfsCid).length > 0, "Truvo: IPFS CID required");
        require(bytes(skillName).length > 0, "Truvo: skill name required");

        // Increment first so token IDs start at 1
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        // Mint the NFT to the learner wallet
        _safeMint(learner, tokenId);

        // Store certificate data permanently on-chain
        _certificates[tokenId] = Certificate({
            ipfsCid:     ipfsCid,
            learnerName: learnerName,
            skillName:   skillName,
            issuingOrg:  issuingOrg,
            issuedAt:    block.timestamp,
            revoked:     false
        });

        _learnerCerts[learner].push(tokenId);

        emit CertificateIssued(tokenId, learner, ipfsCid, skillName, block.timestamp);

        return tokenId;
    }

    // Verify a certificate — anyone can call this (no login needed)
    function verifyCertificate(uint256 tokenId) external view returns (
        string  memory ipfsCid,
        string  memory learnerName,
        string  memory skillName,
        string  memory issuingOrg,
        uint256        issuedAt,
        bool           revoked,
        address        owner
    ) {
        require(_ownerOf(tokenId) != address(0), "Truvo: certificate does not exist");
        Certificate memory cert = _certificates[tokenId];
        return (
            cert.ipfsCid,
            cert.learnerName,
            cert.skillName,
            cert.issuingOrg,
            cert.issuedAt,
            cert.revoked,
            ownerOf(tokenId)
        );
    }

    // Revoke a certificate — only issuers can do this
    function revokeCertificate(uint256 tokenId) external onlyRole(ISSUER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Truvo: certificate does not exist");
        require(!_certificates[tokenId].revoked, "Truvo: already revoked");
        _certificates[tokenId].revoked = true;
        emit CertificateRevoked(tokenId, msg.sender, block.timestamp);
    }

    // Get all certificate IDs owned by a learner
    function getLearnerCertificates(address learner)
        external view returns (uint256[] memory)
    {
        return _learnerCerts[learner];
    }

    // Total certificates ever issued
    function totalIssued() external view returns (uint256) {
        return _tokenIdCounter;
    }

    // SOULBOUND — prevent all transfers
    // In OpenZeppelin v5, override _update instead of _beforeTokenTransfer
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        // Allow only minting (from == address(0)), block all transfers
        require(from == address(0), "Truvo: certificates are non-transferable");
        return super._update(to, tokenId, auth);
    }

    // Required because both ERC721 and AccessControl define supportsInterface
    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}