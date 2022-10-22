class Tweet {
	private text:string;
	time:Date;
    createdAt: string;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
        this.createdAt = tweet_time;
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.toUpperCase().startsWith('JUST COMPLETED') || 
            this.text.toUpperCase().startsWith('JUST POSTED')) return 'completed_event';

        if (this.text.toUpperCase().includes('ACHIEVE') || 
            this.text.toUpperCase().includes('MET MY')) return 'achievement';

        if (this.text.toUpperCase().includes('WATCH MY') || 
        this.text.toUpperCase().includes('RIGHT NOW')) return 'live_event';

        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.text.toUpperCase().includes('CHECK IT OUT!')) return false;
        if (this.text.toUpperCase().startsWith('ACHIEVE')) return false;
        if (this.text.toUpperCase().includes('TOMTOM')) return false;
        if (this.text.toUpperCase().startsWith('WATCH MY')) return false;
        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        let protocol_index = this.text.indexOf('https'); //defines index of when https first appears 
        let no_https_text = this.text.slice(0, protocol_index); //excluding any text after https      
        let dash_index = no_https_text.indexOf('-'); //defines index of when '-' appears
        let human_text = no_https_text.slice(dash_index, no_https_text.length-1); //removes anything before the - in the string
        return human_text;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //assigning this.text to a local text string
        let text: string = this.text;

        //modifying the text string to replace all the automated key words
        text = text.replace('Just completed a', '');
        text = text.replace('Just posted an', '');
        text = text.replace('Just posted a', '');

        //modifying the text to remove anything after "with " and "-" since those are just automated words
        if (text.includes('-')) text = text.substring(0, text.indexOf('-'));
        if (text.includes('with ')) text = text.substring(0, text.indexOf('with'));

        //text.trim here

        //https://bobbyhadz.com/blog/javascript-remove-all-numbers-from-string
        //removing all digits from the string using regex, and then removing special characters
        text = text.replace(/\d/g, '');
        text = text.replaceAll(':', '');
        text = text.replaceAll('.', '');
        text = text.replace(' in', '');
        text = text.trim();

        //removing the word workout if it appears
        if (text.includes('workout')) text = text.substring(0, text.indexOf('workout')-1);

        //finally removing all distance units
        text = text.replace('km ', '');
        text = text.replace('mi ', '');

        return text;
        //TODO: parse the activity type from the text of the tweet
    }


    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        //cut out later half of text
        //use regular expression to find numerical values and return it to distance
        //https://www.youtube.com/watch?v=lpWgcsggrjQ 
        let reg = /\d+\.*\d*/g;
        let result = this.text.slice(0,40).match(reg);
        if (result == null) return 0;
        let distanceNumber = Number(result);
        if (this.text.slice(0,40).includes('km'))
        {
            let distanceMiles = distanceNumber/1.609; 
            return Number(distanceMiles.toFixed(2));
        }
        return distanceNumber;
    }

    //here i created a new getter to extract the string from createdAt in the .json file
    get weekDayEnd():string{
        if (this.createdAt.includes('Sat') || this.createdAt.includes('Sun')) return "Weekend";
        else return "Weekday";
        
    }

    

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        let textArray = this.text.split(' ');
        let linkedTweet = '';
        textArray.forEach(function(i)
        {
            if (i.includes('https')) linkedTweet += '<a href=' + i + '>' + i + '</a>' + ' ';
            else linkedTweet += i + ' ';
        })

        return '<tr>' + '<td>' + rowNumber + '</td>' 
                      + '<td>' + this.activityType + '</td>'
                      + '<td>' + linkedTweet + '</td>' + 
                '</tr>';
    }
}