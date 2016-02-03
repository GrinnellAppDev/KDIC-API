//
//  schedule.js
//  kdicAPI
//
//  Created by Shaun Mataire on 1/14/16.
//  Copyright © 2016 AppDev. All rights reserved.
//

var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

/* GET  schedule. */
router.get('/', function(req, res, next) {

  var albumReviewsUrl = 'http://kdic.grinnell.edu/?page_id=118'

  request(albumReviewsUrl, function(error, response, html){
    //check whether there was an error making the request
    if(!error){
      //get the cheerio html object
      var $ = cheerio.load(html);


      var timeScheduleJson = {}

      //we'' use the unique header as a starting point
      $('div .entry-content').filter(function(){

        //get the html object data
        var data = $(this)

        //loop through articles
        data.each(function(){

          //varticle objects
          var articleTitle, fullArticleUrl, articleText, datePosted, author, articleImageUrl, youtubeUrl;

          var timeIndex = 0;
          var times = ["days", "5:00 pm", "6:00 pm", "7:00 pm", "8:00 pm", "9:00 pm",
          "10:00 pm", "11:00 pm", "12:00 am", "01:00 am"];

          $('tr ',this).each(function(){

            var dayIndex = 0;
            var timeJson = {}

            $(this).children().each(function(){
              var showName = $(this).text();


              switch (dayIndex) {
                  case 1:
                      timeJson["monday"] = showName;
                      break;
                  case 2:
                      timeJson["tuesday"] = showName;
                      break;
                  case 3:
                      timeJson["wednesday"] = showName;
                      break;
                  case 4:
                      timeJson["thursday"] = showName;
                      break;
                  case 5:
                      timeJson["friday"] = showName;
                      break;
                  case 6:
                      timeJson["saturday"] = showName;
                      break;
                  case 7:
                      timeJson["sunday"] = showName;
                      break;
              }
              dayIndex++;
            });

            timeScheduleJson[times[timeIndex]] = timeJson;
            timeIndex++;
          });
          console.log(timeIndex);
        });

      });
      //sent articles
      res.send(JSON.stringify(timeScheduleJson));
    }
  });
});

module.exports = router;
