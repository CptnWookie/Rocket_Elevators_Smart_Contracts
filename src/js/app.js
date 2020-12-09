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
    
      // Set the provider for our contract
      App.contracts.Materials.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    $.getJSON('ProjectOffice.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var ProjectOfficeArtifact = data;
      App.contracts.ProjectOffice = TruffleContract(ProjectOfficeArtifact);
    
      // Set the provider for our contract
      App.contracts.ProjectOffice.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-primary', App.handleMaterialsList);
  },

  markAdopted: function() {
    // var materialsInstance;

    // App.contracts.Materials.deployed().then(function(instance) {
    //   materialsInstance = instance;

    //   return materialsInstance.getMaterialList.call();
    // }).then(function(materials) {
    //   for (i = 0; i < materials.length; i++) {
    //     if (materials[i].materialId !== '0x0000000000000000000000000000000000000000') {
    //       $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
    //     }
    //   }
    // }).catch(function(err) {
    //   console.log(err.message);
    // });
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

function getCommandInfos(item) {

  document.getElementById("controllers").textContent = item.Controllers;
  document.getElementById("shafts").textContent = item.Shafts;
  document.getElementById("doors").textContent = item.doors;
  document.getElementById("buttons").textContent = item.Buttons;
  document.getElementById("displays").textContent = item.Displays;

  toggleActive(this)
}


$(function() {
  $(window).load(function() {
    App.init();

      App.contracts.ProjectOffice.deployed().then(function(instance) {
        projectInstance = instance;
      
      return projectInstance.componentsCount().call();
      }).then(function (error, count) {

          if (error)
              console.log(error)
          else {
              for (var i = 0; i < count; i++) {  
                      var component = projectInstance.getComponents(count).call();
                      addItemToList(component.componentId, "command-list", getCommandInfos(component))
              }

          }
    });
  


  });
});
