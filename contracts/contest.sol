pragma solidity ^0.4.24;

//migrations directory contains things of the previous version or application or other platform to blockchain deployment
//node modules contains all the dependencies
//src web app folder which contains app for user
//test use for testing app

//Creating contract
contract Contest {
	//declaring variables
	struct Contestant{
		uint id;// unsigned
		string name;
		uint voteCount;
	}
	// map is used 
	mapping(uint => Contestant) public contestants;
	//	 is a key for a contestant object in the map
	//To save the list of users/accounts  who already casted vote
	mapping(address => bool) public voters;
	// number of contestants is stored in a variable as map.size() is not avaiable
	uint public contestantsCount;

	event votedEvent (
		uint indexed _contestantId
	);
	// function to add contestant;
	constructor() public {
		addContestant("Tom");
		addContestant("Jerry");
	}
	function addContestant (string _name) public {
		//name starts with _ because it is private variable
		contestantsCount++;
		contestants[contestantsCount] = Contestant(contestantsCount,_name,0);

	}

	function vote (uint _contestantId) public{
		//restricting the person who already casted the vote
		require(!voters[msg.sender]);
		require(_contestantId > 0 && _contestantId <= contestantsCount );
		
		contestants[_contestantId].voteCount ++;
		voters[msg.sender] = true;
		//msg.sender is metadata the address of the user who casted the vote
		emit votedEvent(_contestantId);


	}

	//declaring contructor
	
	// get and set functions not required to be set explicitily
	// because solidity do it for us
	// In command prompt to run use "truffle migrate"
	// in node js command prompt
	/*
	if problem in building delete the json files
	way to access from the network
	put "truffle console"
	It is use to get JS promise
	like

	contest.deployed().then(function(instance){ app = instance })
	
	it should be in a single line

	after running this the "app" has instance of class
	Contest
	app.contestant() gives 'Tom' output in command prompt
	app.address gives current address in which we joined
	each deployment cost some ether to pay to miners
	
	structure of contestant is made (it is same as class without contructor)
	
	app.contestants(1)
	It give instance of contestants map at key 1
	app.contestantsCount()
	number of contestants

	data is saved in the blockchain network not in single computer
	to initialize we have to use callback of JS promise func for that like we put instance in app

	make variable of contestant
	app.contestants(1).then{function(c) { contestant  = c }}

	to access the id
	contestant[0]

	to get in normal form
	contestant[0].toNumber()

	web3 js used for frontend
	web3.eth.accounts
	It gives all accounts in Blockchain
	their address
	web3.eth.accounts[1]
	it gives a single address

	mocha and chai use for testing
	



	*/

}