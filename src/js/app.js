/*
steps to run app 
first migrate smart contract into ganche
then use
"npm run dev"
to run a lite server and app runs on it but without connection with blockchain
Then use metamask to connect site with blockchain
put password simple for demonstration "123456"
right click chrome and click inspect to get errors
To change user simply add private key of the user to metamask "import account option"
private key can be copied from ganache
*/
App = {
  web3Provider: null,
  contracts: {},
  account: 0x0 ,

  init: function() {
  
    return App.initWeb3();
  },

  initWeb3: function() {
    /*
     * Replace me...
     connections between blockchain and webapp
     META MASK connects browser to blockchain
     */

     if(typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);

    } else{
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
      // 
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Contest.json",function(contest){
     //contest.json contains compiled version of contest.sol 
     // Instantiate a new truffle contract from the artifact
     App.contracts.Contest = TruffleContract(contest);
     // Connect provider to interact with contract
     App.contracts.Contest.setProvider(App.web3Provider); 
     App.listenForEvents();
    return App.render();
    });
  },
// loader = $("#loader") it stores element with id loader
// getCoinbase gives current blockchain account
  listenForEvents: function(){
    App.contracts.Contest.deployed().then(function(instance) {
      //subscription for the votedEvent
      instance.votedEvent({},{
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error,event) {
          console.log("Event triggerd ",event);
          //action to be done if event is triggered
          App.render();
      });
      //syntax for event listener
    });
  },
  render: function() {
    var contestInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Contest.deployed().then(function(instance) {
      contestInstance = instance;
      return contestInstance.contestantsCount();
    }).then(function(contestantsCount) {
      var contestantsResults = $("#contestantsResults");
      contestantsResults.empty();

      var contestantsSelect = $('#contestantsSelect');
      contestantsSelect.empty();

      for (var i = 1; i <= contestantsCount; i++) {
        contestInstance.contestants(i).then(function(contestant) {
          var id = contestant[0];
          var name = web3.toAscii(contestant[1]);
          var voteCount = contestant[2];

          // Render contestant Result
          var contestantTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          contestantsResults.append(contestantTemplate);

          // Render candidate voting option
          var contestantOption = "<option value='" + id + "' >" + name + "</ option>"
          contestantsSelect.append(contestantOption);

        });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var contestantId = $('#contestantsSelect').val();
    App.contracts.Contest.deployed().then(function(instance) {
      return instance.vote(contestantId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }


};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
