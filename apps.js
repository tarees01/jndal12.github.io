$(document).ready(function () {
function showResult(contentHtml) {
$('#content').html(contentHtml);
}
function startSearch(inputText) {
$.ajax({
//url: 'https://ru.wikipedia.org/w/api.php?format=json&action=mobileview&redirects&prop=sections|normalizedtitle&sectionprop=toclevel|line|index&page=%D0%A4%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D1%8F%20(%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5)',
url: 'https://en.wikipedia.org/w/api.php?format=json&action=parse&redirects&prop=text&mobileformat=html&page=' + inputText + '&section=0',
//url: 'http://en.wikipedia.org/w/api.php?format=json&action=query&titles=Main%20Page&prop=revisions&rvprop=content&callback=?',
dataType: 'jsonp'
}).done(function (data) {
console.log(data);
if (data.error) {
switch (data.error.code) {
case 'missingtitle':
$.ajax({
url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&list=search&srnamespace=0&srlimit=10&srsearch=' + inputText,
dataType: 'jsonp'
}).done(function (data) {
console.log(data);
if (data.error) {
}
else {
var $ul = $('<ol></ol>');
for (var i = 0; i < data.query.search.length; i++) {
var item = data.query.search[i];
var $li = $('<li></li>');
$li.append('<h3><a href="#" class="snippet-item">' + item.title +  '</a></h3>');
$li.append(item.snippet);
$ul.append($li);
}
showResult($ul);


}

});
break;
}
}
else {
showResult(data.parse.text['*']);
}
});
}
$('#search-button').on('click', function () {
var inputText = $.trim($('#query').val());
startSearch(inputText);
});
$(document).on('click', '.snippet-item', function (event) {
event.preventDefault();
var text = $(this).text();
startSearch(text);
});
});
