var keepem = {
    //myPlayer,myVote,percent_d,percent_k;
    config: 
    { 
        slug: '',
        log_url: '',
        log_answers: 0,
    },
    update_config: function(config) {
        // Take an external config object and update this config object.
        for ( var key in config )
        {
            if ( config.hasOwnProperty(key) )
            {
                this.config[key] = config[key];
            }
        }
    },
    get_players: function()
    {
        $.getJSON('js/players.json?v2', function(data) {
      
          $.each(data.Players[0], function(i, item) {
            //console.log(item);
            if ( item.name == '' ) return false;
            var playerID = item.id;
            var lastname = item.name.split(" ")[1];
            var firstname = item.name.split(" ")[0];
            var section = item.position;
            var photo = firstname.toLowerCase()+"_"+lastname.toLowerCase()+".jpg";
            if(item.name == "promo")
            {
                $('#players').append('<div id="'+playerID+'" first="'+playerID+'" class="large-4 medium-6 small-12 columns" style="float:left" ><a href=" http://www.nydailynews.com/entertainment/golden-globes-2016-best-worst-red-carpet-gallery-1.2491685" target="new"><img src="img/gg_promo.jpg"></a></div>')
            }
            else if(item.name == "promo2")
            {
                $('#players').append('<div id="'+playerID+'" first="'+playerID+'" class="large-4 medium-6 small-12 columns" style="float:left" ><a href=" http://www.nydailynews.com/entertainment/golden-globes-2016-best-worst-red-carpet-gallery-1.2491685" target="new"><img src="img/gg_promo2.jpg"></div></a>')
            }
            else if(item.name != "ad")
            {
                $('#'+section).append('<div id="'+playerID+'" first="'+playerID+'" class="large-4 medium-6 small-12 columns" style="float:left" >\n\
<img src="img/'+photo+'">\n\
    <div id="'+playerID+'_vote" class="panel">\n\
        <p class="name">'+item.name.toUpperCase()+'</p>\n\
        <span  id="0" class="button radius keep">KEEP HIM</span>\n\
        <span id="1" class="button radius dump">DUMP HIM</span>\n\
    </div>\n\
    <div id="'+playerID+'_results" class="panel results">\n\
        <div style="float:right" vote="" class="clear">CLEAR</div>\n\
        <div class="your_vote" style="font-size:10px;">YOUR VOTE</div>\n\
        <div>\n\
            <div>DUMP HIM</div>\n\
            <div class="dump_bar" style="height:12px; background-color:#f23f3f; float:left" ></div>\n\
            <div class="dump_result_num result_num"></div>\n\
        </div>\n\
        <div class="keep_holder">\n\
            <div>KEEP HIM</div>\n\
            <div class="keep_bar" style="height:12px; background-color:#74a840; float:left" ></div>\n\
            <div class="keep_result_num result_num"></div>\n\
        </div>\n\
    </div>\n\
    <div class="social">\n\
        <a class="fb-share" href="http://www.facebook.com/sharer.php?u=http://interactive.nydailynews.com/2016/12/2016-giants-keep-em-dump-em/" target="_blank"><div class="facebook" class="small-text-center"></div></a>\n\
        <a class="tweet" href="https://twitter.com/share?url=nydn.us/goldenglobesvote&text=TEXT GOES HERE" target="_new"><div class="twitter"></div></a>\n\
    </div>\n\
</div>');
            //$("#credits").append(item.name+", "+item.credit+"; ");
            }
            else
            {
                if( !/Android|webOS|iPhone|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                    $('#forward').append('<div id="box_ad" class="large-4 medium-6 small-12 columns" style="float:left"><div id="div-gpt-ad-1423507761396-1"><script type="text/javascript">googletag.cmd.push(function(){ googletag.display("div-gpt-ad-1423507761396-1"); });</script></div></div><br clear="all">')   
                }
            }
            if( !/Android|webOS|iPhone|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                $("#box_ad").show();
               }else{
                 $("#box_ad").hide();
               }
          })      
          $(".button").on('click', function() {
            myPlayer = $(this).parent().parent().attr('id');
            playerFirst = $(this).parent().parent().attr('first');
            playername = $(this).parent().text().split("KEEP")[0];
            $('#'+myPlayer+"_vote").hide();
            $('#'+myPlayer+"_results").fadeIn('slow');
            $("#"+myPlayer).find(".social").fadeIn('slow');
            myVote = ($(this).attr("id"));
            keepem.get_vote(myVote, myPlayer, playerFirst, playername)
          });
        })
    },
    subtract_vote: function (int, player)
    {
        var random = makeid();

        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        } else {  // code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.open("GET","php/vote_subtract.php?vote="+int+"&player="+player+"&"+random,true);
        xmlhttp.send();
        if(int == 0){
            $("#"+player).find(".your_vote").removeClass("keep")
        }else{
            $("#"+player).find(".your_vote").removeClass("dump")
        }
    },
    get_vote: function (int, player, firstname, playername) {
        var random = this.make_id();

        jQuery.get("php/vote.php?vote="+int+"&player="+player+"&"+random, function(data) {
            keep = eval(data.split("||")[0]);
            dump = eval(data.split("||")[1]);

            //console.log(playername)
            percent_k = Math.round((keep/(dump+keep))*100);
            percent_d = Math.round((dump/(dump+keep))*100);
            if(int == 0){
                $("#"+player).find(".your_vote").addClass("keep");
                $("#"+player).find(".tweet").attr("href", "https://twitter.com/share?url=http://interactive.nydailynews.com/2016/12/2016-giants-keep-em-dump-em&text=I voted to keep "+playername+". Cast your Keep 'em, Dump 'em vote now:")
            }else{
                $("#"+player).find(".your_vote").addClass("dump");
                $("#"+player).find(".tweet").attr("href", "https://twitter.com/share?url=http://interactive.nydailynews.com/2016/12/2016-giants-keep-em-dump-em&text=I voted to dump "+playername+". Cast your Keep 'em, Dump 'em vote now:")
            }
            $("#"+player).find(".clear").attr("vote", int)
            $("#"+player).find(".dump_bar").css('width', percent_d/2+"%");
            $("#"+player).find(".keep_bar").css('width', percent_k/2+"%");
            $("#"+player).find(".keep_result_num").html(percent_k+"%");
            $("#"+player).find(".dump_result_num").html(percent_d+"%");

            if(percent_d != 100){
                $("#"+player).find(".keep_holder").css("left", "-"+(percent_d/2)-12+"%");
            }else{
                $("#"+player).find(".keep_holder").css("left", "-65%");   
            }
            if(percent_k == 100){
                $("#"+player).find(".keep_holder").css("left", "-9%");
            }
        });
    },
    make_id: function()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    init: function() 
    {
        // Populate the things that need populating

        // Config handling. External config objects must be named quiz_config
        if ( typeof window.app_config !== 'undefined' ) { this.update_config(app_config); }

      if( !/Android|webOS|iPhone|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) { 
          $("#hed").html('2016 KEEP \'EM OR DUMP \'EM: <blue>GIANTS</blue>');
        }else{
          $("#hed").html('2016 KEEP \'EM OR DUMP \'EM: <blue>GIANTS</blue>');    
          
          var waypoint = new Waypoint({
            element: document.getElementById('m_bottom_ad'),
            handler: function(direction) {}
          });
          
          var banner_sticky = new Waypoint.Sticky({
            element: $('#m_bottom_ad')[0]
          });
        }
        this.get_players();
    }
};
//function get_vote(int, player, firstname, playername) {
//    return keepem.get_vote(int, player, firstname, playername);
//}
