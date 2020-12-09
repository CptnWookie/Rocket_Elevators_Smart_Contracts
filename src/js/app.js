var App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load materials.
    $.getJSON('../materials.json', function(data) {
      var materialsRow = $('#materialsRow');
      var materialsTemplate = $('#materialsTemplate');

      for (i = 0; i < data.length; i ++) {
        materialsTemplate.find('.panel-title').text(data[i].name);
        materialsTemplate.find('img').attr('src', data[i].picture);
        materialsTemplate.find('.materials-sku').text(data[i].sku);
        materialsTemplate.find('.materials-quantity').text(data[i].quantity);
        materialsTemplate.find('.materials-brand').text(data[i].brand);
        materialsTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        materialsRow.append(materialsTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

        return App.initContract();
      },

  initContract: function() {
    $.getJSON('MaterialProvider.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var MaterialsArtifact = data;
      
      App.contracts.Materials = TruffleContract(MaterialsArtifact);
      console.log(App.contracts.Materials);    
      // Set the provider for our contract
      App.contracts.Materials.setProvider(App.web3Provider);

      App.contracts.Materials.deployed().then(function(instance) {

        return console.log("MATERIAL PROVIDER");
      })


    
      // Use our contract to retrieve and mark the adopted pets
      //return App.markAdopted();
    }).done( function() {

    $.getJSON('ProjectOffice.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var ProjectOfficeArtifact = data;
      App.contracts.ProjectOffice = TruffleContract(ProjectOfficeArtifact);
      App.contracts.ProjectOffice.setProvider(App.web3Provider);
      
        return App.setInitialCommands();
           
      });
    });

    return App.bindEvents();
  },

  bindEvents: function() {
   // $(document).on('click', '.btn-primary', App.handleMaterialsList);
  },

  setInitialCommands: function() {

    App.contracts.ProjectOffice.deployed().then(async function (instance) {
      
      var projectInstance = instance;
      var count = await projectInstance.componentsCount();

      var item = [count, projectInstance]

      return await item
    }).then(async function(item){

      for (var i = 0; i < item[0]; i++) {  
        var component = await item[1].getComponents(i);
        addItemToList(component[0], "command-list", function() {getCommandInfos(component[1],component[2],component[3],component[4],component[5])});
        //addItemToList(component[0], "command-list", function() { console.log("BRAPBRAP")});
          }
        })
  },

  handleMaterialsList: function(event) {
    event.preventDefault();

    var materialsId = parseInt($(event.target).data('id'));

    var materialsInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Materials.deployed().then(function(instance) {
        materialsInstance = instance;

        // Execute adopt as a transaction by sending account
        return materialsInstance.adopt(materialsId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

function getCommandInfos(item1, item2, item3, item4, item5) {
  console.log("BRAPBRAP");
  console.log(item1);
  console.log("BRAPBRAP");
  document.getElementById("controllers").value = item1;
  document.getElementById("shafts").value = item2;
  document.getElementById("doors").value = item3;
  document.getElementById("buttons").value = item4;
  document.getElementById("displays").value = item5;

 // toggleActive(this)
}

  function addItemToList(item, list_name, click_function) {
  var element = document.createElement("a")
  element.textContent = item
  element.classList.add("collection-item")
 // console.log("###################")
  //console.log(click_function);
 // console.log("########################")
  //element.addEventListener("click", console.log("BRAPBRAP"))
  element.onclick = function() { click_function()};
  document.getElementById(list_name).appendChild(element)
}

function create_material(controllers, shafts, doors, buttons, displays){

  if(controllers != null && shafts != null && doors != null && buttons != null && displays != null){

    App.contracts.ProjectOffice.deployed().then(async function (instance) {
      
    var projectInstance = instance;
    return await projectInstance.createMaterials(controllers, shafts, doors, buttons, displays);

  }).then( function(count){
    console.log("################");
    console.log(count);
    console.log("#####################");
  });
  }
}

$(function() {
  $(window).load(function() {
    App.init();

    var controllers = document.getElementById("controllers").value;
    var shafts = document.getElementById("shafts").value;
    var doors = document.getElementById("doors").value;
    var buttons = document.getElementById("buttons").value;
    var displays = document.getElementById("displays").value;
    
    $("#build-material").addEventListener(".onclick", console.log("BRAPBRAP"))//.onclick = function(){ console.log("HELLO")}; //{ create_material(controllers, shafts, doors, buttons, displays)};


  });
});
