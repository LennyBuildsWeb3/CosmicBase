// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title CosmicBaseNFT
 * @dev Birth Chart NFT contract for CosmicBase platform
 * @notice This contract allows users to mint their astrological birth chart as an NFT
 */
contract CosmicBaseNFT is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    // Token ID counter
    uint256 private _tokenIdCounter;

    // Birth chart data structure
    struct BirthChart {
        bytes32 birthDataHash;      // Privacy-preserving hash of birth data
        string metadataURI;         // IPFS URI for full chart data
        uint256 mintTimestamp;      // When the NFT was minted
        uint8 sunSign;              // Zodiac sign (1-12)
        uint8 moonSign;             // Moon zodiac sign (1-12)
        uint8 risingSign;           // Ascending zodiac sign (1-12)
    }

    // Mappings
    mapping(uint256 => BirthChart) public birthCharts;
    mapping(address => uint256) public userToToken;
    mapping(address => bool) public hasMinted;

    // Events
    event ChartMinted(
        address indexed user,
        uint256 indexed tokenId,
        bytes32 birthDataHash,
        string metadataURI,
        uint8 sunSign,
        uint8 moonSign,
        uint8 risingSign
    );

    event MetadataUpdated(uint256 indexed tokenId, string newMetadataURI);

    /**
     * @dev Constructor
     */
    constructor() ERC721("CosmicBase Birth Chart", "COSMIC") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }

    /**
     * @notice Mint a birth chart NFT (one per address)
     * @param _birthDataHash Privacy-preserving hash of birth data
     * @param _metadataURI IPFS URI containing chart metadata
     * @param _sunSign Sun zodiac sign (1-12)
     * @param _moonSign Moon zodiac sign (1-12)
     * @param _risingSign Rising zodiac sign (1-12)
     * @return tokenId The ID of the minted token
     */
    function mintBirthChart(
        bytes32 _birthDataHash,
        string memory _metadataURI,
        uint8 _sunSign,
        uint8 _moonSign,
        uint8 _risingSign
    ) external returns (uint256) {
        require(!hasMinted[msg.sender], "Already minted a birth chart");
        require(_birthDataHash != bytes32(0), "Invalid birth data hash");
        require(bytes(_metadataURI).length > 0, "Metadata URI required");
        require(_sunSign >= 1 && _sunSign <= 12, "Invalid sun sign");
        require(_moonSign >= 1 && _moonSign <= 12, "Invalid moon sign");
        require(_risingSign >= 1 && _risingSign <= 12, "Invalid rising sign");

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _metadataURI);

        birthCharts[tokenId] = BirthChart({
            birthDataHash: _birthDataHash,
            metadataURI: _metadataURI,
            mintTimestamp: block.timestamp,
            sunSign: _sunSign,
            moonSign: _moonSign,
            risingSign: _risingSign
        });

        userToToken[msg.sender] = tokenId;
        hasMinted[msg.sender] = true;

        emit ChartMinted(
            msg.sender,
            tokenId,
            _birthDataHash,
            _metadataURI,
            _sunSign,
            _moonSign,
            _risingSign
        );

        return tokenId;
    }

    /**
     * @notice Get birth chart data for a token
     * @param tokenId The token ID
     * @return BirthChart struct with chart data
     */
    function getBirthChart(uint256 tokenId) external view returns (BirthChart memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return birthCharts[tokenId];
    }

    /**
     * @notice Get token ID for a user address
     * @param user The user address
     * @return tokenId (0 if user hasn't minted)
     */
    function getTokenByAddress(address user) external view returns (uint256) {
        return userToToken[user];
    }

    /**
     * @notice Check if an address has minted
     * @param user The user address
     * @return bool true if user has minted
     */
    function hasUserMinted(address user) external view returns (bool) {
        return hasMinted[user];
    }

    /**
     * @notice Get total supply of minted tokens
     * @return uint256 total count
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @notice Calculate basic compatibility score between two charts
     * @param tokenId1 First token ID
     * @param tokenId2 Second token ID
     * @return score Compatibility score (0-100)
     */
    function calculateCompatibility(uint256 tokenId1, uint256 tokenId2)
        external
        view
        returns (uint8 score)
    {
        require(_ownerOf(tokenId1) != address(0), "Token 1 does not exist");
        require(_ownerOf(tokenId2) != address(0), "Token 2 does not exist");

        BirthChart memory chart1 = birthCharts[tokenId1];
        BirthChart memory chart2 = birthCharts[tokenId2];

        // Simple compatibility algorithm based on zodiac signs
        // This is a basic implementation - can be enhanced with more sophisticated logic

        uint8 compatibilityScore = 50; // Base score

        // Sun sign compatibility (40 points)
        if (chart1.sunSign == chart2.sunSign) {
            compatibilityScore += 20; // Same sign
        } else if (areCompatibleSigns(chart1.sunSign, chart2.sunSign)) {
            compatibilityScore += 30; // Compatible signs
        } else if (areOpposingSigns(chart1.sunSign, chart2.sunSign)) {
            compatibilityScore += 15; // Opposing signs can be complementary
        }

        // Moon sign compatibility (30 points)
        if (chart1.moonSign == chart2.moonSign) {
            compatibilityScore += 15;
        } else if (areCompatibleSigns(chart1.moonSign, chart2.moonSign)) {
            compatibilityScore += 20;
        }

        // Rising sign compatibility (30 points)
        if (chart1.risingSign == chart2.risingSign) {
            compatibilityScore += 15;
        } else if (areCompatibleSigns(chart1.risingSign, chart2.risingSign)) {
            compatibilityScore += 20;
        }

        // Cap at 100
        if (compatibilityScore > 100) {
            compatibilityScore = 100;
        }

        return compatibilityScore;
    }

    /**
     * @dev Check if two zodiac signs are compatible (same element)
     * Fire: 1(Aries), 5(Leo), 9(Sagittarius)
     * Earth: 2(Taurus), 6(Virgo), 10(Capricorn)
     * Air: 3(Gemini), 7(Libra), 11(Aquarius)
     * Water: 4(Cancer), 8(Scorpio), 12(Pisces)
     */
    function areCompatibleSigns(uint8 sign1, uint8 sign2) private pure returns (bool) {
        uint8 element1 = ((sign1 - 1) % 4) + 1;
        uint8 element2 = ((sign2 - 1) % 4) + 1;
        return element1 == element2;
    }

    /**
     * @dev Check if two signs are opposing (6 signs apart)
     */
    function areOpposingSigns(uint8 sign1, uint8 sign2) private pure returns (bool) {
        uint8 diff = sign1 > sign2 ? sign1 - sign2 : sign2 - sign1;
        return diff == 6;
    }

    /**
     * @notice Update metadata URI (only token owner)
     * @param tokenId The token ID
     * @param newMetadataURI New IPFS URI
     */
    function updateMetadataURI(uint256 tokenId, string memory newMetadataURI) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(bytes(newMetadataURI).length > 0, "Invalid URI");

        _setTokenURI(tokenId, newMetadataURI);
        birthCharts[tokenId].metadataURI = newMetadataURI;

        emit MetadataUpdated(tokenId, newMetadataURI);
    }

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
