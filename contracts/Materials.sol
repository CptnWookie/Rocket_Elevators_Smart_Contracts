pragma solidity >=0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;
import "./ProjectOffice.sol";
// SPDX-License-Identifier: MIT



contract MaterialProvider {

    struct Materials{
        address materialId;
        uint aluminiumBars;
        uint stainlessSteelSheets;
        uint bumperRubberBands;
        uint interiorLightBulbs;
        uint displaylEDs;
        uint springs;
        uint256 creation_date;
    }

    mapping(uint => Materials) materials;
    mapping (address => bool) addresses;

    uint public materialListCount = 0 ;

        function getMaterials1(uint index) public view returns (address, uint, uint, uint){
            return (materials[index].materialId, materials[index].aluminiumBars, materials[index].stainlessSteelSheets,materials[index].bumperRubberBands);
        }
        function getMaterials2(uint index) public view returns (uint, uint, uint, uint256){
            return (materials[index].interiorLightBulbs, materials[index].displaylEDs, materials[index].springs, materials[index].creation_date);
        }
        function getBool(address index) public view returns (bool){
            return addresses[index];
        }

     function createMaterials( address index, uint64 controllers, uint64 shafts, uint64 doors, uint64 buttons, uint64 displays ) public returns (uint){

                
        Materials memory new_material;

        new_material.materialId = msg.sender;
        new_material.aluminiumBars = shafts*4;
        new_material.stainlessSteelSheets = shafts*6 + doors*2;
        new_material.bumperRubberBands = doors*2;
        new_material.interiorLightBulbs = shafts*4;
        new_material.displaylEDs = buttons + displays + controllers;
        new_material.springs = doors*2;
        new_material.creation_date = block.timestamp;
            
        materialListCount++;
        materials[materialListCount] = new_material;
        addresses[index] = true;

        return  materialListCount;
         }
}