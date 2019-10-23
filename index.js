
// Declare Global Variables
var categoryids = [];
var questions = [];
var intcategoryid = 0

// Initialize the page including getting categories
function InitializeIt() {

  var lstMonth = document.getElementById("Month");
  var lstDay = document.getElementById("Day");
  var lstYear = document.getElementById("Year");
  var i;

  for (i = 1; i < 32; i++) {
    var option = document.createElement("option");
    if (i < 10) {
      option.text = "0" + i.toString();
    } else {
      option.text = i;
    }

    lstDay.add(option);
  }


  for (i = 1964; i < 2020; i++) {
    var option = document.createElement("option");
    option.text = i;
    lstYear.add(option);
  }

  var offset = Math.floor(Math.random() * 1000);
  var offsetstr = offset.toString();

  var x = 0;
  //while (x < 15000) {

  var strapi = "https://jservice.io/api/categories/?count=100&offset=" + x.toString();
  //var str2 = "&offset=" + x.toString();
  //var str3 = str1.concat(offsetstr);
  document.getElementById("demo2").innerHTML = strapi;
  var request = new XMLHttpRequest();
  request.open("GET", strapi, true);

  request.onload = function () {

    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      data.forEach(category => {

        var listbox1 = document.getElementById("CategoryList");
        var option = document.createElement("option");
        option.text = category.title;
        listbox1.add(option);
        categoryids.push(category.id);

      });
    }
  }


  request.send();
  // x = x + 100;
  //}
}

function GenerateQuestions() {
  document.getElementById("Questions").options.length = 0;
  var strDifficulty;
  var strCategory;
  var intoptions = 0;
  var strapi = "http://jservice.io/api/clues";
  var strDateSearch = ""

  // Add Difficulty option
  if (document.getElementById("Difficulty").selectedIndex > 0) {

    strDifficulty = document.getElementById("Difficulty").value;
    intoptions = intoptions + 1
    if (intoptions == 1) {
      strapi = strapi + "/?value=" + strDifficulty
    } else {
      strapi = strapi + "&value=" + strDifficulty
    }

  }

  // Add Category option
  if (document.getElementById("CategoryList").selectedIndex > 0) {
    intcategoryid = document.getElementById("CategoryList").selectedIndex
    document.getElementById("demo").innerHTML = intcategoryid
    strCategory = categoryids[intcategoryid]

    intoptions = intoptions + 1
    if (intoptions == 1) {
      strapi = strapi + "/?category=" + categoryids[intcategoryid]
    } else {
      strapi = strapi + "&category=" + categoryids[intcategoryid]
    }

  }
  document.getElementById("demo").innerHTML = strapi
  // Build DateRange
  if (document.getElementById("Month").selectedIndex > 0) {

    strMonth = document.getElementById("Month").value;
  }

  if (document.getElementById("Day").selectedIndex > 0) {

    strDay = document.getElementById("Day").value;
  }

  if (document.getElementById("Year").selectedIndex > 0) {

    strYear = document.getElementById("Year").value.toString();
  }


  if (document.getElementById("Month").selectedIndex > 0 && document.getElementById("Day").selectedIndex > 0 && document.getElementById("Year").selectedIndex > 0) {
    strDateSearch = "Day";
  }

  if (document.getElementById("Month").selectedIndex > 0 && document.getElementById("Day").selectedIndex == 0 && document.getElementById("Year").selectedIndex > 0) {
    strDateSearch = "Month";
  }


  document.getElementById("demo2").innerHTML = strDateSearch;

  //var datetoadd = new Date(strYear,strMonth,strDay,0,0,0,0);
  //document.getElementById("demo").innerHTML = datetoadd;


  //document.getElementById("demo2").innerHTML = strapi;


  var request = new XMLHttpRequest();
  request.open("GET", strapi, true);

  request.onload = function () {

    var data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {
      data.forEach(question => {

        if (question.invalid_count == null) {
          var listbox1 = document.getElementById("Questions");
          var option = document.createElement("option");

          var strairdateyear = question.airdate.substring(0, 4);
          var strairdatemonth = question.airdate.substring(5, 7);
          var strairdateday = question.airdate.substring(8, 10);

          var strairdate = strairdateyear + strairdatemonth + strairdateday;

         
          
          if (strDateSearch == "Day") {
            if (strairdateyear == strYear && strairdatemonth == strMonth && strairdateday == strDay) {

              option.text = question.question + "/" + question.value + "/" + question.answer + "/" + strairdate;
              listbox1.add(option);
              questions.push(question.answer);
            }
          } 

          if (strDateSearch == "Month") {
            if (strairdateyear == strYear && strairdatemonth == strMonth) {

              option.text = question.question + "/" + question.value + "/" + question.answer + "/" + strairdate;
              listbox1.add(option);
              questions.push(question.answer);
            }
          } 

          if (strDateSearch == "") {
           

              option.text = question.question + "/" + question.value + "/" + question.answer + "/" + strairdate;
              listbox1.add(option);
              questions.push(question.answer);
            
          } 
        }
      });
    }

  
  }
  request.send();
}

function DisplayAnswer() {
 
  document.getElementById("answer").innerHTML = "The answer is " + questions[document.getElementById("Questions").selectedIndex];
}