  var socket =  io('twikan.com:3333'); // Server adresinizi girin
  var yanlis_count = 0;

  var kelimeler = ["bide","acaip","aferim","anfi","antreman","arasıra","arasöz","asvalt","ardarda","birarada","birşey","deyil","diyil","dinazor","eksoz","egzost","eşortman","eşşek","eylence","felan","farketmek","gurup","halikar","harfiyat","herbiri","hergün","herhangibir","herkez","herşey","hiçkimse","ilkönce","idda","kareografi","makina","malesef","menejer","menacer","metod","meyva","muhattap","müsade","orjinal","ritm","rütuş","sandöviç","sarmısak","sezeryan","süpriz","şartel","vejeteryan","yanlız","yalnış"];

  socket.on('connect_yanlis', function (data){
    $('#yanlis_sayi').html(data.yanlis_count);
  });

  socket.on('yanlis_yazim', function (data){
    $('#sil').fadeOut();

    var tweet = data.tweet;
    var user = tweet.user;
    var name = user.name;
    var screen_name = user.screen_name;
    var picture = user.profile_image_url;
    if(screen_name.indexOf("TurkceRobotu") == -1){
      yanlis_count++;
      $html = '<li><img class="img-rounded" height="26px" src="'+picture+'" /> <p class="tweet"><span class="screen_name">@'+screen_name+' </span>'+ tweet.text + ' </p></li>';
      if(yanlis_count>6){
        $('.yanlis_liste li:last').fadeOut(300);
        $('.yanlis_liste li:last').remove();
      }

      console.log(data);


      $($html).hide().prependTo(".yanlis_liste").slideDown(400);

      for (var i = kelimeler.length - 1; i >= 0; i--) {
        $('.yanlis_liste').highlight(kelimeler[i]);
      };

      $('#yanlis_sayi').html(data.yanlis_count);
    }
    
  });