pragma solidity >=0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;
//import "./ProjectOffice.sol";
// SPDX-License-Identifier: MIT



contract MaterialProvider {

    address project;

    struct Materials{
        address materialId;
        bytes32 commandId;
        uint aluminiumBars;
        uint stainlessSteelSheets;
        uint bumperRubberBands;
        uint interiorLightBulbs;
        uint displaylEDs;
        uint springs;
        uint256 creation_date;
    }

    mapping(uint => Materials) public materials;
    mapping (bytes32 => bool) public addresses;

    constructor(address homies) public {
        project = homies;
    }

    uint public materialListCount = 0;

        function getMaterials1(uint index) public view returns (bytes32, uint, uint, uint ){

            require(materials[index].materialId != address(0), "List of material doesn't exist");
            return (materials[index].commandId, materials[index].aluminiumBars, materials[index].stainlessSteelSheets,materials[index].bumperRubberBands);
        }

        function getMaterials2(uint index) public view returns (uint, uint, uint, uint256){

            require(materials[index].materialId != address(0), "List of material doesn't exist");
            return (materials[index].interiorLightBulbs, materials[index].displaylEDs, materials[index].springs, materials[index].creation_date);
        }

        function getBool(address index, uint64 controllers, uint64 shafts, uint64 doors, uint64 buttons, uint64 displays) public view returns (bool){
            bytes32 commandId = getUniqueHash(index, controllers, shafts, doors, buttons, displays);
            return addresses[commandId];
        }

        function getUniqueHash(address index, uint64 controllers, uint64 shafts, uint64 doors, uint64 buttons, uint64 displays) public pure returns (bytes32){
            return keccak256(abi.encode(index,controllers, shafts, doors, buttons, displays));
        }

        function getAddress() public view returns (address){
            return msg.sender;
        }


     function createMaterials( address index, uint64 controllers, uint64 shafts, uint64 doors, uint64 buttons, uint64 displays ) public returns (uint){

                
        Materials memory new_material;

        bytes32 commandId = getUniqueHash(index, controllers, shafts, doors, buttons, displays);

        new_material.materialId = msg.sender;
        new_material.commandId = commandId;
        new_material.aluminiumBars = shafts*4;
        new_material.stainlessSteelSheets = shafts*6 + doors*2;
        new_material.bumperRubberBands = doors*2;
        new_material.interiorLightBulbs = shafts*4;
        new_material.displaylEDs = buttons + displays + controllers;
        new_material.springs = doors*2;
        new_material.creation_date = block.timestamp;
            
        materialListCount++;
        materials[materialListCount] = new_material;
        addresses[commandId] = true;

        return  materialListCount;
         }


}