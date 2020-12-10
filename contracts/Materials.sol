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
    
    uint public materialListCount = 0 ;

        function getMaterials1(uint index) public view returns (address, uint, uint, uint){
            return (materials[index].materialId, materials[index].aluminiumBars, materials[index].stainlessSteelSheets,materials[index].bumperRubberBands);
        }
        function getMaterials2(uint index) public view returns (uint, uint, uint, uint256){
            return (materials[index].interiorLightBulbs, materials[index].displaylEDs, materials[index].springs, materials[index].creation_date);
        }

     function createMaterials( uint64 controllers, uint64 shafts, uint64 doors, uint64 buttons, uint64 displays ) public returns (Materials memory){

        
         uint64 aluminiumBars = shafts*4;
         uint64 stainlessSteel = shafts*6 + doors*2;
         uint64 rubber = doors*2;
         uint64 lightBulbs = shafts*4;
         uint64 lEDs = buttons + displays + controllers;
         uint64 springs = doors*2;
         uint256 creation_date = block.timestamp;
        
         Materials memory new_material = Materials(msg.sender, aluminiumBars, stainlessSteel, rubber, lightBulbs, lEDs, springs, creation_date);
        
        materialListCount++;
        materials[materialListCount] = new_material;

        return  new_material;
         }
}