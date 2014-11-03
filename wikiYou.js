	
<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.2.js"></script>
<script type="text/javascript" src="util.js"></script>
<script type="text/javascript" src="wikisearch.js"></script>
<script type="text/javascript">
$(window).load(function() {
$('wiki').wikiSearch({
callback: function(lemma, lang) {
location.href = "http://" + lang + ".wikipedia.org/wiki/" + lemma;
},
label: "Search wiki"
});
});
</script>
		