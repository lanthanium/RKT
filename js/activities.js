function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	let completed_array = tweet_array.filter(function(n) {
		return n.source == 'completed_event';
	})

	let activity_array = completed_array.map(function(n) {
		return n.activityType;
	})

	let activity_object = activity_array.reduce(function(obj, item) {
		if (!obj[item]) obj[item]=0;
		obj[item]++;
		return obj;
	}, {});
		
	
	//changing the activites HTML to reflect number of different activities 
	$('#numberActivities').text(Object.keys(activity_object).length);
	
	
	
	/*console.log(completed_array.map(function(n) {
		return n.activityType;
	})); */


 	//https://stackoverflow.com/questions/1069666/sorting-object-property-by-values
	//sorting the activity object above by amoutn of popularity
	let sorted_activity_array = [];
	for (let activity in activity_object)
	{
		sorted_activity_array.push([activity, activity_object[activity]]);
	}
	sorted_activity_array.sort(function(a, b)
	{
		return b[1] - a[1];
	});


	//updating the activities html to reflect the three most popular activities
	$('#firstMost').text(sorted_activity_array[0][0]);
	$('#secondMost').text(sorted_activity_array[1][0]);
	$('#thirdMost').text(sorted_activity_array[2][0]);



	//calculating the average distance of the three most popular activities
	let mostPopularDistance = 0, secondPopularDistance = 0, thirdPopularDistance = 0;


	//first determine the total distance of the three most popular activities accumulated by everyone
	completed_array.forEach(element =>
		{
			if (element.activityType == sorted_activity_array[0][0]
				 && !isNaN(element.distance)) mostPopularDistance += element.distance;
			if (element.activityType == sorted_activity_array[1][0]
				 && !isNaN(element.distance)) secondPopularDistance += element.distance;
			if (element.activityType == sorted_activity_array[2][0]
				 && !isNaN(element.distance)) thirdPopularDistance += element.distance;
		})

	//pushing the average distances of the three activities and then pushing them inside the array 
	sorted_activity_array[0].push(mostPopularDistance/sorted_activity_array[0][1]);
	sorted_activity_array[1].push(secondPopularDistance/sorted_activity_array[1][1]);
	sorted_activity_array[2].push(thirdPopularDistance/sorted_activity_array[2][1]);


	let week_array = [];
	for (let i = 0; i < tweet_array.length; i++)
	{
		if (!isNaN(tweet_array[i].distance)
		&&	(tweet_array[i].activityType == sorted_activity_array[0][0]
		||  tweet_array[i].activityType == sorted_activity_array[1][0]
		||  tweet_array[i].activityType == sorted_activity_array[2][0]))
		{
			week_array.push(
				{
					"Day": tweet_array[i].createdAt.substring(0,3), 
					"Activity": tweet_array[i].activityType, 
					"Distance (miles)" : tweet_array[i].distance
				});
		}
	} 
	
	console.log(activity_object);

	let avg_distance_array = [];

	//creating a new array with only the three activites that are named alongside their average distance
	for (let i = 0; i < 3; i++)
	{
		avg_distance_array.push(sorted_activity_array[i]);
	}	
	//sorting the array by average distance, from largest to smallest
	avg_distance_array.sort(function(a, b)
	{
		return b[2] - a[2];
	});
	//updating the activites.html file to update what people did the activities longest and shortest
	$('#longestActivityType').text(avg_distance_array[0][0]);
	$('#shortestActivityType').text(avg_distance_array[2][0]);

	//creating two separate arrays, one for weekday and one for weekend
	let weekday_array = tweet_array.filter(function(n)
	{
		return (n.weekDayEnd == "Weekday" && !isNaN(n.distance));
	});

	let weekend_array = tweet_array.filter(function(n)
	{
		return (n.weekDayEnd == "Weekend" && !isNaN(n.distance));
	});


	//determining the total distance travelled in the weekend, and the weekday
	let total_weekend_distance = 0, total_weekday_distance = 0;
	weekend_array.forEach(function(n)
	{
		total_weekend_distance += n.distance;
	})

	weekday_array.forEach(function(n)
	{
		total_weekday_distance += n.distance;
	})

	//dividing the total weekend/weekday distance by the total amount of people aka the array length
	//of each respective array
	average_weekend_length = (total_weekend_distance/weekend_array.length);
	average_weekday_length = (total_weekday_distance/weekday_array.length);
	

	//updating the activities.html to reflect weekend or weekday depending on which average value 
	//is bigger 
	if (average_weekend_length > average_weekday_length) 
	$('#weekdayOrWeekendLonger').text("weekends");
	else
	$('#weekdayOrWeekendLonger').text("weekdays");

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	
	//https://www.freecodecamp.org/news/how-to-clone-an-array-in-javascript-1d3183468f6a/
	const vega_array1 = JSON.parse(JSON.stringify(sorted_activity_array));
	for (let i = 0; i < 3; i++)
	{
		vega_array1[i].pop();
	}
	

	//https://stackoverflow.com/questions/62228654/using-2d-array-data-instead-of-table-in-vega-lite
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {"values":  {"data": vega_array1}},
	  "transform": [
		{"flatten": ["data"]},
		{"calculate": "datum.data[0]", "as": "Activities"},
		{"calculate": "datum.data[1]", "as": "Number of Tweets"}
	  ],
	  "mark": "bar",
	  "encoding": {
		"x": {"field": "Activities", "type": "nominal"},
		"y": {"field": "Number of Tweets", "type": "quantitative"}
	  }
	
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

