// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title FHECosmicBaseNFT
 * @dev Birth Chart NFT contract with Fully Homomorphic Encryption for privacy
 * @notice This contract stores sensitive birth data encrypted using Zama's FHEVM
 */
contract FHECosmicBaseNFT is ERC721, ERC721URIStorage, Ownable, ZamaEthereumConfig {
    using Strings for uint256;

    // Token ID counter
    uint256 private _tokenIdCounter;

    // Encrypted birth data structure
    struct EncryptedBirthData {
        euint16 birthYear;      // Encrypted year (1900-2100)
        euint8 birthMonth;      // Encrypted month (1-12)
        euint8 birthDay;        // Encrypted day (1-31)
        euint8 birthHour;       // Encrypted hour (0-23)
        euint8 birthMinute;     // Encrypted minute (0-59)
        euint32 latitude;       // Encrypted latitude * 10000 + 900000 (offset for positive)
        euint32 longitude;      // Encrypted longitude * 10000 + 1800000 (offset for positive)
    }

    // Public birth chart data
    struct PublicBirthChart {
        string metadataURI;         // IPFS URI for chart visualization
        uint256 mintTimestamp;      // When the NFT was minted
        uint8 sunSign;              // Zodiac sign (1-12)
        uint8 moonSign;             // Moon zodiac sign (1-12)
        uint8 risingSign;           // Ascending zodiac sign (1-12)
        bool hasEncryptedData;      // Whether encrypted data exists
    }

    // Mappings
    mapping(uint256 => EncryptedBirthData) private encryptedBirthData;
    mapping(uint256 => PublicBirthChart) public publicBirthCharts;
    mapping(address => uint256) public userToToken;
    mapping(address => bool) public hasMinted;

    // Encrypted aggregate statistics - FHE computation on sign counts
    euint32 private encryptedTotalMints;
    euint32[12] private encryptedSunSignCounts;  // Count per zodiac sign (0-11)

    // Flag to track if stats are initialized
    bool private statsInitialized;

    // Events
    event ChartMinted(
        address indexed user,
        uint256 indexed tokenId,
        string metadataURI,
        uint8 sunSign,
        uint8 moonSign,
        uint8 risingSign
    );

    event MetadataUpdated(uint256 indexed tokenId, string newMetadataURI);
    event StatsUpdated(uint256 totalMints);

    /**
     * @dev Constructor
     */
    constructor()
        ERC721("CosmicBase FHE Birth Chart", "COSMIC-FHE")
        Ownable(msg.sender)
    {
        _tokenIdCounter = 0;
        statsInitialized = false;
    }

    /**
     * @notice Initialize encrypted stats (called once after deployment)
     * @dev This is needed because FHE values cannot be initialized in constructor
     */
    function initializeStats() external onlyOwner {
        require(!statsInitialized, "Stats already initialized");

        // Initialize encrypted counters to 0
        encryptedTotalMints = FHE.asEuint32(0);
        FHE.allowThis(encryptedTotalMints);

        // Initialize all sign counters to 0
        for (uint8 i = 0; i < 12; i++) {
            encryptedSunSignCounts[i] = FHE.asEuint32(0);
            FHE.allowThis(encryptedSunSignCounts[i]);
        }

        statsInitialized = true;
    }

    /**
     * @notice Mint a birth chart NFT with encrypted birth data
     * @param encryptedYear Encrypted birth year
     * @param encryptedMonth Encrypted birth month
     * @param encryptedDay Encrypted birth day
     * @param encryptedHour Encrypted birth hour
     * @param encryptedMinute Encrypted birth minute
     * @param encryptedLat Encrypted latitude * 10000
     * @param encryptedLong Encrypted longitude * 10000
     * @param _metadataURI IPFS URI containing chart metadata
     * @param _sunSign Sun zodiac sign (1-12)
     * @param _moonSign Moon zodiac sign (1-12)
     * @param _risingSign Rising zodiac sign (1-12)
     * @return tokenId The ID of the minted token
     */
    function mintBirthChart(
        externalEuint16 encryptedYear,
        externalEuint8 encryptedMonth,
        externalEuint8 encryptedDay,
        externalEuint8 encryptedHour,
        externalEuint8 encryptedMinute,
        externalEuint32 encryptedLat,
        externalEuint32 encryptedLong,
        bytes calldata inputProof,
        string memory _metadataURI,
        uint8 _sunSign,
        uint8 _moonSign,
        uint8 _risingSign
    ) external returns (uint256) {
        require(!hasMinted[msg.sender], "Already minted a birth chart");
        require(bytes(_metadataURI).length > 0, "Metadata URI required");
        require(_sunSign >= 1 && _sunSign <= 12, "Invalid sun sign");
        require(_moonSign >= 1 && _moonSign <= 12, "Invalid moon sign");
        require(_risingSign >= 1 && _risingSign <= 12, "Invalid rising sign");

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        // Convert encrypted inputs to FHE types using fromExternal
        euint16 birthYear = FHE.fromExternal(encryptedYear, inputProof);
        euint8 birthMonth = FHE.fromExternal(encryptedMonth, inputProof);
        euint8 birthDay = FHE.fromExternal(encryptedDay, inputProof);
        euint8 birthHour = FHE.fromExternal(encryptedHour, inputProof);
        euint8 birthMinute = FHE.fromExternal(encryptedMinute, inputProof);
        euint32 latitude = FHE.fromExternal(encryptedLat, inputProof);
        euint32 longitude = FHE.fromExternal(encryptedLong, inputProof);

        // Allow contract to use these encrypted values
        FHE.allowThis(birthYear);
        FHE.allowThis(birthMonth);
        FHE.allowThis(birthDay);
        FHE.allowThis(birthHour);
        FHE.allowThis(birthMinute);
        FHE.allowThis(latitude);
        FHE.allowThis(longitude);

        // Allow token owner to access their encrypted data
        FHE.allow(birthYear, msg.sender);
        FHE.allow(birthMonth, msg.sender);
        FHE.allow(birthDay, msg.sender);
        FHE.allow(birthHour, msg.sender);
        FHE.allow(birthMinute, msg.sender);
        FHE.allow(latitude, msg.sender);
        FHE.allow(longitude, msg.sender);

        // Store encrypted birth data
        encryptedBirthData[tokenId] = EncryptedBirthData({
            birthYear: birthYear,
            birthMonth: birthMonth,
            birthDay: birthDay,
            birthHour: birthHour,
            birthMinute: birthMinute,
            latitude: latitude,
            longitude: longitude
        });

        // Mint NFT
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _metadataURI);

        // Store public chart data
        publicBirthCharts[tokenId] = PublicBirthChart({
            metadataURI: _metadataURI,
            mintTimestamp: block.timestamp,
            sunSign: _sunSign,
            moonSign: _moonSign,
            risingSign: _risingSign,
            hasEncryptedData: true
        });

        userToToken[msg.sender] = tokenId;
        hasMinted[msg.sender] = true;

        // Update encrypted aggregate stats using FHE computation
        if (statsInitialized) {
            // Increment total mints counter
            euint32 one = FHE.asEuint32(1);
            encryptedTotalMints = FHE.add(encryptedTotalMints, one);
            FHE.allowThis(encryptedTotalMints);

            // Increment sun sign counter (sunSign is 1-12, array is 0-11)
            uint8 signIndex = _sunSign - 1;
            encryptedSunSignCounts[signIndex] = FHE.add(encryptedSunSignCounts[signIndex], one);
            FHE.allowThis(encryptedSunSignCounts[signIndex]);

            emit StatsUpdated(_tokenIdCounter);
        }

        emit ChartMinted(
            msg.sender,
            tokenId,
            _metadataURI,
            _sunSign,
            _moonSign,
            _risingSign
        );

        return tokenId;
    }

    /**
     * @notice Get encrypted birth year for a token (only accessible by owner)
     * @param tokenId The token ID
     * @return Encrypted birth year
     */
    function getEncryptedBirthYear(uint256 tokenId) external view returns (euint16) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return encryptedBirthData[tokenId].birthYear;
    }

    /**
     * @notice Get encrypted birth month for a token
     * @param tokenId The token ID
     * @return Encrypted birth month
     */
    function getEncryptedBirthMonth(uint256 tokenId) external view returns (euint8) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return encryptedBirthData[tokenId].birthMonth;
    }

    /**
     * @notice Get encrypted birth day for a token
     * @param tokenId The token ID
     * @return Encrypted birth day
     */
    function getEncryptedBirthDay(uint256 tokenId) external view returns (euint8) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return encryptedBirthData[tokenId].birthDay;
    }

    /**
     * @notice Get encrypted time for a token
     * @param tokenId The token ID
     * @return hour Encrypted hour
     * @return minute Encrypted minute
     */
    function getEncryptedTime(uint256 tokenId)
        external
        view
        returns (euint8 hour, euint8 minute)
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return (
            encryptedBirthData[tokenId].birthHour,
            encryptedBirthData[tokenId].birthMinute
        );
    }

    /**
     * @notice Get encrypted coordinates for a token
     * @param tokenId The token ID
     * @return lat Encrypted latitude
     * @return long Encrypted longitude
     */
    function getEncryptedCoordinates(uint256 tokenId)
        external
        view
        returns (euint32 lat, euint32 long)
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return (
            encryptedBirthData[tokenId].latitude,
            encryptedBirthData[tokenId].longitude
        );
    }

    /**
     * @notice Calculate compatibility between two charts
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

        PublicBirthChart memory chart1 = publicBirthCharts[tokenId1];
        PublicBirthChart memory chart2 = publicBirthCharts[tokenId2];

        uint8 compatibilityScore = 50;

        // Sun sign compatibility (40 points)
        if (chart1.sunSign == chart2.sunSign) {
            compatibilityScore += 20;
        } else if (areCompatibleSigns(chart1.sunSign, chart2.sunSign)) {
            compatibilityScore += 30;
        } else if (areOpposingSigns(chart1.sunSign, chart2.sunSign)) {
            compatibilityScore += 15;
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

        if (compatibilityScore > 100) {
            compatibilityScore = 100;
        }

        return compatibilityScore;
    }

    /**
     * @dev Check if two zodiac signs are compatible (same element)
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
     * @notice Get public birth chart data for a token
     * @param tokenId The token ID
     * @return PublicBirthChart struct
     */
    function getBirthChart(uint256 tokenId) external view returns (PublicBirthChart memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return publicBirthCharts[tokenId];
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
     * @notice Update metadata URI (only token owner)
     * @param tokenId The token ID
     * @param newMetadataURI New IPFS URI
     */
    function updateMetadataURI(uint256 tokenId, string memory newMetadataURI) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(bytes(newMetadataURI).length > 0, "Invalid URI");

        _setTokenURI(tokenId, newMetadataURI);
        publicBirthCharts[tokenId].metadataURI = newMetadataURI;

        emit MetadataUpdated(tokenId, newMetadataURI);
    }

    /**
     * @notice Transfer encrypted data access on NFT transfer
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = super._update(to, tokenId, auth);

        // Transfer encrypted data access to new owner
        if (from != address(0) && to != address(0) && publicBirthCharts[tokenId].hasEncryptedData) {
            FHE.allow(encryptedBirthData[tokenId].birthYear, to);
            FHE.allow(encryptedBirthData[tokenId].birthMonth, to);
            FHE.allow(encryptedBirthData[tokenId].birthDay, to);
            FHE.allow(encryptedBirthData[tokenId].birthHour, to);
            FHE.allow(encryptedBirthData[tokenId].birthMinute, to);
            FHE.allow(encryptedBirthData[tokenId].latitude, to);
            FHE.allow(encryptedBirthData[tokenId].longitude, to);
        }

        return from;
    }

    /**
     * @notice Get encrypted total mints counter
     * @dev Only contract owner can decrypt this value
     * @return Encrypted total mint count
     */
    function getEncryptedTotalMints() external view returns (euint32) {
        require(statsInitialized, "Stats not initialized");
        return encryptedTotalMints;
    }

    /**
     * @notice Get encrypted count for a specific sun sign
     * @param signIndex Zodiac sign index (0-11)
     * @return Encrypted count for that sign
     */
    function getEncryptedSignCount(uint8 signIndex) external view returns (euint32) {
        require(statsInitialized, "Stats not initialized");
        require(signIndex < 12, "Invalid sign index");
        return encryptedSunSignCounts[signIndex];
    }

    /**
     * @notice Check if stats are initialized
     * @return bool true if initialized
     */
    function areStatsInitialized() external view returns (bool) {
        return statsInitialized;
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
