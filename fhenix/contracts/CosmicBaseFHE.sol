// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@fhenixprotocol/cofhe-contracts/FHE.sol";

contract CosmicBaseFHE {
    struct EncryptedProfile {
        euint8 month;
        euint8 day;
        euint16 year;
        euint8 hour;
        euint8 element;  // 0:Wood 1:Fire 2:Earth 3:Metal 4:Water
        euint8 zodiac;   // 0-11 (Aries-Pisces)
        bool exists;
    }

    mapping(address => EncryptedProfile) private profiles;
    
    event ProfileCreated(address indexed user);

    function storeProfile(
        InEuint8 memory _month,
        InEuint8 memory _day,
        InEuint16 memory _year,
        InEuint8 memory _hour,
        InEuint8 memory _element,
        InEuint8 memory _zodiac
    ) external {
        euint8 month = FHE.asEuint8(_month);
        euint8 day = FHE.asEuint8(_day);
        euint16 year = FHE.asEuint16(_year);
        euint8 hour = FHE.asEuint8(_hour);
        euint8 element = FHE.asEuint8(_element);
        euint8 zodiac = FHE.asEuint8(_zodiac);

        FHE.allowThis(month);
        FHE.allowThis(day);
        FHE.allowThis(year);
        FHE.allowThis(hour);
        FHE.allowThis(element);
        FHE.allowThis(zodiac);
        
        FHE.allowSender(month);
        FHE.allowSender(day);
        FHE.allowSender(year);
        FHE.allowSender(hour);
        FHE.allowSender(element);
        FHE.allowSender(zodiac);

        profiles[msg.sender] = EncryptedProfile(month, day, year, hour, element, zodiac, true);
        emit ProfileCreated(msg.sender);
    }

    function getProfile(address user) external view returns (
        euint8, euint8, euint16, euint8, euint8, euint8
    ) {
        require(profiles[user].exists, "No profile");
        EncryptedProfile storage p = profiles[user];
        return (p.month, p.day, p.year, p.hour, p.element, p.zodiac);
    }

    function hasProfile(address user) external view returns (bool) {
        return profiles[user].exists;
    }

    function checkCompatibility(address partner) external returns (euint8) {
        require(profiles[msg.sender].exists && profiles[partner].exists, "Both need profiles");
        
        ebool sameElement = FHE.eq(profiles[msg.sender].element, profiles[partner].element);
        euint8 score70 = FHE.asEuint8(70);
        euint8 score85 = FHE.asEuint8(85);
        
        euint8 result = FHE.select(sameElement, score70, score85);
        FHE.allowSender(result);
        return result;
    }
}
