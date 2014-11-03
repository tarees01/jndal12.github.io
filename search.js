// Search for a specified string.
function search() {
  var q = $('#query').val();
  var request = gapi.client.youtube.search.list({
    type: 'video',
    q: q,
    part: 'snippet' 
  });

  request.execute(function(response) {
    if ('error' in response) {
      var vidbar = document.getElementById("vidbar");
      var entry = document.createElement("div");
      var text = document.createTextNode("Error: invalid search. Please search another topic.");
      entry.className = "error";
      entry.appendChild(text);
      vidbar.appendChild(entry);
    }
    else {
      var str = JSON.stringify(response.result);
      localStorage.setItem('str', str);
      var array= JSON.parse(str);
      createList(array);
      }
    });
}

var searchWikipedia = function(currentTerm){
var url = "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=";
$.ajax({
url: url + currentTerm,
type: 'GET',
dataType: 'jsonp',
error: function(data){
console.log("We got problems");
console.log(data.status);
},
success: function(data){
console.log("WooHoo!");
//Check the browser console to see the returned data
console.log(data);
//Use jQuery to insert the search term into the appropriate DOM element
//The data we want is the first item in the returned JSON, hence value "0"
$("#searchTerm").html(data[0]);
//The data we want is the second item in the returned JSON, hence value "1"
//Create a var to save the array of search results
var searchResults = data[1];
//Loop through the array of results
for (var i = 0; i < searchResults.length; i++){
//Use 'replace' and a regular expression to substitue white space with '_' character
var resultTerms = searchResults[i].replace(/\s/g, '_');
var curURL = 'http://en.wikipedia.org/wiki/' + resultTerms;
//Use jQuery's append() function to add the searchResults to the DOM
//The argument for the append function will be a string of HTML
$("#resultsTarget").append(
"<p class='wikiResults'>" +
"<a href=" + curURL + ">" +
searchResults[i] +
"</a>" +
"</p>"
);
}
}
});
};
//Code to be executed once the page has fully loaded
$(document).ready(function () {
"use strict";
console.log("LOADED!!!!");
//Use jQuery to assign a callback function when the 'search' button is clicked
$("#search-button").click(function(){
console.log("Clicked search");
//Clear out any old searches
$('#resultsTarget').html('');
//Use jQuery to get the value of the 'query' input box
var newSearchTerm = $("#query").val();
console.log(newSearchTerm);
//Execute the Wikipedia API call with the 'newSearchTerm' string as its argument
searchWikipedia(newSearchTerm);
});
//What if someone just wants to click "ENTER"?
//Use jQuery to assign a callback function when enter is pressed
//This will ONLY work when the 'query' input box is active
$("#query").keypress(function(e){
//If enter key is pressed
if (e.which == 13){
//Use jQuery's trigger() function to execute the click event
$("#search-button").trigger('click');
}
});
});

function createList(array) {
	console.log(array);
	var container= document.getElementById("vidbar");
	if ($("#vidbar:has(*)").length) {
		clearList();
		}
  if (array.items.length == 0) {
      var vidbar = document.getElementById("vidbar");
      var entry = document.createElement("div");
      var text = document.createTextNode("Error: invalid search. Please search another topic.");
      entry.className = "error";
      entry.appendChild(text);
      vidbar.appendChild(entry);
  }
  else {
	 for (i=0;i<array.pageInfo.resultsPerPage;i++){
		  var entry = document.createElement('div');
     var entry2 = document.createElement('div');
		  var thumbnail = document.createElement('img');
		  thumbnail.src= array.items[i].snippet.thumbnails.default.url;
		  var title= document.createTextNode(array.items[i].snippet.title);
      entry2.className = "thumbs";
		  entry2.appendChild(thumbnail);
      entry.appendChild(entry2);
		  entry.appendChild(title);
		  entry.className = "theseVids";
		  var ID= array.items[i].id.videoId;
		  entry.id= ID;
		  entry.onclick = clicked;
		  container.appendChild(entry);
    }
  }
}

function clicked() {
	selectVid(this.id);
}

function selectVid(ID) {
	playVideo(ID);
	console.log('clciked');
	
	//displayVideoAnalytics(ID);
	//getUserChannel(ID);
	//initialize(displayVideoAnalytics(ID));
}

