pragma solidity ^0.4.24;

import "./contest.sol";


contract TestContest is Contest {
    //function to compare 2 
   	function  testAddContestant () public{
		bytes32 tname  = "abc"; //test name
		addContestant("abc");
		Contestant storage tmp = contestants[contestantsCount];

		require (tmp.id == contestantsCount,"The Id is not correct for contestant with name : abc");
		require (tmp.name == tname,"The Name is not correct name should had been abc" );
		require (tmp.voteCount == 0,"The number of votes is not correctly intialized for abc" );
	}

	function testVote () public{
		uint tid = 0;//testid
		address sender = 0xDd2d1e8C04672CBdb34e04dDf621efd96f13150B;
		addContestant("xyz");// So there is atleast 1 entry to check function working
		uint intval = contestants[tid].voteCount;
		doVote(sender,tid);
		require (intval+1 == contestants[tid].voteCount,"The vote count did not increased");
		require (voters[sender] == true,"The voter is marked");
	}
	
	
}