//https://vega.github.io/vega-lite/docs/sort.html#specifying-custom-sort-order
//https://vega.github.io/vega-lite/docs/legend.html#symbols 
	distance_vis_spec = {
		"height": 500,
		"width": 500,
		"config": {"axis": {"grid": "true", "gridColor": "#dedede"}},
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": week_array
		},
		"mark": "point",
		"encoding": {
		  "x": {
			"field": "Day", 
			"type": "ordinal",
			"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
		},
		  "y": {
			"field": "Distance (miles)", 
		 	"type": "quantitative",
			"DistanceUnit": "Miles",
		},
		"color": {"field": "Activity", "type": "nominal"},
		"shape": {"field": "Activity", "type": "nominal"}
		}
	  
		//TODO: Add mark and encoding
		//need to create a week array, (x axis is the days), (y axis) is the distance
	  };
	  
	  average_distance_vis_spec = {
		"height": 500,
		"width": 500,
		"config": {"axis": {"grid": "true", "gridColor": "#dedede"}},
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": week_array
		},
		"mark": "point",
		"encoding": {
		  "x": {
			
			"field": "Day", 
			"type": "ordinal",
			"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
		},
		  "y": {
			"aggregate": "mean",
			"field": "Distance (miles)", 
		 	"type": "quantitative",
			"DistanceUnit": "Miles",
		},
		"color": {"field": "Activity", "type": "nominal"},
		"shape": {"field": "Activity", "type": "nominal"}
		}
	  
		//TODO: Add mark and encoding
		//need to create a week array, (x axis is the days), (y axis) is the distance
	  };

	const node = document.createElement("br");
	let meanActivityButton = document.querySelector('#aggregate');  
	let distanceNode = document.getElementById("distanceVis");
	let averageNode = document.getElementById("distanceVisAggregated");

	//By default the page is showing the distanceVisualization
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
	

	//this is to create a linebreak between the button and the graph
	distanceNode.insertAdjacentElement("beforebegin", node);
	
	/*function switchGraph for when the button is pressed, it will change the HTML page and 
	  alternate the between graphs depending on if the button is saying "Show means" or
	  "Show all activities"
	*/
	function switchGraph()
	{
		if (meanActivityButton.textContent == "Show means")
		{
		meanActivityButton.textContent = "Show all activities";
		distanceNode.innerHTML = "";
		vegaEmbed('#distanceVisAggregated', average_distance_vis_spec, {actions:false});			
		}

		else
		{
		meanActivityButton.textContent = "Show means"
		averageNode.innerHTML = "";
		vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
		}
	}
	  
	  
	meanActivityButton.addEventListener('click', switchGraph);

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}



//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});






/*


	//console.log(sorted_activity_array);
	//let sample_data = [[1, 10], [3, 6], [5, 0], [9, 4], [11, 2]];
	//console.log(sample_data);
	console.log(sorted_activity_array);
	console.log(Object.values(activity_object));
	console.log(activity_object);
	console.log(activity_object['bike']);

	//distanceNode.innerHTML = vegaEmbed('#distanceVis', distance_vis_spec, {actions:false}); 
	let amount_of_activities = [];
	activity_array.forEach(item => 
		{if (!amount_of_activities.includes(item)) amount_of_activities.push(item)});

		
		
		console.log(completed_array.filter(function (n) {
		return n.text.includes('workout');
	})) */

