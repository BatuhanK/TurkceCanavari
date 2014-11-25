var Twit = require('twit');
var S = require('string');
var T = new Twit({
	consumer_key:         '## CONSUMER KEY ##'
	, consumer_secret:      '## CONSUMER SECRET ##'
	, access_token:         '## ACCESS TOKEN ##'
	, access_token_secret:  '## ACCESS TOKEN SECRET ##'
});


var yanlislar = ["acaip","aferim","anfi","antreman","arasıra","arasöz","asvalt","ardarda","birarada","birşey","deyil","diyil","dinazor","eksoz","egzost","eşortman","eşşek","eylence","felan","farketmek","gurup","halikar","harfiyat","herbiri","hergün","herhangibir","herkez","herşey","hiçkimse","ilkönce","idda","kareografi","makina","malesef","menejer","menacer","metod","meyva","muhattap","müsade","orjinal","ritm","rütuş","sandöviç","sarmısak","sezeryan","süpriz","şartel","vejeteryan","yada","yanlız","yalnış"];
var dogrular = ["acayip","aferin","amfi","antrenman","ara sıra","ara söz","asfalt","art arda","bir arada","bir şey","değil","değil","dinozor","egzoz","egzoz","eşofman","eşek","eğlence","falan","fark etmek","grup","halükar","hafriyat","her biri","her gün","herhangi bir","herkes","her şey","hiç kimse","ilk önce","iddia","koreografi","makine","maalesef","menajer","menajer","method","meyve","muhatap","müsaade","orijinal","ritim","rötuş","sandviç","sarımsak","sezeryan","sürpriz","şalter","vejetaryen","ya da","yalnız","yanlış"];



function tweet_at(gelen_tweet){
	

	var cevap = "Türkçe canavarı tespit edildi ! ";
	text = gelen_tweet.text.toLowerCase();
	var count = 0;
	for (var i = yanlislar.length - 1; i >= 0; i--) {
		if( S(text).contains(yanlislar[i]) ) {
			count++;
			cevap = cevap + " (" + yanlislar[i] + " -> " + dogrular[i] + " )";
		}
	}

	cevap = cevap + ' Lütfen incele : http://twikan.com/turkce @'+gelen_tweet.user.screen_name;

	if(count>0){
		T.post('statuses/update', { in_reply_to_status_id : gelen_tweet.id_str, status:cevap }, function(err, data, response) {
			if(err) console.log(err);
		});

		T.post('favorites/create', { id : gelen_tweet.id_str}, function(err, data, response) {
			if(err) console.log(err);
		});
	}
}


module.exports=function(io,client) {
	var stream = T.stream('statuses/filter', { track: yanlislar.join() , language: 'tr' })
	stream.on('tweet', function (tweet) {
		console.log("## Twitter stream basladi");
		var text = tweet.text;
		text = S(text).trim().s;
		tweet.text = text;


		var my_data = {
			text : tweet.text,
			user : {
				name : tweet.user.name,
				screen_name : tweet.user.screen_name,
				profile_image_url : tweet.user.profile_image_url
			}
		};

		if(!S(text).startsWith("RT")) { 
			client.incr("yanlis_count", function (err, reply) {
				if(err)
					console.log(err);
				else{
					io.sockets.emit('yanlis_yazim', {tweet:my_data, yanlis_count : reply.toString() });
					// kontrol edelim ve tweet atalım
					if(reply%256 == 0)
						tweet_at(tweet);	
				}	
			});
		}
	});
}
