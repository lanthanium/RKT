global_array = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	
	//copied the tweet_array into a global array so that it's accesible by other functions
	//global_array=JSON.parse(JSON.stringify(tweet_array));
	global_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	console.log(global_array[0].getHTMLTableRow(3));
	
	//testing.innerHTML = textLink;
	//TODO: Filter to just the written tweets
	$('#textFilter').on("keyup", addEventHandlerForSearch);
		
}


function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table

	//mirrors back what you typed
	$('#searchText').html(document.querySelector('#textFilter').value);
	
	//If statements check if the searchbox is empty, if it is, empty the table
	if (document.querySelector('#textFilter').value != '') $('#tweetTable').empty();

	//defining a counter to count how many tweets match the search
	let counter = 0;
	let tweetTable = document.querySelector('#tweetTable');
	//let tempNode = document.createElement('div');

	//everytime the eventhandler is called, the entire tweet database will be iterated
	global_array.forEach(function(i)
	{
		//if the search bar characters match anything in the database
		if (i.text.toUpperCase().includes(document.querySelector('#textFilter').value.toUpperCase()))
		{
			counter++;
			
			let newRow = document.createElement('tr');
			tweetTable.appendChild(newRow);
			newRow.innerHTML = i.getHTMLTableRow(counter);

			//console.log(i.getHTMLTableRow(counter));
			
			//creating a new row and populating it
			/*
			let newRow = document.createElement("tr");
			let rowNumber = document.createElement("td");
			let rowActivity = document.createElement("td");
			let rowTweet = document.createElement("td");
			
			newRow.appendChild(rowNumber);
			rowNumber.insertAdjacentElement("afterend", rowActivity);
			rowActivity.insertAdjacentElement("afterend", rowTweet);
			tweetTable.appendChild(newRow);
			rowNumber.innerHTML = counter;
			rowActivity.innerHTML = i.activityType;

			let textArray = i.text.split(" ");
			let linkText = "";
			textArray.forEach(function(i)
			{
				if (i.includes('https')) linkText += '<a href=' + i + '>' + i + '</a>' + ' ';
				else linkText += i + ' ';
			})
			*/

			//rowTweet.innerHTML = linkText;

			//rowTweet.innerHTML = i.text;
			/*
			rowTweet.innerHTML = i.text.substring(0, i.text.search('https')) + '<a href=' + 
			i.text.substring(i.text.search('https'), i.text.lastIndexOf('#Runkeeper')) + '>' + 
			i.text.substring(i.text.search('https'), i.text.lastIndexOf('#Runkeeper')) + '</a>' +
			i.text.substring(i.text.lastIndexOf('#Runkeeper'), i.text.length);*/


			/* THIS METHOD WORKS SO FAR
			rowTweet.innerHTML = i.text.substring(0, i.text.search('https')) + '<a href=' + 
			i.text.substring(i.text.search('https'), i.text.indexOf(' ', i.text.search('https'))) + '>' + 
			i.text.substring(i.text.search('https'), i.text.indexOf(' ', i.text.search('https'))) + '</a>' +
			i.text.substring(i.text.indexOf(' ', i.text.search('https')), i.text.length);*/

		} 
		//do something with i.getHTMLTableRow(counter)
		/*
		iterate through every single tweet
		if tweet has that text just at least once, add  1 to counter (no duplicates) 
		take the current number of counter pass it to getHTML 
		and display it to the # column of the table (this will be your row)
		take the activity type of what you just iterated through, display it in the activity type column
		take the text and display it in the tweet column part of the row
		*/

	})

	//updates the search count with a counter
	$('#searchCount').html(counter);

	if (document.querySelector('#textFilter').value == '')
	{
		$('#tweetTable').empty();
		$('#searchCount').html('0');
	}
}



//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});



/*PSEUDOCODE

first make "" reflect what you just type 
You type in something to search box (event listerner keydown)??
Program takes whatever you input
Create a counter
iterate through every single tweet
	if tweet has that text just at least once, add  1 to counter (no duplicates) 
		take the current number of counter pass it to getHTML 
		and display it to the # column of the table (this will be your row)
		take the activity type of what you just iterated through, display it in the activity type column
		take the text and display it in the tweet column part of the row

after iteration of the dataset, you should have a cumulated total in the counter



getHTMLTableRow is a function of the class tweet, that takes a number parameter and spits back out a string
STEPS:
searching up "rain"



	/*
	<tr>
	<td>1</td>
	<td>run</td>
	<td>just finished my run</td>
  	</tr>
	*/


//• jQuery includes many utility functions to simplify syntax
//check if an item is in an array
//$.inArray(4, [3,4,3] ); 

