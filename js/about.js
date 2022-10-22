function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	


	
	//Lan Ngo Student ID 33278360
	//Extracting all the Date Objects and putting it inside a array containing the dates

	let sorted_date_array = tweet_array.map(function(n)
	{
		return n.time;
	})

	//https://masteringjs.io/tutorials/fundamentals/sort-by-date 
	//Sorting the date array from earliest to latest
	sorted_date_array.sort((date1, date2) => date1 - date2);

	const options = {year : 'numeric', month: 'long', day: 'numeric'};
	let earliest_Time = sorted_date_array[0].toLocaleDateString('en-US',options);
	let latest_Time = sorted_date_array[sorted_date_array.length-1].toLocaleDateString('en-US',options);
	
	$('#firstDate').text(earliest_Time);
	$('#lastDate').text(latest_Time);

	console.log(tweet_array);

	/*Tweet Categories
	create entirely new array (length 8000 whatever) only having source
	use filter function and store into each category
	find length of category
	use that to manipulate dom
	*/
	let source_array = tweet_array.map(function (n) {
		return n.source;
	});

	let completed_array_length = source_array.filter(function (n) {
		return n == 'completed_event'}).length;
		$('.completedEvents').text(completed_array_length);
		$('.completedEventsPct').text(math.format(completed_array_length/tweet_array.length*100, 4) + '%');

	let achieved_array_length = source_array.filter(function (n) {
		return n == 'achievement'}).length;
		$('.achievements').text(achieved_array_length);
		$('.achievementsPct').text(math.format(achieved_array_length/tweet_array.length*100, 4) + '%');

	let live_array_length = source_array.filter(function (n) {
		return n == 'live_event'}).length;
		$('.liveEvents').text(live_array_length);
		$('.liveEventsPct').text(math.format(live_array_length/tweet_array.length*100, 4) + '%');

	let misc_array_length = source_array.filter(function (n) {
		return n == 'miscellaneous'}).length;
		$('.miscellaneous').text(misc_array_length);
		$('.miscellaneousPct').text(math.format(misc_array_length/tweet_array.length*100, 4) + '%');

		/*User Written Tweet
		Remove #runkeeper and link at the end probably by finding the first https and then cutting it 
		also notice that All "Watch My" ends with Live
		set equal to Check it out! 
		repeat above steps to create new array length

		line 415 and 731 779 883 are written tweets
		red flags for bots: check it out, TomTom MySports Watch, Starts with Achieved
		*/

		
		//console.log(tweet_array[3]);
		let written_array = tweet_array.filter(function (n) {
		 return n.written == true;
		});
		/*console.log(written_array);
		let writtenTextArray = written_array.map(function (n) {
			return n.writtenText;
		});
		console.log(writtenTextArray);*/
		console.log(written_array);
		
		$('.written').text(written_array.length);
		$('.writtenPct').text(math.format(written_array.length/tweet_array.length*100, 4) + '%');


}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});