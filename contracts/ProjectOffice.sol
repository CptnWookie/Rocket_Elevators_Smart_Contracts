pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: MIT
contract ProjectOffice {
    Components[] components;
    address requester;

    struct Components {
        uint64 Controllers;
        uint64 Shafts;
        uint64 Doors;
        uint64 Buttons;
        uint64 Displays;
    }

    function getComponents() public view returns (Components[] memory){
        return components;
    }
    //Emma
    // addComponents by requester with input from the Order
    function addComponents(uint64 Batteries, uint64 Columns, uint64 Elevators, uint64 Floors) public
    {
        Components memory m;
        m.Shafts = Elevators;
        m.Controllers = Batteries;
        m.Doors = (Elevators * 2) + (Floors * 2);
        m.Buttons = (Elevators * 8) + (Columns * 16);
        m.Displays = Elevators;
        components.push(m);
        // Get the order details by orderNumber call
        components.push(m);
    }
}