/*function getLocation(ID, videoId){
	function initialize() {
	console.log("initializing");
	    var myLatLng = new google.maps.LatLng(-34.397, 150.644);
	  var mapOptions = {
	    center: myLatLng,
	    zoom: 8
	  };
	  var map = new google.maps.Map(document.getElementById('map-canvas'),
	      mapOptions);
  
	  var marker = new google.maps.Marker({
	        position: myLatLng,
	        map: map,
	        title:"Hello World!"
	  });
	  //displayChart(ID);
	}
	//initialize(displayVideoAnalytics(videoId));
	google.maps.event.addDomListener(window, 'load', initialize);
	
	//}
function getUserChannel() {
  // https://developers.google.com/youtube/v3/docs/channels/list
  var request = gapi.client.youtube.channels.list({
    // "mine: true" indicates that you want to retrieve the authenticated user's channel.
    mine: true,
    part: 'id,contentDetails'
  });

  request.execute(function(response) {
    if ('error' in response) {
      displayMessage(response.error.message);
    } else {
      // We will need the channel's channel ID to make calls to the
      // Analytics API. The channel ID looks like "UCdLFeWKpkLhkguiMZUp8lWA".
      channelId = response.items[0].id;
      // This string, of the form "UUdLFeWKpkLhkguiMZUp8lWA", is a unique ID
      // for a playlist of videos uploaded to the authenticated user's channel.
      var uploadsListId = response.items[0].contentDetails.relatedPlaylists.uploads;
      // Use the uploads playlist ID to retrieve the list of uploaded videos.
      getPlaylistItems(uploadsListId);
    }
  });
}

// Calls the Data API to retrieve the items in a particular playlist. In this
// example, we are retrieving a playlist of the currently authenticated user's
// uploaded videos. By default, the list returns the most recent videos first.
function getPlaylistItems(listId) {
  // https://developers.google.com/youtube/v3/docs/playlistItems/list
  var request = gapi.client.youtube.playlistItems.list({
    playlistId: listId,
    part: 'snippet'
  });

  request.execute(function(response) {
    if ('error' in response) {
      displayMessage(response.error.message);
    } else {
      if ('items' in response) {
        // jQuery.map() iterates through all of the items in the response and
        // creates a new array that only contains the specific property we're
        // looking for: videoId.
        var videoIds = $.map(response.items, function(item) {
          return item.snippet.resourceId.videoId;
        });

        // Now that we know the IDs of all the videos in the uploads list,
        // we can retrieve info about each video.
        getVideoMetadata(videoIds);
      } else {
        displayMessage('There are no videos in your channel.');
      }
    }
  });
}

// Given an array of video ids, obtains metadata about each video and then
// uses that metadata to display a list of videos to the user.
function getVideoMetadata(videoIds) {
  // https://developers.google.com/youtube/v3/docs/videos/list
  var request = gapi.client.youtube.videos.list({
    // The 'id' property value is a comma-separated string of video IDs.
    id: videoIds.join(','),
    part: 'id,snippet,statistics'
  });

  request.execute(function(response) {
    if ('error' in response) {
      displayMessage(response.error.message);
    } else {
      // Get the jQuery wrapper for #video-list once outside the loop.
      var videoList = $('#video-list');
      $.each(response.items, function() {
        // Exclude videos that don't have any views, since those videos
        // will not have any interesting viewcount analytics data.
        if (this.statistics.viewCount == 0) {
          return;
        }

        var title = this.snippet.title;
        var videoId = this.id;

        // Create a new <li> element that contains an <a> element.
        // Set the <a> element's text content to the video's title, and
        // add a click handler that will display Analytics data when invoked.
        var liElement = $('<li>');
        var aElement = $('<a>');
        // The dummy href value of '#' ensures that the browser renders the
        // <a> element as a clickable link.
        aElement.attr('href', '#');
        aElement.text(title);
        aElement.click(function() {
          displayVideoAnalytics(videoId);
        });

        // Call the jQuery.append() method to add the new <a> element to
        // the <li> element, and the <li> element to the parent
        // list, which is identified by the 'videoList' variable.
        liElement.append(aElement);
        videoList.append(liElement);
      });

      if (videoList.children().length == 0) {
        displayMessage('Your channel does not have any videos that have been viewed.');
      }
    }
  });
}

// Requests YouTube Analytics for a video, and displays results in a chart.
function displayVideoAnalytics(videoID) {
  if (channelId) {
    // To use a different date range, modify the ONE_MONTH_IN_MILLISECONDS
    // variable to a different millisecond delta as desired.
    var today = new Date();
    var lastMonth = new Date(today.getTime() - ONE_MONTH_IN_MILLISECONDS);

    var request = gapi.client.youtubeAnalytics.reports.query({
      // The start-date and end-date parameters need to be YYYY-MM-DD strings.
      'start-date': formatDateString(lastMonth),
      'end-date': formatDateString(today),
      // A future YouTube Analytics API release should support channel==default.
      // In the meantime, you need to explicitly specify channel==channelId.
      // See https://devsite.googleplex.com/youtube/analytics/v1/#ids
      ids: 'channel==' + channelId,
      dimensions: 'province',
      // See https://developers.google.com/youtube/analytics/v1/available_reports for details
      // on different filters and metrics you can request when dimensions=day.
      metrics: 'views',
      filters: 'claimedStatus==claimed;country==US',
	sort: 'province'
    });

    request.execute(function(response) {
      // This function is called regardless of whether the request succeeds.
      // The response either has valid analytics data or an error message.
      if ('error' in response) {
        displayMessage(response.error.message);
      } else {
        displayChart(videoId, response);
      }
    });
  } else {
    displayMessage('The YouTube user id for the current user is not available.');
  }
}

// Boilerplate code to take a Date object and return a YYYY-MM-DD string.
function formatDateString(date) {
  var yyyy = date.getFullYear().toString();
  var mm = padToTwoCharacters(date.getMonth() + 1);
  var dd = padToTwoCharacters(date.getDate());

  return yyyy + '-' + mm + '-' + dd;
}

// If number is a single digit, prepend a '0'. Otherwise, return it as a string.
function padToTwoCharacters(number) {
  if (number < 10) {
    return '0' + number;
  } else {
    return number.toString();
  }
}

// Calls the Google Chart Tools API to generate a chart of analytics data.
/*function displayChart(videoId, response) {
  //if ('rows' in response) {
    //hideMessage();

    // The columnHeaders property contains an array of objects representing
    // each column's title – e.g.: [{name:"day"},{name:"views"}]
    // We need these column titles as a simple array, so we call jQuery.map()
    // to get each element's "name" property and create a new array that only
    // contains those values.
    var columns = $.map(response.columnHeaders, function(item) {
      return item.name;
    });
    // The google.visualization.arrayToDataTable() wants an array of arrays.
    // The first element is an array of column titles, calculated above as
    // "columns". The remaining elements are arrays that each represent
    // a row of data. Fortunately, response.rows is already in this format,
    // so it can just be concatenated.
    // See https://developers.google.com/chart/interactive/docs/datatables_dataviews#arraytodatatable
    var chartDataArray = [columns].concat(response.rows);
    var chartDataTable = google.visualization.arrayToDataTable(chartDataArray);

    var chart = new google.visualization.LineChart(document.getElementById('chart'));
    chart.draw(chartDataTable, {
      // Additional options can be set if desired.
      // See https://developers.google.com/chart/interactive/docs/reference#visdraw
      title: 'Views per Day of Video ' + videoId
    });
  } //else {
    //displayMessage('No data available for video ' + videoId);
  //}
  //} */

/* Helper method to display a message on the page.
function displayMessage(message) {
  $('#message').text(message).show();
}

// Helper method to hide a previously displayed message on the page.
function hideMessage() {
  $('#message').hide();
}
*/
function playVideo(ID) {
	var source;
	var source= 'http://www.youtube.com/embed/' + ID; 
	var videoPlay = document.getElementById('player');
	videoPlay.src= source;
}
function clearList() {
	var entry = document.getElementById("vidbar");
	while ( entry.firstChild ) entry.removeChild( entry.firstChild );
}
