function exportTripAdvisorRankingToSpreadsheet() {
  
  var allureCaramelTrpAdvisorUrl = "https://www.tripadvisor.com/Hotel_Review-g294472-d622397-Reviews-Allure_Caramel_Hotel_by_Karisma-Belgrade.html";
  
  var propertyName = "Allure Caramel Hotel by Karisma";
  
  var hotelPageContent = getPageContent(allureCaramelTrpAdvisorUrl);
  
  var data = getRanking(hotelPageContent, propertyName);
  
  pushToSpreadSheet(data);
  
}

function getPageContent(url){

  return UrlFetchApp.fetch(url).getContentText();

}

function getDate(){

  var date = new Date();
  
  return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

}

function getRanking(pageContent, propertyName){

  var rankPrefix = propertyName + ', ranked #';
  
  var ReviewPrefix = 'hotels-hotel-review-community-content-review-list-parts-ReviewRatingFilter__row_num--4LVBi">';
  
  var reviews = [];

  var positionOfRanking = pageContent.indexOf(rankPrefix);
  
  var rankValue = pageContent.substring((positionOfRanking + rankPrefix.length), (positionOfRanking + rankPrefix.length + 4));
  
  var totalProperties = pageContent.substring((positionOfRanking + rankPrefix.length + 6), (positionOfRanking + rankPrefix.length + 10));
  
  rankValue = cleanStringToInt(rankValue);
  
  totalProperties = cleanStringToInt(totalProperties);
  
  var start = 0;
  
  for(var i = 0; i < 5; i++){
  
    var positionOf_Review = pageContent.indexOf(ReviewPrefix, start); 
  
    var numberOf_Reviews = pageContent.substring((positionOf_Review + ReviewPrefix.length), (positionOf_Review + ReviewPrefix.length + 4));
  
    numberOf_Reviews = cleanStringToInt(numberOf_Reviews);
    
    start = positionOf_Review + 10;
    
    reviews.push(numberOf_Reviews);
  
  }
  
  return [getDate(), rankValue, totalProperties].concat(reviews);
  
}

function cleanStringToInt(value){
  
  var rank = [];
  
  value = value.replace(/\s/g, '');
  
  for(var i = 0; i < value.length; i++){
    if(!isNaN(value[i])){
      rank.push(value[i]);
    }
  }
  
  return rank.join("");
}

function getReviewCount(pageContent){

  var prefix = 'hotels-hotel-review-community-content-review-list-parts-ReviewRatingFilter__row_num--4LVBi">';
  
  var reviews = [];
  
  var start = 0;
  
  for(var i = 0; i < 5; i++){
  
    var positionOf_Review = pageContent.indexOf(prefix, start); 
  
    var numberOf_Reviews = pageContent.substring((positionOf_Review + prefix.length), (positionOf_Review + prefix.length + 4));
  
    numberOf_Reviews = cleanStringToInt(numberOf_Reviews);
    
    start = positionOf_Review + 10;
    
    reviews.push(numberOf_Reviews);
  
  }

  Logger.log(reviews);
  
  return reviews;
}

function pushToSpreadSheet(row){

  var spreadsheetApp = SpreadsheetApp;
  var sheet = spreadsheetApp.getActiveSheet();
  sheet.appendRow(row);
}
