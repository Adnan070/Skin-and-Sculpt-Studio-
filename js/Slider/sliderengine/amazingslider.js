/** Amazing Slider - Responsive jQuery Slider and Image Scroller
 * Copyright 2014 Magic Hills Pty Ltd All Rights Reserved
 * Website: http://amazingslider.com
 * Version 3.3
 */
(function ($) {
  $.fn.html5lightbox = function (options) {
    var inst = this;
    inst.options = jQuery.extend(
      {
        id: 0,
        autoplay: true,
        html5player: true,
        overlaybgcolor: "#000000",
        overlayopacity: 0.9,
        bgcolor: "#ffffff",
        bordersize: 8,
        barheight: 48,
        loadingwidth: 64,
        loadingheight: 64,
        resizespeed: 400,
        fadespeed: 400,
        skinfolder: "skins/",
        loadingimage: "lightbox-loading.gif",
        nextimage: "lightbox-next.png",
        previmage: "lightbox-prev.png",
        closeimage: "lightbox-close.png",
        playvideoimage: "lightbox-playvideo.png",
        titlecss:
          "{color:#333333; font-size:16px; font-family:Armata,sans-serif,Arial; overflow:hidden;}",
        errorwidth: 280,
        errorheight: 48,
        errorcss:
          "{text-align:center; color:#ff0000; font-size:14px; font-family:Arial, sans-serif;}",
        supportesckey: true,
        supportarrowkeys: true,
        version: "1.8",
        stamp: false,
        freemark: "html5box.com",
        freelink: "http://html5box.com/",
        watermark: "",
        watermarklink: "",
      },
      options
    );
    if (typeof html5lightbox_options != "undefined" && html5lightbox_options)
      jQuery.extend(inst.options, html5lightbox_options);
    inst.options.htmlfolder = window.location.href.substr(
      0,
      window.location.href.lastIndexOf("/") + 1
    );
    if (
      inst.options.skinfolder.charAt(0) != "/" &&
      inst.options.skinfolder.substring(0, 5) != "http:" &&
      inst.options.skinfolder.substring(0, 6) != "https:"
    )
      inst.options.skinfolder = inst.options.jsfolder + inst.options.skinfolder;
    inst.options.types = [
      "IMAGE",
      "FLASH",
      "VIDEO",
      "YOUTUBE",
      "VIMEO",
      "PDF",
      "MP3",
      "WEB",
    ];
    inst.elemArray = new Array();
    inst.options.curElem = -1;
    inst.options.flashInstalled = false;
    try {
      if (new ActiveXObject("ShockwaveFlash.ShockwaveFlash"))
        inst.options.flashInstalled = true;
    } catch (e) {
      if (navigator.mimeTypes["application/x-shockwave-flash"])
        inst.options.flashInstalled = true;
    }
    inst.options.html5VideoSupported = !!document.createElement("video")
      .canPlayType;
    inst.options.isChrome = navigator.userAgent.match(/Chrome/i) != null;
    inst.options.isFirefox = navigator.userAgent.match(/Firefox/i) != null;
    inst.options.isOpera =
      navigator.userAgent.match(/Opera/i) != null ||
      navigator.userAgent.match(/OPR\//i) != null;
    inst.options.isSafari = navigator.userAgent.match(/Safari/i) != null;
    inst.options.isIE =
      navigator.userAgent.match(/MSIE/i) != null && !inst.options.isOpera;
    inst.options.isIE9 =
      navigator.userAgent.match(/MSIE 9/i) != null && !inst.options.isOpera;
    inst.options.isIE8 =
      navigator.userAgent.match(/MSIE 8/i) != null && !inst.options.isOpera;
    inst.options.isIE7 =
      navigator.userAgent.match(/MSIE 7/i) != null && !inst.options.isOpera;
    inst.options.isIE6 =
      navigator.userAgent.match(/MSIE 6/i) != null && !inst.options.isOpera;
    inst.options.isIE678 =
      inst.options.isIE6 || inst.options.isIE7 || inst.options.isIE8;
    inst.options.isIE6789 =
      inst.options.isIE6 ||
      inst.options.isIE7 ||
      inst.options.isIE8 ||
      inst.options.isIE9;
    inst.options.isAndroid = navigator.userAgent.match(/Android/i) != null;
    inst.options.isIPad = navigator.userAgent.match(/iPad/i) != null;
    inst.options.isIPhone =
      navigator.userAgent.match(/iPod/i) != null ||
      navigator.userAgent.match(/iPhone/i) != null;
    inst.options.isMobile =
      inst.options.isAndroid || inst.options.isIPad || inst.options.isIPhone;
    inst.options.isIOSLess5 =
      inst.options.isIPad &&
      inst.options.isIPhone &&
      (navigator.userAgent.match(/OS 4/i) != null ||
        navigator.userAgent.match(/OS 3/i) != null);
    inst.options.supportCSSPositionFixed =
      !inst.options.isIE6 && !inst.options.isIOSLess5;
    inst.options.resizeTimeout = -1;
    inst.onFinish = null;
    inst.init = function () {
      inst.showing = false;
      inst.readData();
      inst.createMarkup();
      inst.supportKeyboard();
    };
    var ELEM_TYPE = 0,
      ELEM_HREF = 1,
      ELEM_TITLE = 2,
      ELEM_GROUP = 3,
      ELEM_WIDTH = 4,
      ELEM_HEIGHT = 5,
      ELEM_HREF_WEBM = 6,
      ELEM_HREF_OGG = 7;
    inst.readData = function () {
      inst.each(function () {
        if (this.nodeName.toLowerCase() != "a") return;
        var $this = $(this);
        var fileType = inst.checkType($this.attr("href"));
        if (fileType < 0) return;
        inst.elemArray.push(
          new Array(
            fileType,
            $this.attr("href"),
            $this.attr("title"),
            $this.data("group"),
            $this.data("width"),
            $this.data("height"),
            $this.data("webm"),
            $this.data("ogg")
          )
        );
      });
    };
    inst.createMarkup = function () {
      var fontRef =
        ("https:" == document.location.protocol ? "https" : "http") +
        "://fonts.googleapis.com/css?family=Armata";
      var fontLink = document.createElement("link");
      fontLink.setAttribute("rel", "stylesheet");
      fontLink.setAttribute("type", "text/css");
      fontLink.setAttribute("href", fontRef);
      document.getElementsByTagName("head")[0].appendChild(fontLink);
      var styleCss = "#html5-text " + inst.options.titlecss;
      styleCss += ".html5-error " + inst.options.errorcss;
      $("head").append(
        "<style type='text/css' data-creator='amazingslidercreator" +
          inst.id +
          "'>" +
          styleCss +
          "</style>"
      );
      inst.$lightbox = jQuery(
        "<div id='html5-lightbox' style='display:none;top:0px;left:0px;width:100%;height:100%;z-index:9999999;'>" +
          "<div id='html5-lightbox-overlay' style='display:block;position:absolute;top:0px;left:0px;width:100%;height:100%;background-color:" +
          inst.options.overlaybgcolor +
          ";opacity:" +
          inst.options.overlayopacity +
          ";filter:alpha(opacity=" +
          Math.round(inst.options.overlayopacity * 100) +
          ");'></div>" +
          "<div id='html5-lightbox-box' style='display:block;position:relative;margin:0px auto;overflow:hidden;'>" +
          "<div id='html5-elem-box' style='display:block;position:relative;margin:0px auto;text-align:center;'>" +
          "<div id='html5-elem-wrap' style='display:block;position:relative;margin:0px auto;text-align:center;background-color:" +
          inst.options.bgcolor +
          ";'>" +
          "<div id='html5-loading' style='display:none;position:absolute;top:0px;left:0px;text-align:center;width:100%;height:100%;background:url(\"" +
          inst.options.skinfolder +
          inst.options.loadingimage +
          "\") no-repeat center center;'></div>" +
          "<div id='html5-error' class='html5-error' style='display:none;position:absolute;padding:" +
          inst.options.bordersize +
          "px;text-align:center;width:" +
          inst.options.errorwidth +
          "px;height:" +
          inst.options.errorheight +
          "px;'>" +
          "The requested content cannot be loaded.<br />Please try again later." +
          "</div>" +
          "<div id='html5-image' style='display:none;position:absolute;top:0px;left:0px;padding:" +
          inst.options.bordersize +
          "px;text-align:center;'></div>" +
          "</div>" +
          "<div id='html5-next' style='display:none;cursor:pointer;position:absolute;right:" +
          inst.options.bordersize +
          "px;top:40%;'><img src='" +
          inst.options.skinfolder +
          inst.options.nextimage +
          "'></div>" +
          "<div id='html5-prev' style='display:none;cursor:pointer;position:absolute;left:" +
          inst.options.bordersize +
          "px;top:40%;'><img src='" +
          inst.options.skinfolder +
          inst.options.previmage +
          "'></div>" +
          "</div>" +
          "<div id='html5-elem-data-box' style='display:none;position:relative;width:100%;margin:0px auto;height:" +
          inst.options.barheight +
          "px;background-color:" +
          inst.options.bgcolor +
          ";'>" +
          "<div id='html5-text' style='display:block;float:left;overflow:hidden;margin-left:" +
          inst.options.bordersize +
          "px;'></div>" +
          "<div id='html5-close' style='display:block;cursor:pointer;float:right;margin-right:" +
          inst.options.bordersize +
          "px;'><img src='" +
          inst.options.skinfolder +
          inst.options.closeimage +
          "'></div>" +
          "</div>" +
          "<div id='html5-watermark' style='display:none;position:absolute;left:" +
          String(inst.options.bordersize + 2) +
          "px;top:" +
          String(inst.options.bordersize + 2) +
          "px;'></div>" +
          "</div>" +
          "</div>"
      );
      inst.$lightbox.css({
        position: inst.options.supportCSSPositionFixed ? "fixed" : "absolute",
      });
      inst.$lightbox.appendTo("body");
      inst.$lightboxBox = $("#html5-lightbox-box", inst.$lightbox);
      inst.$elem = $("#html5-elem-box", inst.$lightbox);
      inst.$elemWrap = $("#html5-elem-wrap", inst.$lightbox);
      inst.$loading = $("#html5-loading", inst.$lightbox);
      inst.$error = $("#html5-error", inst.$lightbox);
      inst.$image = $("#html5-image", inst.$lightbox);
      inst.$elemData = $("#html5-elem-data-box", inst.$lightbox);
      inst.$text = $("#html5-text", inst.$lightbox);
      inst.$next = $("#html5-next", inst.$lightbox);
      inst.$prev = $("#html5-prev", inst.$lightbox);
      inst.$close = $("#html5-close", inst.$lightbox);
      inst.$watermark = $("#html5-watermark", inst.$lightbox);
      if (inst.options.stamp)
        inst.$watermark.html(
          "<a href='" +
            inst.options.freelink +
            "' style='text-decoration:none;'><div style='display:block;width:120px;height:20px;text-align:center;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;filter:alpha(opacity=60);opacity:0.6;background-color:#333333;color:#ffffff;font:12px Armata,sans-serif,Arial;'><div style='line-height:20px;'>" +
            inst.options.freemark +
            "</div></div></a>"
        );
      else if (inst.options.watermark) {
        var html =
          "<img src='" + inst.options.watermark + "' style='border:none;' />";
        if (inst.options.watermarklink)
          html =
            "<a href='" +
            inst.options.watermarklink +
            "' target='_blank'>" +
            html +
            "</a>";
        inst.$watermark.html(html);
      }
      $("#html5-lightbox-overlay", inst.$lightbox).click(inst.finish);
      inst.$close.click(inst.finish);
      inst.$next.click(function () {
        inst.gotoSlide(-1);
      });
      inst.$prev.click(function () {
        inst.gotoSlide(-2);
      });
      $(window).resize(function () {
        if (!inst.options.isMobile) {
          clearTimeout(inst.options.resizeTimeout);
          inst.options.resizeTimeout = setTimeout(function () {
            inst.resizeWindow();
          }, 500);
        }
      });
      $(window).scroll(function () {
        inst.scrollBox();
      });
      $(window).bind("orientationchange", function (e) {
        if (inst.options.isMobile) inst.resizeWindow();
      });
      inst.enableSwipe();
    };
    inst.calcNextPrevElem = function () {
      inst.options.nextElem = -1;
      inst.options.prevElem = -1;
      var j,
        curGroup = inst.elemArray[inst.options.curElem][ELEM_GROUP];
      if (curGroup != undefined && curGroup != null) {
        for (j = inst.options.curElem + 1; j < inst.elemArray.length; j++)
          if (inst.elemArray[j][ELEM_GROUP] == curGroup) {
            inst.options.nextElem = j;
            break;
          }
        if (inst.options.nextElem < 0)
          for (j = 0; j < inst.options.curElem; j++)
            if (inst.elemArray[j][ELEM_GROUP] == curGroup) {
              inst.options.nextElem = j;
              break;
            }
        if (inst.options.nextElem >= 0) {
          for (j = inst.options.curElem - 1; j >= 0; j--)
            if (inst.elemArray[j][ELEM_GROUP] == curGroup) {
              inst.options.prevElem = j;
              break;
            }
          if (inst.options.prevElem < 0)
            for (j = inst.elemArray.length - 1; j > inst.options.curElem; j--)
              if (inst.elemArray[j][ELEM_GROUP] == curGroup) {
                inst.options.prevElem = j;
                break;
              }
        }
      }
    };
    inst.clickHandler = function () {
      if (inst.elemArray.length <= 0) return true;
      var $this = $(this);
      inst.hideObjects();
      for (var i = 0; i < inst.elemArray.length; i++)
        if (inst.elemArray[i][ELEM_HREF] == $this.attr("href")) break;
      if (i == inst.elemArray.length) return true;
      inst.options.curElem = i;
      inst.options.nextElem = -1;
      inst.options.prevElem = -1;
      inst.calcNextPrevElem();
      inst.$next.hide();
      inst.$prev.hide();
      inst.reset();
      inst.$lightbox.show();
      if (!inst.options.supportCSSPositionFixed)
        inst.$lightbox.css("top", $(window).scrollTop());
      var boxW = inst.options.loadingwidth + 2 * inst.options.bordersize;
      var boxH = inst.options.loadingheight + 2 * inst.options.bordersize;
      var boxT = Math.round(
        $(window).height() / 2 - (boxH + inst.options.barheight) / 2
      );
      inst.$lightboxBox.css({ "margin-top": boxT, width: boxW, height: boxH });
      inst.$elemWrap.css({ width: boxW, height: boxH });
      inst.loadCurElem();
      return false;
    };
    inst.loadElem = function (elem) {
      inst.showing = true;
      inst.$elem.unbind("mouseenter").unbind("mouseleave").unbind("mousemove");
      inst.$next.hide();
      inst.$prev.hide();
      inst.$loading.show();
      switch (elem[ELEM_TYPE]) {
        case 0:
          var imgLoader = new Image();
          $(imgLoader).load(function () {
            inst.showImage(elem, imgLoader.width, imgLoader.height);
          });
          $(imgLoader).error(function () {
            inst.showError();
          });
          imgLoader.src = elem[ELEM_HREF];
          break;
        case 1:
          inst.showSWF(elem);
          break;
        case 2:
          inst.showVideo(elem);
          break;
        case 3:
        case 4:
          inst.showYoutubeVimeo(elem);
          break;
        case 5:
          inst.showPDF(elem);
          break;
        case 6:
          inst.showMP3(elem);
          break;
        case 7:
          inst.showWeb(elem);
          break;
      }
    };
    inst.loadCurElem = function () {
      inst.loadElem(inst.elemArray[inst.options.curElem]);
    };
    inst.showError = function () {
      inst.$loading.hide();
      inst.resizeLightbox(
        inst.options.errorwidth,
        inst.options.errorheight,
        true,
        function () {
          inst.$error.show();
          inst.$elem.fadeIn(inst.options.fadespeed, function () {
            inst.showData();
          });
        }
      );
    };
    inst.calcTextWidth = function (objW) {
      var textW = objW - 36;
      if (inst.options.prevElem > 0 || inst.options.nextElem > 0) textW -= 36;
      return textW;
    };
    inst.showImage = function (elem, imgW, imgH) {
      var elemW, elemH;
      if (elem[ELEM_WIDTH]) elemW = elem[ELEM_WIDTH];
      else {
        elemW = imgW;
        elem[ELEM_WIDTH] = imgW;
      }
      if (elem[ELEM_HEIGHT]) elemH = elem[ELEM_HEIGHT];
      else {
        elemH = imgH;
        elem[ELEM_HEIGHT] = imgH;
      }
      var sizeObj = inst.calcElemSize({ w: elemW, h: elemH });
      inst.resizeLightbox(sizeObj.w, sizeObj.h, true, function () {
        inst.$text.css({ width: inst.calcTextWidth(sizeObj.w) });
        inst.$text.html(elem[ELEM_TITLE]);
        inst.$image.show().css({ width: sizeObj.w, height: sizeObj.h });
        inst.$image.html(
          "<img src='" +
            elem[ELEM_HREF] +
            "' width='" +
            sizeObj.w +
            "' height='" +
            sizeObj.h +
            "' />"
        );
        inst.$elem.fadeIn(inst.options.fadespeed, function () {
          inst.showData();
        });
      });
    };
    inst.showSWF = function (elem) {
      var dataW = elem[ELEM_WIDTH] ? elem[ELEM_WIDTH] : 480;
      var dataH = elem[ELEM_HEIGHT] ? elem[ELEM_HEIGHT] : 270;
      var sizeObj = inst.calcElemSize({ w: dataW, h: dataH });
      dataW = sizeObj.w;
      dataH = sizeObj.h;
      inst.resizeLightbox(dataW, dataH, true, function () {
        inst.$text.css({ width: inst.calcTextWidth(dataW) });
        inst.$text.html(elem[ELEM_TITLE]);
        inst.$image
          .html(
            "<div id='html5lightbox-swf' style='display:block;width:" +
              dataW +
              "px;height:" +
              dataH +
              "px;'></div>"
          )
          .show();
        inst.embedFlash(
          $("#html5lightbox-swf"),
          dataW,
          dataH,
          elem[ELEM_HREF],
          "window",
          { width: dataW, height: dataH }
        );
        inst.$elem.show();
        inst.showData();
      });
    };
    inst.showVideo = function (elem) {
      var dataW = elem[ELEM_WIDTH] ? elem[ELEM_WIDTH] : 480;
      var dataH = elem[ELEM_HEIGHT] ? elem[ELEM_HEIGHT] : 270;
      var sizeObj = inst.calcElemSize({ w: dataW, h: dataH });
      dataW = sizeObj.w;
      dataH = sizeObj.h;
      inst.resizeLightbox(dataW, dataH, true, function () {
        inst.$text.css({ width: inst.calcTextWidth(dataW) });
        inst.$text.html(elem[ELEM_TITLE]);
        inst.$image
          .html(
            "<div id='html5lightbox-video' style='display:block;width:" +
              dataW +
              "px;height:" +
              dataH +
              "px;'></div>"
          )
          .show();
        var isHTML5 = false;
        if (inst.options.isIE6789 || elem[ELEM_TYPE] == 8) isHTML5 = false;
        else if (inst.options.isMobile) isHTML5 = true;
        else if (
          (inst.options.html5player || !inst.options.flashInstalled) &&
          inst.options.html5VideoSupported
        )
          if (
            (!inst.options.isFirefox && !inst.options.isOpera) ||
            ((inst.options.isFirefox || inst.options.isOpera) &&
              (elem[ELEM_HREF_OGG] || elem[ELEM_HREF_WEBM]))
          )
            isHTML5 = true;
        if (isHTML5) {
          var videoSrc = elem[ELEM_HREF];
          if (inst.options.isFirefox || inst.options.isOpera || !videoSrc)
            videoSrc = elem[ELEM_HREF_WEBM]
              ? elem[ELEM_HREF_WEBM]
              : elem[ELEM_HREF_OGG];
          inst.embedHTML5Video(
            $("#html5lightbox-video"),
            dataW,
            dataH,
            videoSrc,
            inst.options.autoplay
          );
        } else {
          var videoFile = elem[ELEM_HREF];
          if (
            videoFile.charAt(0) != "/" &&
            videoFile.substring(0, 5) != "http:" &&
            videoFile.substring(0, 6) != "https:"
          )
            videoFile = inst.options.htmlfolder + videoFile;
          inst.embedFlash(
            $("#html5lightbox-video"),
            dataW,
            dataH,
            inst.options.jsfolder + "html5boxplayer.swf",
            "transparent",
            {
              width: dataW,
              height: dataH,
              videofile: videoFile,
              hdfile: "",
              ishd: "0",
              autoplay: inst.options.autoplay ? "1" : "0",
              errorcss: ".html5box-error" + inst.options.errorcss,
              id: 0,
            }
          );
        }
        inst.$elem.show();
        inst.showData();
      });
    };
    inst.prepareYoutubeHref = function (href) {
      var youtubeId = "";
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\??v?=?))([^#\&\?]*).*/;
      var match = href.match(regExp);
      if (match && match[7] && match[7].length == 11) youtubeId = match[7];
      return "http://www.youtube.com/embed/" + youtubeId;
    };
    inst.showYoutubeVimeo = function (elem) {
      var dataW = elem[ELEM_WIDTH] ? elem[ELEM_WIDTH] : 480;
      var dataH = elem[ELEM_HEIGHT] ? elem[ELEM_HEIGHT] : 270;
      var sizeObj = inst.calcElemSize({ w: dataW, h: dataH });
      dataW = sizeObj.w;
      dataH = sizeObj.h;
      inst.resizeLightbox(dataW, dataH, true, function () {
        inst.$text.css({ width: inst.calcTextWidth(dataW) });
        inst.$text.html(elem[ELEM_TITLE]);
        inst.$image
          .html(
            "<div id='html5lightbox-video' style='display:block;width:" +
              dataW +
              "px;height:" +
              dataH +
              "px;'></div>"
          )
          .show();
        var href = elem[ELEM_HREF];
        if (elem[ELEM_TYPE] == 3) href = inst.prepareYoutubeHref(href);
        if (inst.options.autoplay)
          if (href.indexOf("?") < 0) href += "?autoplay=1";
          else href += "&autoplay=1";
        if (elem[ELEM_TYPE] == 3)
          if (href.indexOf("?") < 0) href += "?wmode=transparent&rel=0";
          else href += "&wmode=transparent&rel=0";
        $("#html5lightbox-video").html(
          "<iframe width='" +
            dataW +
            "' height='" +
            dataH +
            "' src='" +
            href +
            "' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>"
        );
        inst.$elem.show();
        inst.showData();
      });
    };
    inst.showPDF = function (elem) {};
    inst.showMP3 = function (elem) {};
    inst.showWeb = function (elem) {
      var dataW = elem[ELEM_WIDTH] ? elem[ELEM_WIDTH] : $(window).width();
      var dataH = elem[ELEM_HEIGHT] ? elem[ELEM_HEIGHT] : $(window).height();
      var sizeObj = inst.calcElemSize({ w: dataW, h: dataH });
      dataW = sizeObj.w;
      dataH = sizeObj.h;
      inst.resizeLightbox(dataW, dataH, true, function () {
        inst.$text.css({ width: inst.calcTextWidth(dataW) });
        inst.$text.html(elem[ELEM_TITLE]);
        inst.$image
          .html(
            "<div id='html5lightbox-web' style='display:block;width:" +
              dataW +
              "px;height:" +
              dataH +
              "px;'></div>"
          )
          .show();
        $("#html5lightbox-web").html(
          "<iframe width='" +
            dataW +
            "' height='" +
            dataH +
            "' src='" +
            elem[ELEM_HREF] +
            "' frameborder='0'></iframe>"
        );
        inst.$elem.show();
        inst.showData();
      });
    };
    inst.scrollBox = function () {
      if (!inst.options.supportCSSPositionFixed)
        inst.$lightbox.css("top", $(window).scrollTop());
    };
    inst.resizeWindow = function () {
      var boxT = Math.round(
        $(window).height() / 2 -
          (inst.$lightboxBox.height() + inst.options.barheight) / 2
      );
      inst.$lightboxBox.animate(
        { "margin-top": boxT },
        inst.options.resizespeed
      );
    };
    inst.calcElemSize = function (sizeObj) {
      var winH = window.innerHeight ? window.innerHeight : $(window).height();
      var h0 =
        winH -
        2 * inst.options.bordersize -
        inst.options.barheight -
        ($(window).width() > 1024 ? 18 : 0);
      if (sizeObj.h > h0) {
        sizeObj.w = Math.round((sizeObj.w * h0) / sizeObj.h);
        sizeObj.h = h0;
      }
      var fullW = inst.options.isMobile
        ? Math.max($(window).width(), $(document).width())
        : $(window).width();
      var w0 = fullW - 2 * inst.options.bordersize;
      if (sizeObj.w > w0) {
        sizeObj.h = Math.round((sizeObj.h * w0) / sizeObj.w);
        sizeObj.w = w0;
      }
      return sizeObj;
    };
    inst.showData = function () {
      inst.$elemData.show();
      inst.$lightboxBox.animate(
        { height: inst.$lightboxBox.height() + inst.options.barheight },
        { queue: true, duration: inst.options.resizespeed }
      );
    };
    inst.resizeLightbox = function (elemW, elemH, bAnimate, onFinish) {
      var speed = bAnimate ? inst.options.resizespeed : 0;
      var boxW = elemW + 2 * inst.options.bordersize;
      var boxH = elemH + 2 * inst.options.bordersize;
      var winH = window.innerHeight ? window.innerHeight : $(window).height();
      var boxT = Math.round(winH / 2 - (boxH + inst.options.barheight) / 2);
      if (boxW == inst.$elemWrap.width() && boxH == inst.$elemWrap.height())
        speed = 0;
      inst.$loading.hide();
      inst.$watermark.hide();
      inst.$elem.bind("mouseenter mousemove", function () {
        if (inst.options.prevElem >= 0 || inst.options.nextElem >= 0) {
          inst.$next.fadeIn();
          inst.$prev.fadeIn();
        }
      });
      inst.$elem.bind("mouseleave", function () {
        inst.$next.fadeOut();
        inst.$prev.fadeOut();
      });
      inst.$lightboxBox.animate({ "margin-top": boxT }, speed, function () {
        inst.$lightboxBox.css({ width: boxW, height: boxH });
        inst.$elemWrap
          .animate({ width: boxW }, speed)
          .animate({ height: boxH }, speed, function () {
            inst.$loading.show();
            inst.$watermark.show();
            onFinish();
          });
      });
    };
    inst.reset = function () {
      if (inst.options.stamp) inst.$watermark.hide();
      inst.showing = false;
      inst.$image.empty();
      inst.$text.empty();
      inst.$error.hide();
      inst.$loading.hide();
      inst.$image.hide();
      inst.$elemData.hide();
    };
    inst.finish = function () {
      inst.reset();
      inst.$lightbox.hide();
      inst.showObjects();
      if (inst.onFinish) inst.onFinish();
    };
    inst.pauseSlide = function () {};
    inst.playSlide = function () {};
    inst.gotoSlide = function (slide) {
      if (slide == -1) {
        if (inst.options.nextElem < 0) return;
        inst.options.curElem = inst.options.nextElem;
      } else if (slide == -2) {
        if (inst.options.prevElem < 0) return;
        inst.options.curElem = inst.options.prevElem;
      }
      inst.calcNextPrevElem();
      inst.reset();
      inst.loadCurElem();
    };
    inst.supportKeyboard = function () {
      $(document).keyup(function (e) {
        if (!inst.showing) return;
        if (inst.options.supportesckey && e.keyCode == 27) inst.finish();
        else if (inst.options.supportarrowkeys)
          if (e.keyCode == 39) inst.gotoSlide(-1);
          else if (e.keyCode == 37) inst.gotoSlide(-2);
      });
    };
    inst.enableSwipe = function () {
      inst.$elem.touchSwipe({
        preventWebBrowser: true,
        swipeLeft: function () {
          inst.gotoSlide(-1);
        },
        swipeRight: function () {
          inst.gotoSlide(-2);
        },
      });
    };
    inst.hideObjects = function () {
      $("select, embed, object").css({ visibility: "hidden" });
    };
    inst.showObjects = function () {
      $("select, embed, object").css({ visibility: "visible" });
    };
    inst.embedHTML5Video = function ($container, w, h, src, autoplay) {
      $container.html(
        "<div style='position:absolute;display:block;width:" +
          w +
          "px;height:" +
          h +
          "px;'><video width=" +
          w +
          " height=" +
          h +
          (autoplay ? " autoplay" : "") +
          " controls='controls' src='" +
          src +
          "'></div>"
      );
      if (inst.options.isAndroid) {
        var $play = $(
          "<div style='position:absolute;display:block;cursor:pointer;width:" +
            w +
            "px;height:" +
            h +
            'px;background:url("' +
            inst.options.skinfolder +
            inst.options.playvideoimage +
            "\") no-repeat center center;'></div>"
        ).appendTo($container);
        $play.unbind("click").click(function () {
          $("video", $(this).parent())[0].play();
        });
      }
    };
    inst.embedFlash = function ($container, w, h, src, wmode, flashVars) {
      if (inst.options.flashInstalled) {
        var htmlOptions = {
          pluginspage: "http://www.adobe.com/go/getflashplayer",
          quality: "high",
          allowFullScreen: "true",
          allowScriptAccess: "always",
          type: "application/x-shockwave-flash",
        };
        htmlOptions.width = w;
        htmlOptions.height = h;
        htmlOptions.src = src;
        htmlOptions.flashVars = $.param(flashVars);
        htmlOptions.wmode = wmode;
        var htmlString = "";
        for (var key in htmlOptions)
          htmlString += key + "=" + htmlOptions[key] + " ";
        $container.html("<embed " + htmlString + "/>");
      } else
        $container.html(
          "<div class='html5lightbox-flash-error' style='display:block; position:relative;text-align:center; width:" +
            w +
            "px; left:0px; top:" +
            Math.round(h / 2 - 10) +
            "px;'><div class='html5-error'><div>The required Adobe Flash Player plugin is not installed</div><br /><div style='display:block;position:relative;text-align:center;width:112px;height:33px;margin:0px auto;'><a href='http://www.adobe.com/go/getflashplayer'><img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' width='112' height='33'></img></a></div></div>"
        );
    };
    inst.checkType = function (href) {
      if (!href) return -1;
      if (href.match(/\.(jpg|gif|png|bmp|jpeg)(.*)?$/i)) return 0;
      if (href.match(/[^\.]\.(swf)\s*$/i)) return 1;
      if (href.match(/\.(mp4|m4v|ogv|ogg|webm)(.*)?$/i)) return 2;
      if (
        href.match(/\:\/\/.*(youtube\.com)/i) ||
        href.match(/\:\/\/.*(youtu\.be)/i)
      )
        return 3;
      if (href.match(/\:\/\/.*(vimeo\.com)/i)) return 4;
      if (href.match(/[^\.]\.(pdf)\s*$/i)) return 5;
      if (href.match(/[^\.]\.(mp3)\s*$/i)) return 6;
      if (href.match(/[^\.]\.(flv)\s*$/i)) return 8;
      return 7;
    };
    inst.showLightbox = function (type, href, title, width, height, webm, ogg) {
      inst.$next.hide();
      inst.$prev.hide();
      inst.reset();
      inst.$lightbox.show();
      if (!inst.options.supportCSSPositionFixed)
        inst.$lightbox.css("top", $(window).scrollTop());
      var boxW = inst.options.loadingwidth + 2 * inst.options.bordersize;
      var boxH = inst.options.loadingheight + 2 * inst.options.bordersize;
      var boxT = Math.round(
        $(window).height() / 2 - (boxH + inst.options.barheight) / 2
      );
      inst.$lightboxBox.css({ "margin-top": boxT, width: boxW, height: boxH });
      inst.$elemWrap.css({ width: boxW, height: boxH });
      inst.loadElem(
        new Array(type, href, title, null, width, height, webm, ogg)
      );
    };
    inst.addItem = function (href, title, group, width, height, webm, ogg) {
      type = inst.checkType(href);
      inst.elemArray.push(
        new Array(type, href, title, group, width, height, webm, ogg)
      );
    };
    inst.showItem = function (href) {
      if (inst.elemArray.length <= 0) return true;
      inst.hideObjects();
      for (var i = 0; i < inst.elemArray.length; i++)
        if (inst.elemArray[i][ELEM_HREF] == href) break;
      if (i == inst.elemArray.length) return true;
      inst.options.curElem = i;
      inst.options.nextElem = -1;
      inst.options.prevElem = -1;
      inst.calcNextPrevElem();
      inst.$next.hide();
      inst.$prev.hide();
      inst.reset();
      inst.$lightbox.show();
      if (!inst.options.supportCSSPositionFixed)
        inst.$lightbox.css("top", $(window).scrollTop());
      var boxW = inst.options.loadingwidth + 2 * inst.options.bordersize;
      var boxH = inst.options.loadingheight + 2 * inst.options.bordersize;
      var boxT = Math.round(
        $(window).height() / 2 - (boxH + inst.options.barheight) / 2
      );
      inst.$lightboxBox.css({ "margin-top": boxT, width: boxW, height: boxH });
      inst.$elemWrap.css({ width: boxW, height: boxH });
      inst.loadCurElem();
      return false;
    };
    inst.init();
    return inst.unbind("click").click(inst.clickHandler);
  };
})(jQuery);
function ASliderTimer(interval, callback, updatecallback) {
  var timerInstance = this;
  timerInstance.timeout = interval;
  var updateinterval = 50;
  var updateTimerId = null;
  var runningTime = 0;
  var paused = false;
  var started = false;
  var startedandpaused = false;
  this.pause = function () {
    if (started) {
      paused = true;
      clearInterval(updateTimerId);
    }
  };
  this.resume = function (forceresume) {
    if (startedandpaused && !forceresume) return;
    startedandpaused = false;
    if (started && paused) {
      paused = false;
      updateTimerId = setInterval(function () {
        runningTime += updateinterval;
        if (runningTime > timerInstance.timeout) {
          clearInterval(updateTimerId);
          if (callback) callback();
        }
        if (updatecallback) updatecallback(runningTime / timerInstance.timeout);
      }, updateinterval);
    }
  };
  this.stop = function () {
    clearInterval(updateTimerId);
    if (updatecallback) updatecallback(-1);
    runningTime = 0;
    paused = false;
    started = false;
  };
  this.start = function () {
    runningTime = 0;
    paused = false;
    started = true;
    updateTimerId = setInterval(function () {
      runningTime += updateinterval;
      if (runningTime > timerInstance.timeout) {
        clearInterval(updateTimerId);
        if (callback) callback();
      }
      if (updatecallback) updatecallback(runningTime / timerInstance.timeout);
    }, updateinterval);
  };
  this.startandpause = function () {
    runningTime = 0;
    paused = true;
    started = true;
    startedandpaused = true;
  };
}
var ASPlatforms = {
  flashInstalled: function () {
    var flashInstalled = false;
    try {
      if (new ActiveXObject("ShockwaveFlash.ShockwaveFlash"))
        flashInstalled = true;
    } catch (e) {
      if (navigator.mimeTypes["application/x-shockwave-flash"])
        flashInstalled = true;
    }
    return flashInstalled;
  },
  html5VideoSupported: function () {
    return !!document.createElement("video").canPlayType;
  },
  isChrome: function () {
    return navigator.userAgent.match(/Chrome/i) != null;
  },
  isFirefox: function () {
    return navigator.userAgent.match(/Firefox/i) != null;
  },
  isOpera: function () {
    return (
      navigator.userAgent.match(/Opera/i) != null ||
      navigator.userAgent.match(/OPR\//i) != null
    );
  },
  isSafari: function () {
    return navigator.userAgent.match(/Safari/i) != null;
  },
  isAndroid: function () {
    return navigator.userAgent.match(/Android/i) != null;
  },
  isIPad: function () {
    return navigator.userAgent.match(/iPad/i) != null;
  },
  isIPhone: function () {
    return (
      navigator.userAgent.match(/iPod/i) != null ||
      navigator.userAgent.match(/iPhone/i) != null
    );
  },
  isIOS: function () {
    return this.isIPad() || this.isIPhone();
  },
  isMobile: function () {
    return this.isAndroid() || this.isIPad() || this.isIPhone();
  },
  isIE11: function () {
    return (
      navigator.userAgent.match(/Trident\/7/) != null &&
      navigator.userAgent.match(/rv:11/) != null
    );
  },
  isIE: function () {
    return (
      (navigator.userAgent.match(/MSIE/i) != null || this.isIE11()) &&
      !this.isOpera()
    );
  },
  isIE10: function () {
    return navigator.userAgent.match(/MSIE 10/i) != null && !this.isOpera();
  },
  isIE9: function () {
    return navigator.userAgent.match(/MSIE 9/i) != null && !this.isOpera();
  },
  isIE8: function () {
    return navigator.userAgent.match(/MSIE 8/i) != null && !this.isOpera();
  },
  isIE7: function () {
    return navigator.userAgent.match(/MSIE 7/i) != null && !this.isOpera();
  },
  isIE6: function () {
    return navigator.userAgent.match(/MSIE 6/i) != null && !this.isOpera();
  },
  isIE678: function () {
    return this.isIE6() || this.isIE7() || this.isIE8();
  },
  isIE6789: function () {
    return this.isIE6() || this.isIE7() || this.isIE8() || this.isIE9();
  },
  isTouch: function () {
    return "ontouchstart" in window;
  },
  css33dTransformSupported: function () {
    return !this.isIE() && !this.isOpera();
  },
  applyBrowserStyles: function (object, applyToValue) {
    var ret = {};
    for (var key in object) {
      ret[key] = object[key];
      ret["-webkit-" + key] = applyToValue
        ? "-webkit-" + object[key]
        : object[key];
      ret["-moz-" + key] = applyToValue ? "-moz-" + object[key] : object[key];
      ret["-ms-" + key] = applyToValue ? "-ms-" + object[key] : object[key];
      ret["-o-" + key] = applyToValue ? "-o-" + object[key] : object[key];
    }
    return ret;
  },
};
(function ($) {
  $.fn.amazingslider = function (options) {
    var ELEM_ID = 0,
      ELEM_SRC = 1,
      ELEM_TITLE = 2,
      ELEM_DESCRIPTION = 3,
      ELEM_LINK = 4,
      ELEM_TARGET = 5,
      ELEM_VIDEO = 6,
      ELEM_THUMBNAIL = 7,
      ELEM_LIGHTBOX = 8,
      ELEM_LIGHTBOXWIDTH = 9,
      ELEM_LIGHTBOXHEIGHT = 10,
      ELEM_WEBM = 11,
      ELEM_OGG = 12,
      ELEM_TEXTEFFECT = 13,
      ELEM_DURATION = 14;
    var TYPE_IMAGE = 1,
      TYPE_SWF = 2,
      TYPE_MP3 = 3,
      TYPE_PDF = 4,
      TYPE_VIDEO_FLASH = 5,
      TYPE_VIDEO_MP4 = 6,
      TYPE_VIDEO_OGG = 7,
      TYPE_VIDEO_WEBM = 8,
      TYPE_VIDEO_YOUTUBE = 9,
      TYPE_VIDEO_VIMEO = 10;
    var AmazingSlider = function (container, options, textoptions, id) {
      this.container = container;
      this.options = options;
      this.textoptions = textoptions;
      this.id = id;
      this.transitionTimeout = null;
      this.arrowTimeout = null;
      this.lightboxArray = [];
      this.elemArray = [];
      this.container.children().hide();
      this.container.css({ display: "block", position: "relative" });
      if (ASPlatforms.isMobile() && !this.options.navshowpreviewontouch)
        this.options.navshowpreview = false;
      this.initData(this.init);
      inst = this;
    };
    AmazingSlider.prototype = {
      initData: function (onSuccess) {
        this.readTags();
        onSuccess(this);
      },
      readTags: function () {
        var instance = this;
        $(".amazingslider-slides", this.container)
          .find("li")
          .each(function () {
            var img = $("img", $(this));
            if (img.length > 0) {
              var dataSrc =
                img.data("src") && img.data("src").length > 0
                  ? img.data("src")
                  : "";
              var src =
                img.attr("src") && img.attr("src").length > 0
                  ? img.attr("src")
                  : dataSrc;
              var title =
                img.attr("alt") && img.attr("alt").length > 0
                  ? img.attr("alt")
                  : "";
              var description =
                img.data("description") && img.data("description").length > 0
                  ? img.data("description")
                  : "";
              var link =
                img.parent() && img.parent().is("a")
                  ? img.parent().attr("href")
                  : "";
              var target =
                img.parent() && img.parent().is("a")
                  ? img.parent().attr("target")
                  : "";
              var lightbox =
                img.parent() && img.parent().is("a")
                  ? img.parent().hasClass("html5lightbox")
                  : false;
              var lightboxwidth =
                img.parent() && lightbox ? img.parent().data("width") : 0;
              var lightboxheight =
                img.parent() && lightbox ? img.parent().data("height") : 0;
              var dataWebm =
                img.parent() && img.parent().is("a")
                  ? img.parent().data("webm")
                  : "";
              var dataOgg =
                img.parent() && img.parent().is("a")
                  ? img.parent().data("ogg")
                  : "";
              var texteffect =
                img.data("texteffect") && img.data("texteffect").length > 0
                  ? img.data("texteffect")
                  : "";
              var duration = img.data("duration") ? img.data("duration") : 0;
              var video = [];
              if ($("video", $(this)).length > 0) {
                var $video = $("video", $(this));
                var videoSrc = $video.attr("src");
                var videoType = instance.checkVideoType($video.attr("src"));
                video.push({ href: videoSrc, type: videoType });
                if (videoType == TYPE_VIDEO_MP4)
                  if ($video.data("webm") && $video.data("webm").length > 0)
                    video.push({
                      href: $video.data("webm"),
                      type: TYPE_VIDEO_WEBM,
                    });
              }
              var elem = new Array(
                instance.elemArray.length,
                src,
                title,
                description,
                link,
                target,
                video,
                "",
                lightbox,
                lightboxwidth,
                lightboxheight,
                dataWebm,
                dataOgg,
                texteffect,
                duration
              );
              instance.elemArray.push(elem);
              if (lightbox) instance.lightboxArray.push(elem);
            }
          });
        $(".amazingslider-thumbnails", this.container)
          .find("li")
          .each(function (index) {
            var img = $("img", $(this));
            if (img.length > 0 && instance.elemArray.length > index) {
              var dataSrc =
                img.data("src") && img.data("src").length > 0
                  ? img.data("src")
                  : "";
              var src =
                img.attr("src") && img.attr("src").length > 0
                  ? img.attr("src")
                  : dataSrc;
              instance.elemArray[index][ELEM_THUMBNAIL] = src;
            }
          });
        if (this.options.shownumbering)
          for (var i = 0; i < this.elemArray.length; i++) {
            var prefix = this.options.numberingformat
              .replace("%NUM", i + 1)
              .replace("%TOTAL", this.elemArray.length);
            this.elemArray[i][ELEM_TITLE] =
              prefix + this.elemArray[i][ELEM_TITLE];
          }
      },
      init: function (instance) {
        if (instance.elemArray.length <= 0) return;
        var i;
        var elemLength = instance.elemArray.length;
        if (instance.options.randomplay) {
          for (i = elemLength - 1; i > 0; i--) {
            if (i == 1 && Math.random() < 0.5) break;
            var index = Math.floor(Math.random() * i);
            var temp = instance.elemArray[index];
            instance.elemArray[index] = instance.elemArray[i];
            instance.elemArray[i] = temp;
          }
          for (i = 0; i < elemLength; i++) instance.elemArray[i][ELEM_ID] = i;
        }
        instance.isAnimating = false;
        instance.isPaused = !instance.options.autoplay;
        instance.videoPaused = false;
        instance.lightboxPaused = false;
        instance.initVideoApi();
        instance.createMarkup();
        instance.createStyle();
        instance.createNav();
        instance.createArrows();
        instance.createBottomShadow();
        instance.createBackgroundImage();
        instance.createText();
        instance.createSliderTimeout();
        instance.createWm();
        instance.createRibbon();
        instance.createGoogleFonts();
        instance.initHtml5Lightbox();
        instance.curElem = -1;
        instance.prevElem = -1;
        instance.nextElem = -1;
        instance.firstslide = true;
        instance.loopCount = 0;
        instance.pauseCarousel = false;
        instance.curImageMarginTop = 0;
        instance.curImageMarginLeft = 0;
        instance.curImageMaxWidth = 100;
        instance.prevtextstyle = "";
        var firstSlide = 0;
        var params = instance.getParams();
        var paramValue = parseInt(params["firstslideid"]);
        if (
          !isNaN(paramValue) &&
          paramValue >= 1 &&
          paramValue <= instance.elemArray.length
        )
          firstSlide = paramValue - 1;
        instance.slideRun(firstSlide);
      },
      getParams: function () {
        var result = {};
        var params = window.location.search.substring(1).split("&");
        for (var i = 0; i < params.length; i++) {
          var value = params[i].split("=");
          if (value && value.length == 2)
            result[value[0].toLowerCase()] = unescape(value[1]);
        }
        return result;
      },
      initHtml5Lightbox: function () {
        var i;
        if (this.lightboxArray.length > 0) {
          var lightboxskinfolder =
            this.options.skinsfoldername.length > 0
              ? this.options.skinsfoldername + "/"
              : "";
          this.html5Lightbox = $([]).html5lightbox({
            jsfolder: this.options.jsfolder,
            skinfolder: lightboxskinfolder,
            barheight: this.options.lightboxbarheight,
            id: this.id,
          });
          for (i = 0; i < this.lightboxArray.length; i++)
            this.html5Lightbox.addItem(
              this.lightboxArray[i][ELEM_LINK],
              this.lightboxArray[i][ELEM_TITLE],
              "amazingslider" + this.id,
              this.lightboxArray[i][ELEM_LIGHTBOXWIDTH],
              this.lightboxArray[i][ELEM_LIGHTBOXHEIGHT],
              this.lightboxArray[i][ELEM_WEBM],
              this.lightboxArray[i][ELEM_OGG]
            );
          var instance = this;
          this.html5Lightbox.onFinish = function () {
            if (instance.lightboxPaused) {
              instance.lightboxPaused = false;
              instance.isPaused = false;
              instance.sliderTimeout.resume();
            }
          };
        }
      },
      createGoogleFonts: function () {
        if (this.options.previewmode) return;
        if (
          this.textoptions.addgooglefonts &&
          this.textoptions.googlefonts &&
          this.textoptions.googlefonts.length > 0
        ) {
          var fontRef =
            ("https:" == document.location.protocol ? "https" : "http") +
            "://fonts.googleapis.com/css?family=" +
            this.textoptions.googlefonts;
          var fontLink = document.createElement("link");
          fontLink.setAttribute("rel", "stylesheet");
          fontLink.setAttribute("type", "text/css");
          fontLink.setAttribute("href", fontRef);
          fontLink.setAttribute(
            "data-creator",
            "amazingslidercreator" + this.id
          );
          document.getElementsByTagName("head")[0].appendChild(fontLink);
        }
      },
      createRibbon: function () {
        if (!this.options.showribbon || this.options.ribbonimage.length <= 0)
          return;
        $(".amazingslider-ribbon-" + this.id, this.container).html(
          "<img src='" +
            this.options.skinsfolder +
            this.options.ribbonimage +
            "' style='border:none;' />"
        );
      },
      createWm: function () {
        if (!this.options.showwatermark) return;
        if (
          this.options.watermarkstyle == "text" &&
          this.options.watermarktext.length <= 0
        )
          return;
        if (
          this.options.watermarkstyle == "image" &&
          this.options.watermarkimage.length <= 0
        )
          return;
        var html = "";
        if (this.options.watermarklink) {
          html +=
            "<a href='" +
            this.options.watermarklink +
            "' style='" +
            this.options.watermarklinkcss +
            "'";
          if (this.options.watermarktitle)
            html += " title='" + this.options.watermarktitle + "'";
          if (this.options.watermarktarget)
            html += " target='" + this.options.watermarktarget + "'";
          html += ">";
        }
        if (this.options.watermarkstyle == "text")
          html += this.options.watermarktext;
        else if (this.options.watermarkstyle == "image")
          html +=
            "<img src='" +
            this.options.skinsfolder +
            this.options.watermarkimage +
            "' style='border:none;' />";
        if (this.options.watermarklink) html += "</a>";
        var stylecode = this.options.watermarkpositioncss;
        if (
          this.options.watermarkstyle == "text" &&
          this.options.watermarktext.length > 0
        )
          stylecode += this.options.watermarktextcss;
        if (this.options.watermarklink) stylecode += "cursor:pointer;";
        $(".amazingslider-slider-" + this.id, this.container).append(
          '<div style="' + stylecode + '">' + html + "</div>"
        );
      },
      initVideoApi: function () {
        var i, j, videos;
        var initYoutube = false,
          initVimeo = false;
        for (i = 0; i < this.elemArray.length; i++) {
          videos = this.elemArray[i][ELEM_VIDEO];
          for (j = 0; j < videos.length; j++)
            if (videos[j].type == TYPE_VIDEO_YOUTUBE) initYoutube = true;
            else if (videos[j].type == TYPE_VIDEO_VIMEO) initVimeo = true;
        }
        if (initYoutube) {
          var tag = document.createElement("script");
          tag.src =
            ("https:" == document.location.protocol ? "https" : "http") +
            "://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName("script")[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
        if (initVimeo) {
          var tag = document.createElement("script");
          tag.src = this.options.jsfolder + "froogaloop2.min.js";
          var firstScriptTag = document.getElementsByTagName("script")[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
      },
      createSliderTimeout: function () {
        var instance = this;
        this.sliderTimeout = new ASliderTimer(
          this.options.slideinterval,
          function () {
            instance.slideRun(-1);
          },
          this.options.showtimer
            ? function (percent) {
                instance.updateTimer(percent);
              }
            : null
        );
        if (instance.options.pauseonmouseover)
          $(".amazingslider-slider-" + this.id, this.container).hover(
            function () {
              if (!instance.isPaused) instance.sliderTimeout.pause();
            },
            function () {
              if (!instance.isPaused) instance.sliderTimeout.resume(false);
            }
          );
        if (instance.options.showtimer)
          $(".amazingslider-timer-" + instance.id, instance.container).css({
            display: "block",
            position: "absolute",
            left: "0px",
            top: instance.options.timerposition == "bottom" ? "" : "0px",
            bottom: instance.options.timerposition == "bottom" ? "0px" : "",
            width: "0%",
            height: instance.options.timerheight + "px",
            "background-color": instance.options.timercolor,
            opacity: instance.options.timeropacity,
            filter:
              "alpha(opacity=" +
              Math.round(100 * instance.options.timeropacity) +
              ")",
          });
      },
      updateTimer: function (percent) {
        w = Math.round(percent * 100);
        if (w > 100) w = 100;
        if (w < 0) w = 0;
        $(".amazingslider-timer-" + this.id, this.container).css({
          width: w + "%",
        });
      },
      createMarkup: function () {
        this.$wrapper = jQuery(
          "" +
            "<div class='amazingslider-wrapper-" +
            this.id +
            "'>" +
            "<div class='amazingslider-background-image-" +
            this.id +
            "'></div>" +
            "<div class='amazingslider-bottom-shadow-" +
            this.id +
            "'></div>" +
            "<div class='amazingslider-slider-" +
            this.id +
            "'>" +
            "<div class='amazingslider-box-" +
            this.id +
            "'>" +
            "<div class='amazingslider-swipe-box-" +
            this.id +
            "'>" +
            "<div class='amazingslider-space-" +
            this.id +
            "'></div>" +
            "<div class='amazingslider-img-box-" +
            this.id +
            "'></div>" +
            "<div class='amazingslider-lightbox-play-" +
            this.id +
            "'></div>" +
            "</div>" +
            "</div>" +
            "<div class='amazingslider-text-box-" +
            this.id +
            "'></div>" +
            "<div class='amazingslider-play-" +
            this.id +
            "'></div>" +
            "<div class='amazingslider-video-wrapper-" +
            this.id +
            "'></div>" +
            "<div class='amazingslider-ribbon-" +
            this.id +
            "'></div>" +
            "<div class='amazingslider-arrow-left-" +
            this.id +
            "'></div>" +
            "<div class='amazingslider-arrow-right-" +
            this.id +
            "'></div>" +
            "<div class='amazingslider-timer-" +
            this.id +
            "'></div>" +
            "</div>" +
            "<div class='amazingslider-nav-" +
            this.id +
            "'><div class='amazingslider-nav-container-" +
            this.id +
            "'></div></div>" +
            "</div>"
        );
        this.$wrapper.appendTo(this.container);
        var instance = this;
        if (this.options.enabletouchswipe)
          $(".amazingslider-swipe-box-" + this.id, this.container).touchSwipe({
            preventWebBrowser: false,
            swipeLeft: function () {
              instance.slideRun(-1);
            },
            swipeRight: function () {
              instance.slideRun(-2);
            },
          });
        $(".amazingslider-play-" + this.id, this.container).click(function () {
          instance.playVideo(true);
        });
      },
      playVideo: function (autoplay) {
        var videos = this.elemArray[this.curElem][ELEM_VIDEO];
        if (videos.length <= 0) return;
        this.sliderTimeout.stop();
        this.videoPaused = true;
        var href = videos[0].href;
        var type = videos[0].type;
        if (type == TYPE_VIDEO_YOUTUBE) this.playYoutubeVideo(href, autoplay);
        else if (type == TYPE_VIDEO_VIMEO) this.playVimeoVideo(href, autoplay);
        else if (type == TYPE_VIDEO_MP4) {
          var webmhref = videos.length > 1 ? videos[1].href : "";
          this.playMp4Video(href, webmhref, autoplay);
        }
      },
      playMp4Video: function (href, webmhref, autoplay) {
        var $videoWrapper = $(
          ".amazingslider-video-wrapper-" + this.id,
          this.container
        );
        $videoWrapper.css({ display: "block", width: "100%", height: "100%" });
        var isHTML5 = true;
        if (ASPlatforms.isIE6789()) isHTML5 = false;
        else if (
          (ASPlatforms.isFirefox() || ASPlatforms.isOpera()) &&
          !webmhref
        )
          isHTML5 = false;
        if (isHTML5) {
          var videoSrc =
            ASPlatforms.isFirefox() || ASPlatforms.isOpera() ? webmhref : href;
          this.embedHTML5Video($videoWrapper, videoSrc, autoplay);
        } else {
          var videoFile = href;
          if (
            videoFile.charAt(0) != "/" &&
            videoFile.substring(0, 5) != "http:" &&
            videoFile.substring(0, 6) != "https:"
          )
            videoFile = this.options.htmlfolder + videoFile;
          this.embedFlash(
            $videoWrapper,
            "100%",
            "100%",
            this.options.jsfolder + "html5boxplayer.swf",
            "transparent",
            {
              width: "100%",
              height: "100%",
              videofile: videoFile,
              hdfile: "",
              ishd: "0",
              autoplay: autoplay ? "1" : "0",
              errorcss: ".amazingslider-error" + this.options.errorcss,
              id: this.id,
            }
          );
        }
      },
      embedHTML5Video: function ($container, src, autoPlay) {
        $container.html(
          "<div class='amazingslider-video-container-" +
            this.id +
            "' style='position:relative;display:block;width:100%;height:100%;'><video style='width:100%;height:100%;' controls ></div>"
        );
        $("video", $container).get(0).setAttribute("src", src);
        if (autoPlay) $("video", $container).get(0).play();
        var instance = this;
        $("video", $container)
          .unbind("ended")
          .bind("ended", function () {
            instance.videoPaused = false;
            if (!instance.isPaused) instance.slideRun(-1);
          });
      },
      embedFlash: function ($container, w, h, src, wmode, flashVars) {
        if (ASPlatforms.flashInstalled()) {
          var htmlOptions = {
            pluginspage: "http://www.adobe.com/go/getflashplayer",
            quality: "high",
            allowFullScreen: "true",
            allowScriptAccess: "always",
            type: "application/x-shockwave-flash",
          };
          htmlOptions.width = w;
          htmlOptions.height = h;
          htmlOptions.src = src;
          htmlOptions.wmode = wmode;
          htmlOptions.flashVars = $.param(flashVars);
          var htmlString = "";
          for (var key in htmlOptions)
            htmlString += key + "=" + htmlOptions[key] + " ";
          $container.html("<embed " + htmlString + "/>");
        } else
          $container.html(
            "<div class='amazingslider-error-" +
              this.id +
              "' style='display:block; position:absolute; text-align:center; width:" +
              this.options.width +
              "px; left:0px; top:" +
              Math.round(this.options.height / 2 - 10) +
              "px;'><div>The required Adobe Flash Player plugin is not installed</div><br /><div style='display:block;position:relative;text-align:center;width:112px;height:33px;margin:0px auto;'><a href='http://www.adobe.com/go/getflashplayer'><img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' width='112' height='33'></img></a></div>"
          );
      },
      playVimeoVideo: function (href, autoplay) {
        var $videoWrapper = $(
          ".amazingslider-video-wrapper-" + this.id,
          this.container
        );
        $videoWrapper.css({ display: "block", width: "100%", height: "100%" });
        if (this.options.previewmode) {
          $videoWrapper.html(
            "<div class='amazingslider-error-" +
              this.id +
              "'>To view Vimeo video, publish the slider then open it in your web browser</div>"
          );
          return;
        } else {
          var src =
            href +
            (href.indexOf("?") < 0 ? "?" : "&") +
            "autoplay=" +
            (autoplay ? "1" : "0") +
            "&api=1&player_id=amazingslider_vimeo_" +
            this.id;
          $videoWrapper.html(
            "<iframe id='amazingslider_vimeo_" +
              this.id +
              "' width='" +
              this.options.width +
              "' height='" +
              this.options.height +
              "' src='" +
              src +
              "' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>"
          );
          var vimeoIframe = $("#amazingslider_vimeo_" + this.id)[0];
          var vimeoPlayer = $f(vimeoIframe);
          var instance = this;
          vimeoPlayer.addEvent("ready", function () {
            vimeoPlayer.addEvent("finish", function (id) {
              instance.videoPaused = false;
              if (!instance.isPaused) instance.slideRun(-1);
            });
          });
        }
      },
      playYoutubeVideo: function (href, autoplay) {
        var $videoWrapper = $(
          ".amazingslider-video-wrapper-" + this.id,
          this.container
        );
        $videoWrapper.css({ display: "block", width: "100%", height: "100%" });
        if (this.options.previewmode) {
          $videoWrapper.html(
            "<div class='amazingslider-error-" +
              this.id +
              "'>To view YouTube video, publish the slider then open it in your web browser</div>"
          );
          return;
        }
        var instance = this;
        if (!ASYouTubeIframeAPIReady) {
          ASYouTubeTimeout += 100;
          if (ASYouTubeTimeout < 3e3) {
            setTimeout(function () {
              instance.playYoutubeVideo(href, autoplay);
            }, 100);
            return;
          }
        }
        if (
          ASYouTubeIframeAPIReady &&
          !ASPlatforms.isIE6() &&
          !ASPlatforms.isIE7() &&
          !ASPlatforms.isIOS() &&
          !ASPlatforms.isAndroid()
        ) {
          $videoWrapper.html(
            "<div id='amazingslider-video-" +
              this.id +
              "' style='display:block;'></div>"
          );
          var id = href.match(
            /(\?v=|\/\d\/|\/embed\/|\/v\/|\.be\/)([a-zA-Z0-9\-\_]+)/
          )[2];
          new YT.Player("amazingslider-video-" + this.id, {
            width: instance.options.width,
            height: instance.options.height,
            videoId: id,
            playerVars: {
              autoplay: 1,
              rel: 0,
              autohide: 1,
              wmode: "transparent",
            },
            events: {
              onReady: function (event) {
                event.target.playVideo();
              },
              onStateChange: function (event) {
                if (event.data == YT.PlayerState.ENDED) {
                  instance.videoPaused = false;
                  if (!instance.isPaused) instance.slideRun(-1);
                }
              },
            },
          });
        } else {
          var src =
            href +
            (href.indexOf("?") < 0 ? "?" : "&") +
            "autoplay=1&wmode=transparent&rel=0&autohide=1";
          $videoWrapper.html(
            "<iframe width='" +
              instance.options.width +
              "' height='" +
              instance.options.height +
              "' src='" +
              src +
              "' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>"
          );
        }
      },
      checkVideoType: function (href) {
        if (!href) return -1;
        if (href.match(/\.(flv)(.*)?$/i)) return TYPE_VIDEO_FLASH;
        if (href.match(/\.(mp4|m4v)(.*)?$/i)) return TYPE_VIDEO_MP4;
        if (href.match(/\.(ogv|ogg)(.*)?$/i)) return TYPE_VIDEO_OGG;
        if (href.match(/\.(webm)(.*)?$/i)) return TYPE_VIDEO_WEBM;
        if (
          href.match(/\:\/\/.*(youtube\.com)/i) ||
          href.match(/\:\/\/.*(youtu\.be)/i)
        )
          return TYPE_VIDEO_YOUTUBE;
        if (href.match(/\:\/\/.*(vimeo\.com)/i)) return TYPE_VIDEO_VIMEO;
        return 0;
      },
      showTexteffect: function () {
        $(".amazingslider-text-wrapper-" + inst.id, inst.container).fadeIn();
      },
      hideTexteffect: function () {
        $(".amazingslider-text-wrapper-" + inst.id, inst.container).fadeOut();
      },
      createText: function () {
        if (!this.options.showtext || this.textoptions.textstyle == "none")
          return;
        var instance = this;
        this.container.bind("amazingslider.switchtext", function (
          event,
          prev,
          cur
        ) {
          $("head")
            .find("style")
            .each(function () {
              if (
                $(this).data("creator") ==
                  "amazingslidercreator" + instance.id &&
                $(this).data("csstype") == "texteffect"
              )
                $(this).remove();
            });
          var textHeadCss =
            "<style type='text/css' data-creator='amazingslidercreator" +
            instance.id +
            "' data-csstype='texteffect'>" +
            ".amazingslider-text-" +
            instance.id +
            " {" +
            instance.textoptions.textcss +
            "} " +
            ".amazingslider-text-bg-" +
            instance.id +
            " {" +
            instance.textoptions.textbgcss +
            "} " +
            ".amazingslider-title-" +
            instance.id +
            " {" +
            instance.textoptions.titlecss +
            "} " +
            ".amazingslider-description-" +
            instance.id +
            " {" +
            instance.textoptions.descriptioncss +
            "} ";
          if (instance.textoptions.texteffectresponsive)
            textHeadCss +=
              "@media (max-width: " +
              instance.textoptions.texteffectresponsivesize +
              "px) {" +
              ".amazingslider-title-" +
              instance.id +
              " {" +
              instance.textoptions.titlecssresponsive +
              "} " +
              ".amazingslider-description-" +
              instance.id +
              " {" +
              instance.textoptions.descriptioncssresponsive +
              "} " +
              "} ";
          textHeadCss += "</style>";
          $("head").append(textHeadCss);
          var $textBoxWrapper = $(
            ".amazingslider-text-box-" + instance.id,
            instance.container
          );
          $textBoxWrapper.html(
            "<div class='amazingslider-text-wrapper-" + instance.id + "'></div>"
          );
          $(".amazingslider-slider-" + instance.id, instance.container)
            .unbind("mouseenter", instance.showTexteffect)
            .unbind("mouseleave", instance.hideTexteffect);
          var $textWrapper = $(
            ".amazingslider-text-wrapper-" + instance.id,
            instance.container
          );
          if (instance.textoptions.textstyle == "static") {
            $textWrapper.html(
              "<div class='amazingslider-text-" +
                instance.id +
                "'>" +
                "<div class='amazingslider-text-bg-" +
                instance.id +
                "'></div>" +
                "<div class='amazingslider-title-" +
                instance.id +
                "'></div>" +
                "<div class='amazingslider-description-" +
                instance.id +
                "'></div>" +
                "</div>"
            );
            if (!instance.textoptions.textautohide)
              $textWrapper.css({ display: "block" });
            else if (instance.prevtextstyle != "static")
              $textWrapper.css({
                display: instance.textoptions.textautohide ? "none" : "block",
              });
            $textWrapper.css({
              width: "100%",
              height: "auto",
              position: "absolute",
            });
            if (instance.textoptions.textautohide)
              $(
                ".amazingslider-slider-" + instance.id,
                instance.container
              ).hover(instance.showTexteffect, instance.hideTexteffect);
            switch (instance.textoptions.textpositionstatic) {
              case "top":
                $textWrapper.css({
                  left: "0px",
                  top: "0px",
                  "margin-top":
                    instance.textoptions.textpositionmarginstatic + "px",
                });
                break;
              case "bottom":
                $textWrapper.css({
                  left: "0px",
                  bottom: "0px",
                  "margin-bottom":
                    instance.textoptions.textpositionmarginstatic + "px",
                });
                break;
              case "topoutside":
                $textWrapper.css({
                  left: "0px",
                  bottom: "100%",
                  "margin-bottom":
                    instance.textoptions.textpositionmarginstatic + "px",
                });
                break;
              case "bottomoutside":
                $textWrapper.css({
                  left: "0px",
                  top: "100%",
                  "margin-top":
                    instance.textoptions.textpositionmarginstatic + "px",
                });
                break;
            }
          } else {
            $textWrapper.html(
              "<div class='amazingslider-text-holding-" +
                instance.id +
                "' style='visibility:hidden;" +
                instance.textoptions.textcss +
                "'>" +
                "<div class='amazingslider-text-bg-" +
                instance.id +
                "'></div>" +
                "<div class='amazingslider-title-" +
                instance.id +
                "'></div>" +
                "<div class='amazingslider-description-" +
                instance.id +
                "'></div>" +
                "</div>" +
                "<div class='amazingslider-text-" +
                instance.id +
                "' style='position:absolute;top:0%;left:0%;" +
                (ASPlatforms.isIE678()
                  ? "opacity:inherit;filter:inherit;"
                  : "") +
                "'>" +
                "<div class='amazingslider-text-bg-" +
                instance.id +
                "'></div>" +
                "<div class='amazingslider-title-" +
                instance.id +
                "'></div>" +
                "<div class='amazingslider-description-" +
                instance.id +
                "'></div>" +
                "</div>"
            );
            $textWrapper.css({ display: "none", position: "absolute" });
          }
          instance.prevtextstyle = instance.textoptions.textstyle;
          var $textBg = $(
            ".amazingslider-text-bg-" + instance.id,
            instance.container
          );
          var $title = $(
            ".amazingslider-title-" + instance.id,
            instance.container
          );
          var $description = $(
            ".amazingslider-description-" + instance.id,
            instance.container
          );
          if (instance.textoptions.textstyle == "static") {
            $title.html(instance.elemArray[cur][ELEM_TITLE]);
            if (instance.elemArray[cur][ELEM_DESCRIPTION].length > 0)
              $description
                .html(instance.elemArray[cur][ELEM_DESCRIPTION])
                .css({ display: "block" });
            else $description.css({ display: "none" }).html("");
            if (
              !instance.elemArray[cur][ELEM_TITLE] &&
              !instance.elemArray[cur][ELEM_DESCRIPTION]
            )
              $textBg.hide();
            else $textBg.show();
          } else if (instance.textoptions.textstyle == "dynamic")
            if (
              !instance.elemArray[cur][ELEM_TITLE] &&
              !instance.elemArray[cur][ELEM_DESCRIPTION]
            )
              $textWrapper.fadeOut();
            else
              $textWrapper.fadeOut(function () {
                var pos = "bottomleft";
                var positions = instance.textoptions.textpositiondynamic;
                if (positions) {
                  positions = positions.split(",");
                  pos = positions[Math.floor(Math.random() * positions.length)];
                  pos = $.trim(pos.toLowerCase());
                }
                switch (pos) {
                  case "topleft":
                    $textWrapper.css({
                      left: "0px",
                      right: "",
                      top: "0px",
                      bottom: "",
                    });
                    $textWrapper.css({
                      margin:
                        instance.textoptions.textpositionmargintop +
                        "px " +
                        instance.textoptions.textpositionmarginleft +
                        "px",
                    });
                    break;
                  case "topright":
                    $textWrapper.css({
                      left: "",
                      right: "0px",
                      top: "0px",
                      bottom: "",
                    });
                    $textWrapper.css({
                      margin:
                        instance.textoptions.textpositionmargintop +
                        "px " +
                        instance.textoptions.textpositionmarginright +
                        "px",
                    });
                    break;
                  case "bottomleft":
                    $textWrapper.css({
                      left: "0px",
                      right: "",
                      top: "",
                      bottom: "0px",
                    });
                    $textWrapper.css({
                      margin:
                        instance.textoptions.textpositionmarginbottom +
                        "px " +
                        instance.textoptions.textpositionmarginleft +
                        "px",
                    });
                    break;
                  case "bottomright":
                    $textWrapper.css({
                      left: "",
                      right: "0px",
                      top: "",
                      bottom: "0px",
                    });
                    $textWrapper.css({
                      margin:
                        instance.textoptions.textpositionmarginbottom +
                        "px " +
                        instance.textoptions.textpositionmarginright +
                        "px",
                    });
                    break;
                }
                $title.html(instance.elemArray[cur][ELEM_TITLE]);
                if (instance.elemArray[cur][ELEM_DESCRIPTION].length > 0)
                  $description
                    .html(instance.elemArray[cur][ELEM_DESCRIPTION])
                    .css({ display: "block" });
                else $description.css({ display: "none" }).html("");
                var effect_dirs = ["left", "right", "top", "bottom"];
                var effect = null;
                var effects = instance.textoptions.texteffect;
                if (effects) {
                  effects = effects.split(",");
                  effect = effects[Math.floor(Math.random() * effects.length)];
                  effect = $.trim(effect.toLowerCase());
                }
                var $textBox = instance.textoptions.texteffectseparate
                  ? $(".amazingslider-title-" + instance.id, instance.container)
                  : $(".amazingslider-text-" + instance.id, instance.container);
                switch (effect) {
                  case "fade":
                    $textBox.css({ opacity: 0 });
                    $textBox
                      .delay(instance.textoptions.texteffectdelay)
                      .fadeTo(instance.textoptions.texteffectduration, 1);
                    break;
                  case "slide":
                    var effect_dir =
                      instance.textoptions.texteffectslidedirection;
                    if (effect_dir == "random")
                      effect_dir =
                        effect_dirs[
                          Math.floor(Math.random() * effect_dirs.length)
                        ];
                    if (effect_dir == "left") {
                      $textBox.css({
                        left:
                          "-" +
                          instance.textoptions.texteffectslidedistance +
                          "px",
                        opacity: 0,
                      });
                      $textBox
                        .delay(instance.textoptions.texteffectdelay)
                        .animate(
                          { left: "0px", opacity: 1 },
                          instance.textoptions.texteffectduration,
                          instance.textoptions.texteffecteasing
                        );
                    } else if (effect_dir == "right") {
                      $textBox.css({
                        left:
                          instance.textoptions.texteffectslidedistance + "px",
                        opacity: 0,
                      });
                      $textBox
                        .delay(instance.textoptions.texteffectdelay)
                        .animate(
                          { left: "0px", opacity: 1 },
                          instance.textoptions.texteffectduration,
                          instance.textoptions.texteffecteasing
                        );
                    } else if (effect_dir == "top") {
                      $textBox.css({
                        top:
                          "-" +
                          instance.textoptions.texteffectslidedistance +
                          "px",
                        opacity: 0,
                      });
                      $textBox
                        .delay(instance.textoptions.texteffectdelay)
                        .animate(
                          { top: "0px", opacity: 1 },
                          instance.textoptions.texteffectduration,
                          instance.textoptions.texteffecteasing
                        );
                    } else if (effect_dir == "bottom") {
                      $textBox.css({
                        top:
                          instance.textoptions.texteffectslidedistance + "px",
                        opacity: 0,
                      });
                      $textBox
                        .delay(instance.textoptions.texteffectdelay)
                        .animate(
                          { top: "0px", opacity: 1 },
                          instance.textoptions.texteffectduration,
                          instance.textoptions.texteffecteasing
                        );
                    }
                    break;
                  default:
                    $textBox.delay(instance.textoptions.texteffectdelay).show();
                }
                if (
                  instance.textoptions.texteffectseparate &&
                  instance.elemArray[cur][ELEM_DESCRIPTION].length > 0
                ) {
                  var effect1 = null;
                  var effects1 = instance.textoptions.texteffect1;
                  if (effects1) {
                    effects1 = effects1.split(",");
                    effect1 =
                      effects1[Math.floor(Math.random() * effects1.length)];
                    effect1 = $.trim(effect1.toLowerCase());
                  }
                  var $textBox1 = $(
                    ".amazingslider-description-" + instance.id,
                    instance.container
                  );
                  switch (effect1) {
                    case "fade":
                      $textBox1.css({ opacity: 0 });
                      $textBox1
                        .delay(instance.textoptions.texteffectdelay1)
                        .fadeTo(instance.textoptions.texteffectduration1, 1);
                      break;
                    case "slide":
                      var effect_dir1 =
                        instance.textoptions.texteffectslidedirection1;
                      if (effect_dir1 == "random")
                        effect_dir1 =
                          effect_dirs[
                            Math.floor(Math.random() * effect_dirs.length)
                          ];
                      if (effect_dir1 == "left") {
                        $textBox1.css({
                          left:
                            "-" +
                            instance.textoptions.texteffectslidedistance1 +
                            "px",
                          opacity: 0,
                        });
                        $textBox1
                          .delay(instance.textoptions.texteffectdelay1)
                          .animate(
                            { left: "0px", opacity: 1 },
                            instance.textoptions.texteffectduration1,
                            instance.textoptions.texteffecteasing1
                          );
                      } else if (effect_dir1 == "right") {
                        $textBox1.css({
                          left:
                            instance.textoptions.texteffectslidedistance1 +
                            "px",
                          opacity: 0,
                        });
                        $textBox1
                          .delay(instance.textoptions.texteffectdelay1)
                          .animate(
                            { left: "0px", opacity: 1 },
                            instance.textoptions.texteffectduration1,
                            instance.textoptions.texteffecteasing1
                          );
                      } else if (effect_dir1 == "top") {
                        $textBox1.css({
                          top:
                            "-" +
                            instance.textoptions.texteffectslidedistance1 +
                            "px",
                          opacity: 0,
                        });
                        $textBox1
                          .delay(instance.textoptions.texteffectdelay1)
                          .animate(
                            { top: "0px", opacity: 1 },
                            instance.textoptions.texteffectduration1,
                            instance.textoptions.texteffecteasing1
                          );
                      } else if (effect_dir1 == "bottom") {
                        $textBox1.css({
                          top:
                            instance.textoptions.texteffectslidedistance1 +
                            "px",
                          opacity: 0,
                        });
                        $textBox1
                          .delay(instance.textoptions.texteffectdelay1)
                          .animate(
                            { top: "0px", opacity: 1 },
                            instance.textoptions.texteffectduration1,
                            instance.textoptions.texteffecteasing1
                          );
                      }
                      break;
                    default:
                      $textBox1
                        .delay(instance.textoptions.texteffectdelay)
                        .show();
                  }
                }
                $textWrapper.show();
              });
        });
      },
      resizeSlider: function () {
        if (!this.container.parent() || !this.container.parent().width())
          return;
        this.options.width = this.container.parent().width();
        if (this.options.isfullscreen)
          this.options.height = this.container.parent().height();
        else
          this.options.height = Math.round(
            (this.options.width * this.options.originalheight) /
              this.options.originalwidth
          );
        $(".amazingslider-space-" + this.id, this.container).css({
          width: this.options.width,
          height: this.options.height,
        });
        this.container.css({
          width: this.options.width,
          height: this.options.height,
        });
      },
      createStyle: function () {
        if (
          !this.options.isresponsive ||
          !this.container.parent() ||
          !this.container.parent().width()
        ) {
          $(".amazingslider-space-" + this.id, this.container).css({
            width: this.options.width,
            height: this.options.height,
          });
          this.container.css({
            width: this.options.width,
            height: this.options.height,
          });
        } else {
          this.options.originalwidth = this.options.width;
          this.options.originalheight = this.options.height;
          this.resizeSlider();
          var instance = this;
          $(window).resize(function () {
            instance.resizeSlider();
          });
        }
        var styleCss =
          ".amazingslider-wrapper-" +
          this.id +
          " {display:block;position:relative;width:100%;height:auto;}";
        styleCss +=
          ".amazingslider-slider-" +
          this.id +
          " {display:block;position:relative;left:0px;top:0px;width:100%;height:auto;";
        if (this.options.border > 0)
          styleCss +=
            "margin-left:-" +
            this.options.border +
            "px;border-width:" +
            this.options.border +
            "px;border-style:solid;border-color:" +
            this.options.bordercolor +
            ";";
        if (this.options.borderradius > 0)
          styleCss +=
            "border-radius:" +
            this.options.borderradius +
            "px;-moz-border-radius:" +
            this.options.borderradius +
            "px;-webkit-border-radius:" +
            this.options.borderradius +
            "px;";
        if (this.options.showshadow) {
          var b =
            "0px 0px " +
            this.options.shadowsize +
            "px " +
            this.options.shadowcolor;
          styleCss +=
            "box-shadow:" +
            b +
            ";-moz-box-shadow:" +
            b +
            ";-webkit-box-shadow:" +
            b +
            ";";
          if (ASPlatforms.isIE678() || ASPlatforms.isIE9)
            styleCss +=
              "filter:progid:DXImageTransform.Microsoft.Shadow(color=" +
              this.options.shadowcolor +
              ",direction=135,strength=" +
              this.options.shadowsize +
              ");";
        }
        styleCss += "}";
        styleCss +=
          ".amazingslider-box-" +
          this.id +
          " {display:block;position:relative;left:0px;top:0px;width:100%;height:auto;}";
        styleCss +=
          ".amazingslider-swipe-box-" +
          this.id +
          " {display:block;position:relative;left:0px;top:0px;width:100%;height:auto;}";
        styleCss +=
          ".amazingslider-space-" +
          this.id +
          " {display:block;position:relative;left:0px;top:0px;width:100%;height:auto;visibility:hidden;line-height:0px;font-size:0px;}";
        styleCss +=
          ".amazingslider-img-box-" +
          this.id +
          " {display:block;position:absolute;left:0px;top:0px;width:100%;height:100%;}";
        styleCss +=
          ".amazingslider-lightbox-play-" +
          this.id +
          " {display:none;position:absolute;left:50%;top:50%;cursor:pointer;width:" +
          this.options.playvideoimagewidth +
          "px;height:" +
          this.options.playvideoimageheight +
          "px;margin-top:" +
          "-" +
          Math.round(this.options.playvideoimageheight / 2) +
          "px;margin-left:" +
          "-" +
          Math.round(this.options.playvideoimagewidth / 2) +
          "px; background:url('" +
          this.options.skinsfolder +
          this.options.playvideoimage +
          "') no-repeat left top;}";
        styleCss +=
          ".amazingslider-play-" +
          this.id +
          " {display:none;position:absolute;left:50%;top:50%;cursor:pointer;width:" +
          this.options.playvideoimagewidth +
          "px;height:" +
          this.options.playvideoimageheight +
          "px;margin-top:" +
          "-" +
          Math.round(this.options.playvideoimageheight / 2) +
          "px;margin-left:" +
          "-" +
          Math.round(this.options.playvideoimagewidth / 2) +
          "px; background:url('" +
          this.options.skinsfolder +
          this.options.playvideoimage +
          "') no-repeat left top;}";
        styleCss +=
          ".amazingslider-video-wrapper-" +
          this.id +
          " {display:none;position:absolute;left:0px;top:0px;background-color:#000;text-align:center;}";
        styleCss +=
          ".amazingslider-error-" +
          this.id +
          " {display:block;position:relative;margin:0 auto;width:80%;top:50%;color:#fff;font:16px Arial,Tahoma,Helvetica,sans-serif;}";
        if (this.options.showribbon) {
          styleCss +=
            ".amazingslider-ribbon-" +
            this.id +
            " {display:block;position:absolute;";
          switch (this.options.ribbonposition) {
            case "topleft":
              styleCss +=
                "left:" +
                this.options.ribbonimagex +
                "px;top:" +
                this.options.ribbonimagey +
                "px;";
              break;
            case "topright":
              styleCss +=
                "right:" +
                this.options.ribbonimagex +
                "px;top:" +
                this.options.ribbonimagey +
                "px;";
              break;
            case "bottomleft":
              styleCss +=
                "left:" +
                this.options.ribbonimagex +
                "px;bottom:" +
                this.options.ribbonimagey +
                "px;";
              break;
            case "bottomright":
              styleCss +=
                "right:" +
                this.options.ribbonimagex +
                "px;bottom:" +
                this.options.ribbonimagey +
                "px;";
              break;
            case "top":
              styleCss +=
                "width:100%;height:auto;margin:0 auto;top:" +
                this.options.ribbonimagey +
                "px;";
            case "bottom":
              styleCss +=
                "width:100%;height:auto;text-align:center;bottom:" +
                this.options.ribbonimagey +
                "px;";
          }
          styleCss += "}";
        }
        styleCss +=
          ".amazingslider-video-wrapper-" +
          this.id +
          " video {max-width:100%;height:auto;}";
        styleCss +=
          ".amazingslider-video-wrapper-" +
          this.id +
          " iframe, " +
          ".amazingslider-video-wrapper-" +
          this.id +
          " object, " +
          ".amazingslider-video-wrapper-" +
          this.id +
          " embed {position:absolute;top:0;left:0;width:100%;height:100%;}";
        if (
          this.options.navstyle == "thumbnails" &&
          this.options.navthumbstyle != "imageonly"
        ) {
          styleCss +=
            ".amazingslider-nav-thumbnail-tite-" +
            this.id +
            " {" +
            this.options.navthumbtitlecss +
            "}";
          styleCss +=
            ".amazingslider-nav-thumbnail-tite-" +
            this.id +
            ":hover {" +
            this.options.navthumbtitlehovercss +
            "}";
          if (
            this.options.navthumbstyle == "imageandtitledescription" ||
            this.options.navthumbstyle == "textonly"
          )
            styleCss +=
              ".amazingslider-nav-thumbnail-description-" +
              this.id +
              " {" +
              this.options.navthumbdescriptioncss +
              "}";
        }
        $("head").append(
          "<style type='text/css' data-creator='amazingslidercreator" +
            this.id +
            "'>" +
            styleCss +
            "</style>"
        );
      },
      createBottomShadow: function () {
        if (!this.options.showbottomshadow) return;
        var $shadow = $(
          ".amazingslider-bottom-shadow-" + this.id,
          this.container
        );
        var l = (100 - this.options.bottomshadowimagewidth) / 2;
        $shadow.css({
          display: "block",
          position: "absolute",
          left: l + "%",
          top: this.options.bottomshadowimagetop + "%",
          width: this.options.bottomshadowimagewidth + "%",
          height: "auto",
        });
        $shadow.html(
          "<img src='" +
            this.options.skinsfolder +
            this.options.bottomshadowimage +
            "' style='display:block;position:relative;width:100%;height:auto;max-width:100%;' />"
        );
      },
      createBackgroundImage: function () {
        if (!this.options.showbackgroundimage || !this.options.backgroundimage)
          return;
        var $background = $(
          ".amazingslider-background-image-" + this.id,
          this.container
        );
        var l = (100 - this.options.backgroundimagewidth) / 2;
        $background.css({
          display: "block",
          position: "absolute",
          left: l + "%",
          top: this.options.backgroundimagetop + "%",
          width: this.options.backgroundimagewidth + "%",
          height: "auto",
        });
        $background.html(
          "<img src='" +
            this.options.skinsfolder +
            this.options.backgroundimage +
            "' style='display:block;position:relative;width:100%;height:auto;' />"
        );
      },
      createArrows: function () {
        if (this.options.arrowstyle == "none") return;
        var instance = this;
        var $leftArrow = $(
          ".amazingslider-arrow-left-" + this.id,
          this.container
        );
        var $rightArrow = $(
          ".amazingslider-arrow-right-" + this.id,
          this.container
        );
        $leftArrow.css({
          overflow: "hidden",
          position: "absolute",
          cursor: "pointer",
          width: this.options.arrowwidth + "px",
          height: this.options.arrowheight + "px",
          left: this.options.arrowmargin + "px",
          top: this.options.arrowtop + "%",
          "margin-top": "-" + this.options.arrowheight / 2 + "px",
          background:
            "url('" + this.options.arrowimage + "') no-repeat left top",
        });
        if (ASPlatforms.isIE678())
          $leftArrow.css({ opacity: "inherit", filter: "inherit" });
        $leftArrow.hover(
          function () {
            $(this).css({ "background-position": "left bottom" });
          },
          function () {
            $(this).css({ "background-position": "left top" });
          }
        );
        $leftArrow.click(function () {
          instance.slideRun(-2);
        });
        $rightArrow.css({
          overflow: "hidden",
          position: "absolute",
          cursor: "pointer",
          width: this.options.arrowwidth + "px",
          height: this.options.arrowheight + "px",
          right: this.options.arrowmargin + "px",
          top: this.options.arrowtop + "%",
          "margin-top": "-" + this.options.arrowheight / 2 + "px",
          background:
            "url('" + this.options.arrowimage + "') no-repeat right top",
        });
        if (ASPlatforms.isIE678())
          $rightArrow.css({ opacity: "inherit", filter: "inherit" });
        $rightArrow.hover(
          function () {
            $(this).css({ "background-position": "right bottom" });
          },
          function () {
            $(this).css({ "background-position": "right top" });
          }
        );
        $rightArrow.click(function () {
          instance.slideRun(-1);
        });
        if (this.options.arrowstyle == "always") {
          $leftArrow.css({ display: "block" });
          $rightArrow.css({ display: "block" });
        } else {
          $leftArrow.css({ display: "none" });
          $rightArrow.css({ display: "none" });
          $(".amazingslider-slider-" + this.id, this.container).hover(
            function () {
              clearTimeout(instance.arrowTimeout);
              if (ASPlatforms.isIE678()) {
                $(
                  ".amazingslider-arrow-left-" + instance.id,
                  instance.container
                ).show();
                $(
                  ".amazingslider-arrow-right-" + instance.id,
                  instance.container
                ).show();
              } else {
                $(
                  ".amazingslider-arrow-left-" + instance.id,
                  instance.container
                ).fadeIn();
                $(
                  ".amazingslider-arrow-right-" + instance.id,
                  instance.container
                ).fadeIn();
              }
            },
            function () {
              instance.arrowTimeout = setTimeout(function () {
                if (ASPlatforms.isIE678()) {
                  $(
                    ".amazingslider-arrow-left-" + instance.id,
                    instance.container
                  ).hide();
                  $(
                    ".amazingslider-arrow-right-" + instance.id,
                    instance.container
                  ).hide();
                } else {
                  $(
                    ".amazingslider-arrow-left-" + instance.id,
                    instance.container
                  ).fadeOut();
                  $(
                    ".amazingslider-arrow-right-" + instance.id,
                    instance.container
                  ).fadeOut();
                }
              }, instance.options.arrowhideonmouseleave);
            }
          );
        }
      },
      carMoveLeft: function () {
        var $navContainer = $(
          ".amazingslider-nav-container-" + this.id,
          this.container
        );
        var $bulletWrapper = $(
          ".amazingslider-bullet-wrapper-" + this.id,
          this.container
        );
        if ($navContainer.width() >= $bulletWrapper.width()) return;
        if (this.options.navshowpreview)
          $(".amazingslider-nav-preview-" + this.id, this.container).hide();
        var dist = $navContainer.width() + this.options.navspacing;
        var l =
          (isNaN(parseInt($bulletWrapper.css("margin-left")))
            ? 0
            : parseInt($bulletWrapper.css("margin-left"))) - dist;
        if (l <= $navContainer.width() - $bulletWrapper.width())
          l = $navContainer.width() - $bulletWrapper.width();
        if (l >= 0) l = 0;
        $bulletWrapper.animate(
          { "margin-left": l },
          { queue: false, duration: 500, easing: "easeOutCirc" }
        );
        if (this.options.navthumbnavigationstyle != "auto")
          this.updateCarouselLeftRightArrow(l);
      },
      carMoveRight: function () {
        var $navContainer = $(
          ".amazingslider-nav-container-" + this.id,
          this.container
        );
        var $bulletWrapper = $(
          ".amazingslider-bullet-wrapper-" + this.id,
          this.container
        );
        if ($navContainer.width() >= $bulletWrapper.width()) return;
        if (this.options.navshowpreview)
          $(".amazingslider-nav-preview-" + this.id, this.container).hide();
        var dist = $navContainer.width() + this.options.navspacing;
        var l =
          (isNaN(parseInt($bulletWrapper.css("margin-left")))
            ? 0
            : parseInt($bulletWrapper.css("margin-left"))) + dist;
        if (l <= $navContainer.width() - $bulletWrapper.width())
          l = $navContainer.width() - $bulletWrapper.width();
        if (l >= 0) l = 0;
        $bulletWrapper.animate(
          { "margin-left": l },
          { queue: false, duration: 500, easing: "easeOutCirc" }
        );
        if (this.options.navthumbnavigationstyle != "auto")
          this.updateCarouselLeftRightArrow(l);
      },
      carMoveBottom: function () {
        var $navContainer = $(
          ".amazingslider-nav-container-" + this.id,
          this.container
        );
        var $bulletWrapper = $(
          ".amazingslider-bullet-wrapper-" + this.id,
          this.container
        );
        if ($navContainer.height() >= $bulletWrapper.height()) return;
        if (this.options.navshowpreview)
          $(".amazingslider-nav-preview-" + this.id, this.container).hide();
        var dist = $navContainer.height() + this.options.navspacing;
        var l =
          (isNaN(parseInt($bulletWrapper.css("margin-top")))
            ? 0
            : parseInt($bulletWrapper.css("margin-top"))) + dist;
        if (l <= $navContainer.height() - $bulletWrapper.height())
          l = $navContainer.height() - $bulletWrapper.height();
        if (l >= 0) l = 0;
        $bulletWrapper.animate(
          { "margin-top": l },
          { queue: false, duration: 500, easing: "easeOutCirc" }
        );
        if (this.options.navthumbnavigationstyle != "auto")
          this.updateCarouselLeftRightArrow(l);
      },
      carMoveTop: function () {
        var $navContainer = $(
          ".amazingslider-nav-container-" + this.id,
          this.container
        );
        var $bulletWrapper = $(
          ".amazingslider-bullet-wrapper-" + this.id,
          this.container
        );
        if ($navContainer.height() >= $bulletWrapper.height()) return;
        if (this.options.navshowpreview)
          $(".amazingslider-nav-preview-" + this.id, this.container).hide();
        var dist = $navContainer.height() + this.options.navspacing;
        var l =
          (isNaN(parseInt($bulletWrapper.css("margin-top")))
            ? 0
            : parseInt($bulletWrapper.css("margin-top"))) - dist;
        if (l <= $navContainer.height() - $bulletWrapper.height())
          l = $navContainer.height() - $bulletWrapper.height();
        if (l >= 0) l = 0;
        $bulletWrapper.animate(
          { "margin-top": l },
          { queue: false, duration: 500, easing: "easeOutCirc" }
        );
        if (this.options.navthumbnavigationstyle != "auto")
          this.updateCarouselLeftRightArrow(l);
      },
      updateCarouselLeftRightArrow: function (l) {
        var $navContainer = $(
          ".amazingslider-nav-container-" + this.id,
          this.container
        );
        var $bulletWrapper = $(
          ".amazingslider-bullet-wrapper-" + this.id,
          this.container
        );
        if (this.options.navdirection == "vertical") {
          if (l == 0) {
            $(".amazingslider-car-left-arrow-" + this.id, this.container).css({
              "background-position": "left bottom",
              cursor: "",
            });
            $(".amazingslider-car-left-arrow-" + this.id, this.container).data(
              "disabled",
              true
            );
          } else {
            $(".amazingslider-car-left-arrow-" + this.id, this.container).css({
              "background-position": "left top",
              cursor: "pointer",
            });
            $(".amazingslider-car-left-arrow-" + this.id, this.container).data(
              "disabled",
              false
            );
          }
          if (l == $navContainer.height() - $bulletWrapper.height()) {
            $(".amazingslider-car-right-arrow-" + this.id, this.container).css({
              "background-position": "right bottom",
              cursor: "",
            });
            $(".amazingslider-car-right-arrow-" + this.id, this.container).data(
              "disabled",
              true
            );
          } else {
            $(".amazingslider-car-right-arrow-" + this.id, this.container).css({
              "background-position": "right top",
              cursor: "pointer",
            });
            $(".amazingslider-car-right-arrow-" + this.id, this.container).data(
              "disabled",
              false
            );
          }
        } else {
          if (l == 0) {
            $(".amazingslider-car-left-arrow-" + this.id, this.container).css({
              "background-position": "left bottom",
              cursor: "",
            });
            $(".amazingslider-car-left-arrow-" + this.id, this.container).data(
              "disabled",
              true
            );
          } else {
            $(".amazingslider-car-left-arrow-" + this.id, this.container).css({
              "background-position": "left top",
              cursor: "pointer",
            });
            $(".amazingslider-car-left-arrow-" + this.id, this.container).data(
              "disabled",
              false
            );
          }
          if (l == $navContainer.width() - $bulletWrapper.width()) {
            $(".amazingslider-car-right-arrow-" + this.id, this.container).css({
              "background-position": "right bottom",
              cursor: "",
            });
            $(".amazingslider-car-right-arrow-" + this.id, this.container).data(
              "disabled",
              true
            );
          } else {
            $(".amazingslider-car-right-arrow-" + this.id, this.container).css({
              "background-position": "right top",
              cursor: "pointer",
            });
            $(".amazingslider-car-right-arrow-" + this.id, this.container).data(
              "disabled",
              false
            );
          }
        }
      },
      createNav: function () {
        if (this.options.navstyle == "none" && !this.options.navshowbuttons)
          return;
        var instance = this;
        var i;
        var $nav = $(".amazingslider-nav-" + this.id, this.container);
        var $navContainer = $(
          ".amazingslider-nav-container-" + this.id,
          this.container
        );
        var $bulletWrapper = $(
          "<div class='amazingslider-bullet-wrapper-" +
            this.id +
            "' style='display:block;position:relative;'></div>"
        );
        if (this.options.navstyle == "thumbnails") {
          this.options.navimagewidth =
            this.options.navwidth - this.options.navborder * 2;
          this.options.navimageheight =
            this.options.navheight - this.options.navborder * 2;
          if (this.options.navthumbstyle == "imageandtitle")
            this.options.navheight += this.options.navthumbtitleheight;
          else if (
            this.options.navthumbstyle == "imageandtitledescription" ||
            this.options.navthumbstyle == "textonly"
          )
            this.options.navwidth += this.options.navthumbtitlewidth;
        }
        if (this.options.navdirection == "vertical") {
          var len =
            this.options.navstyle == "none"
              ? 0
              : this.elemArray.length * this.options.navheight +
                (this.elemArray.length - 1) * this.options.navspacing;
          if (this.options.navshowbuttons) {
            if (this.options.navshowarrow) {
              len += len > 0 ? this.options.navspacing : 0;
              len += 2 * this.options.navheight + this.options.navspacing;
            }
            if (
              this.options.navshowplaypause &&
              !this.options.navshowplaypausestandalone
            ) {
              len += len > 0 ? this.options.navspacing : 0;
              len += this.options.navheight;
            }
          }
          $bulletWrapper.css({ height: len + "px", width: "auto" });
        } else {
          var len =
            this.options.navstyle == "none"
              ? 0
              : this.elemArray.length * this.options.navwidth +
                (this.elemArray.length - 1) * this.options.navspacing;
          if (this.options.navshowbuttons) {
            if (this.options.navshowarrow) {
              len += len > 0 ? this.options.navspacing : 0;
              len += 2 * this.options.navwidth + this.options.navspacing;
            }
            if (
              this.options.navshowplaypause &&
              !this.options.navshowplaypausestandalone
            ) {
              len += len > 0 ? this.options.navspacing : 0;
              len += this.options.navwidth;
            }
          }
          $bulletWrapper.css({ width: len + "px", height: "auto" });
        }
        $navContainer.append($bulletWrapper);
        var bulletPos = 0;
        var bulletSize =
          this.options.navdirection == "vertical"
            ? this.options.navwidth
            : this.options.navheight;
        if (
          this.options.navstyle == "thumbnails" &&
          this.options.navshowfeaturedarrow
        ) {
          bulletSize +=
            this.options.navdirection == "vertical"
              ? this.options.navfeaturedarrowimagewidth
              : this.options.navfeaturedarrowimageheight;
          bulletPos =
            this.options.navdirection == "vertical"
              ? this.options.navfeaturedarrowimagewidth
              : this.options.navfeaturedarrowimageheight;
        }
        var navmarginX =
          "navmarginx" in this.options
            ? this.options.navmarginx
            : this.options.navmargin;
        var navmarginY =
          "navmarginy" in this.options
            ? this.options.navmarginy
            : this.options.navmargin;
        $nav.css({ display: "block", position: "absolute", height: "auto" });
        switch (this.options.navposition) {
          case "top":
            $bulletWrapper.css({
              "margin-left": "auto",
              "margin-right": "auto",
              height: bulletSize + "px",
            });
            $nav.css({
              overflow: "hidden",
              width: "100%",
              top: "0%",
              left: "0px",
              "margin-top": navmarginY + "px",
            });
            break;
          case "topleft":
            $bulletWrapper.css({ height: bulletSize + "px" });
            $nav.css({
              overflow: "hidden",
              "max-width": "100%",
              top: "0px",
              left: "0px",
              "margin-top": navmarginY + "px",
              "margin-left": navmarginX + "px",
            });
            break;
          case "topright":
            $bulletWrapper.css({ height: bulletSize + "px" });
            $nav.css({
              overflow: "hidden",
              "max-width": "100%",
              top: "0px",
              right: "0px",
              "margin-top": navmarginY + "px",
              "margin-right": navmarginX + "px",
            });
            break;
          case "bottom":
            $bulletWrapper.css({
              "margin-left": "auto",
              "margin-right": "auto",
              "margin-top": bulletPos + "px",
            });
            $nav.css({
              overflow: "hidden",
              width: "100%",
              top: "100%",
              left: "0px",
              "margin-top": String(navmarginY - bulletPos) + "px",
            });
            break;
          case "bottomleft":
            $bulletWrapper.css({ "margin-top": bulletPos + "px" });
            $nav.css({
              overflow: "hidden",
              "max-width": "100%",
              bottom: "0px",
              left: "0px",
              "margin-bottom": navmarginY + "px",
              "margin-top": String(navmarginY - bulletPos) + "px",
              "margin-left": navmarginX + "px",
            });
            break;
          case "bottomright":
            $bulletWrapper.css({ "margin-top": bulletPos + "px" });
            $nav.css({
              overflow: "hidden",
              "max-width": "100%",
              bottom: "0px",
              right: "0px",
              "margin-bottom": navmarginY + "px",
              "margin-top": String(navmarginY - bulletPos) + "px",
              "margin-right": navmarginX + "px",
            });
            break;
          case "left":
            $bulletWrapper.css({ width: bulletSize + "px" });
            $nav.css({
              overflow: "hidden",
              height: "100%",
              width: bulletSize + "px",
              top: "0%",
              left: "0%",
              "margin-left": navmarginX + "px",
            });
            $navContainer.css({
              display: "block",
              position: "absolute",
              top: "0px",
              bottom: "0px",
              left: "0px",
              right: "0px",
              height: "auto",
            });
            break;
          case "right":
            $bulletWrapper.css({ "margin-left": bulletPos + "px" });
            $nav.css({
              overflow: "hidden",
              height: "100%",
              width: bulletSize + "px",
              top: "0%",
              left: "100%",
              "margin-left": String(navmarginX - bulletPos) + "px",
            });
            $navContainer.css({
              display: "block",
              position: "absolute",
              top: "0px",
              bottom: "0px",
              left: "0px",
              right: "0px",
              height: "auto",
            });
            break;
        }
        if (this.options.navstyle != "none") {
          var $bullet;
          for (i = 0; i < this.elemArray.length; i++) {
            $bullet = this.createNavBullet(i);
            $bulletWrapper.append($bullet);
          }
          $nav.mouseenter(function () {
            instance.pauseCarousel = true;
          });
          $nav.mouseleave(function () {
            instance.pauseCarousel = false;
          });
          if (instance.options.navthumbnavigationstyle == "auto")
            $nav.mousemove(function (e) {
              if (instance.options.navdirection == "vertical") {
                if ($nav.height() >= $bulletWrapper.height()) return;
                var d = e.pageY - $nav.offset().top;
                if (d < 10) d = 0;
                if (d > $nav.height() - 10) d = $nav.height();
                var r = d / $nav.height();
                var l = ($nav.height() - $bulletWrapper.height()) * r;
                $bulletWrapper.animate(
                  { "margin-top": l },
                  { queue: false, duration: 20, easing: "easeOutCubic" }
                );
              } else {
                if ($nav.width() >= $bulletWrapper.width()) return;
                var d = e.pageX - $nav.offset().left;
                if (d < 10) d = 0;
                if (d > $nav.width() - 10) d = $nav.width();
                var r = d / $nav.width();
                var l = ($nav.width() - $bulletWrapper.width()) * r;
                $bulletWrapper.animate(
                  { "margin-left": l },
                  { queue: false, duration: 20, easing: "easeOutCubic" }
                );
              }
            });
          else if (
            (instance.options.navdirection == "vertical" &&
              $bulletWrapper.height() > $navContainer.height()) ||
            (instance.options.navdirection == "horizontal" &&
              $bulletWrapper.width() > $navContainer.width())
          ) {
            var m =
              instance.options.navthumbnavigationarrowimagewidth +
              instance.options.navspacing;
            if (instance.options.navdirection == "horizontal") {
              var n = Math.floor(
                ($nav.width() - 2 * m + instance.options.navspacing) /
                  (instance.options.navwidth + instance.options.navspacing)
              );
              m = Math.floor(
                ($nav.width() -
                  n * instance.options.navwidth -
                  (n - 1) * instance.options.navspacing) /
                  2
              );
            }
            if (instance.options.navdirection == "vertical")
              $navContainer.css({
                "margin-top": m + "px",
                "margin-bottom": m + "px",
                overflow: "hidden",
              });
            else
              $navContainer.css({
                "margin-left": m + "px",
                "margin-right": m + "px",
                overflow: "hidden",
              });
            var $carLeftArrow = $(
              "<div class='amazingslider-car-left-arrow-" +
                instance.id +
                "' style='display:none;'></div>"
            );
            var $carRightArrow = $(
              "<div class='amazingslider-car-right-arrow-" +
                instance.id +
                "' style='display:none;'></div>"
            );
            $nav.append($carLeftArrow);
            $nav.append($carRightArrow);
            $carLeftArrow.css({
              overflow: "hidden",
              position: "absolute",
              cursor: "pointer",
              width: instance.options.navthumbnavigationarrowimagewidth + "px",
              height:
                instance.options.navthumbnavigationarrowimageheight + "px",
              background:
                "url('" +
                instance.options.skinsfolder +
                instance.options.navthumbnavigationarrowimage +
                "') no-repeat left top",
            });
            $carRightArrow.css({
              overflow: "hidden",
              position: "absolute",
              cursor: "pointer",
              width: instance.options.navthumbnavigationarrowimagewidth + "px",
              height:
                instance.options.navthumbnavigationarrowimageheight + "px",
              background:
                "url('" +
                instance.options.skinsfolder +
                instance.options.navthumbnavigationarrowimage +
                "') no-repeat right top",
            });
            var p =
              instance.options.navdirection == "vertical"
                ? instance.options.navwidth / 2 -
                  instance.options.navthumbnavigationarrowimagewidth / 2
                : instance.options.navheight / 2 -
                  instance.options.navthumbnavigationarrowimageheight / 2;
            if (
              instance.options.navposition == "bottomleft" ||
              instance.options.navposition == "bottomright" ||
              instance.options.navposition == "bottom" ||
              instance.options.navposition == "right"
            )
              p += bulletPos;
            if (instance.options.navdirection == "vertical") {
              $carLeftArrow.css({
                top: "0px",
                left: "0px",
                "margin-left": p + "px",
              });
              $carRightArrow.css({
                bottom: "0px",
                left: "0px",
                "margin-left": p + "px",
              });
            } else {
              $carLeftArrow.css({
                left: "0px",
                top: "0px",
                "margin-top": p + "px",
              });
              $carRightArrow.css({
                right: "0px",
                top: "0px",
                "margin-top": p + "px",
              });
            }
            if (ASPlatforms.isIE678())
              $carLeftArrow.css({ opacity: "inherit", filter: "inherit" });
            $carLeftArrow.hover(
              function () {
                if (!$(this).data("disabled"))
                  $(this).css({ "background-position": "left center" });
              },
              function () {
                if (!$(this).data("disabled"))
                  $(this).css({ "background-position": "left top" });
              }
            );
            $carLeftArrow.click(function () {
              if (instance.options.navdirection == "vertical")
                instance.carMoveBottom();
              else instance.carMoveRight();
            });
            if (ASPlatforms.isIE678())
              $carRightArrow.css({ opacity: "inherit", filter: "inherit" });
            $carRightArrow.hover(
              function () {
                if (!$(this).data("disabled"))
                  $(this).css({ "background-position": "right center" });
              },
              function () {
                if (!$(this).data("disabled"))
                  $(this).css({ "background-position": "right top" });
              }
            );
            $carRightArrow.click(function () {
              if (instance.options.navdirection == "vertical")
                instance.carMoveTop();
              else instance.carMoveLeft();
            });
            $carLeftArrow.css({
              display: "block",
              "background-position": "left bottom",
              cursor: "",
            });
            $carLeftArrow.data("disabled", true);
            $carRightArrow.css({ display: "block" });
          }
          if (instance.options.navdirection == "vertical")
            $nav.touchSwipe({
              preventWebBrowser: true,
              swipeTop: function (data) {
                instance.carMoveTop();
              },
              swipeBottom: function () {
                instance.carMoveBottom();
              },
            });
          else
            $nav.touchSwipe({
              preventWebBrowser: false,
              swipeLeft: function (data) {
                instance.carMoveLeft();
              },
              swipeRight: function () {
                instance.carMoveRight();
              },
            });
          this.container.bind("amazingslider.switch", function (
            event,
            prev,
            cur
          ) {
            $(
              ".amazingslider-bullet-" + instance.id + "-" + prev,
              instance.container
            )["bulletNormal" + instance.id]();
            $(
              ".amazingslider-bullet-" + instance.id + "-" + cur,
              instance.container
            )["bulletSelected" + instance.id]();
          });
          if (this.options.navshowpreview) {
            var $preview = $(
              "<div class='amazingslider-nav-preview-" +
                this.id +
                "' style='display:none;position:absolute;width:" +
                this.options.navpreviewwidth +
                "px;height:" +
                this.options.navpreviewheight +
                "px;background-color:" +
                this.options.navpreviewbordercolor +
                ";padding:" +
                instance.options.navpreviewborder +
                "px;'></div>"
            );
            var $previewArrow = $(
              "<div class='amazingslider-nav-preview-arrow-" +
                this.id +
                "' style='display:block;position:absolute;width:" +
                this.options.navpreviewarrowwidth +
                "px;height:" +
                this.options.navpreviewarrowheight +
                "px;" +
                'background:url("' +
                this.options.skinsfolder +
                this.options.navpreviewarrowimage +
                "\") no-repeat center center;' ></div>"
            );
            switch (this.options.navpreviewposition) {
              case "bottom":
                $previewArrow.css({
                  left: "50%",
                  bottom: "100%",
                  "margin-left":
                    "-" +
                    Math.round(this.options.navpreviewarrowwidth / 2) +
                    "px",
                });
                break;
              case "top":
                $previewArrow.css({
                  left: "50%",
                  top: "100%",
                  "margin-left":
                    "-" +
                    Math.round(this.options.navpreviewarrowwidth / 2) +
                    "px",
                });
                break;
              case "left":
                $previewArrow.css({
                  top: "50%",
                  left: "100%",
                  "margin-top":
                    "-" +
                    Math.round(this.options.navpreviewarrowheight / 2) +
                    "px",
                });
                break;
              case "right":
                $previewArrow.css({
                  top: "50%",
                  right: "100%",
                  "margin-top":
                    "-" +
                    Math.round(this.options.navpreviewarrowheight / 2) +
                    "px",
                });
                break;
            }
            var $previewImages = $(
              "<div class='amazingslider-nav-preview-images-" +
                this.id +
                "' style='display:block;position:relative;width:100%;height:100%;overflow:hidden;' />"
            );
            $preview.append($previewArrow);
            $preview.append($previewImages);
            if (this.options.navshowplayvideo) {
              var $previewPlay = $(
                "<div class='amazingslider-nav-preview-play-" +
                  this.id +
                  "' style='display:none;position:absolute;left:0;top:0;width:100%;height:100%;" +
                  'background:url("' +
                  this.options.skinsfolder +
                  this.options.navplayvideoimage +
                  '") no-repeat center center;' +
                  "' ></div>"
              );
              $preview.append($previewPlay);
            }
            $(".amazingslider-wrapper-" + this.id, this.container).append(
              $preview
            );
          }
          if (this.options.navshowfeaturedarrow)
            $bulletWrapper.append(
              "<div class='amazingslider-nav-featuredarrow-" +
                this.id +
                "' style='display:none;position:absolute;width:" +
                this.options.navfeaturedarrowimagewidth +
                "px;" +
                "height:" +
                this.options.navfeaturedarrowimageheight +
                "px;" +
                'background:url("' +
                this.options.skinsfolder +
                this.options.navfeaturedarrowimage +
                "\") no-repeat center center;'></div>"
            );
        }
        if (this.options.navshowbuttons) {
          var floatDir =
            this.options.navdirection == "vertical" ? "top" : "left";
          var spacing =
            this.options.navstyle == "none" ? 0 : this.options.navspacing;
          if (this.options.navshowarrow) {
            var $navLeft = $(
              "<div class='amazingslider-nav-left-" +
                this.id +
                "' style='position:relative;float:" +
                floatDir +
                ";margin-" +
                floatDir +
                ":" +
                spacing +
                "px;width:" +
                this.options.navwidth +
                "px;height:" +
                this.options.navheight +
                "px;cursor:pointer;'></div>"
            );
            $bulletWrapper.append($navLeft);
            if (this.options.navbuttonradius)
              $navLeft.css(
                ASPlatforms.applyBrowserStyles({
                  "border-radius": this.options.navbuttonradius + "px",
                })
              );
            if (this.options.navbuttoncolor)
              $navLeft.css({ "background-color": this.options.navbuttoncolor });
            if (this.options.navarrowimage)
              $navLeft.css({
                "background-image":
                  "url('" +
                  this.options.skinsfolder +
                  this.options.navarrowimage +
                  "')",
                "background-repeat": "no-repeat",
                "background-position": "left top",
              });
            $navLeft.hover(
              function () {
                if (instance.options.navbuttonhighlightcolor)
                  $(this).css({
                    "background-color":
                      instance.options.navbuttonhighlightcolor,
                  });
                if (instance.options.navarrowimage)
                  $(this).css({ "background-position": "left bottom" });
              },
              function () {
                if (instance.options.navbuttoncolor)
                  $(this).css({
                    "background-color": instance.options.navbuttoncolor,
                  });
                if (instance.options.navarrowimage)
                  $(this).css({ "background-position": "left top" });
              }
            );
            $navLeft.click(function () {
              instance.slideRun(-2);
            });
            spacing = this.options.navspacing;
          }
          if (this.options.navshowplaypause) {
            var $navPlay, $navPause;
            if (this.options.navshowplaypausestandalone) {
              $navPlay = $(
                "<div class='amazingslider-nav-play-" +
                  this.id +
                  "' style='position:absolute;width:" +
                  this.options.navshowplaypausestandalonewidth +
                  "px;height:" +
                  this.options.navshowplaypausestandaloneheight +
                  "px;'></div>"
              );
              this.$wrapper.append($navPlay);
              $navPause = $(
                "<div class='amazingslider-nav-pause-" +
                  this.id +
                  "' style='position:absolute;width:" +
                  this.options.navshowplaypausestandalonewidth +
                  "px;height:" +
                  this.options.navshowplaypausestandaloneheight +
                  "px;'></div>"
              );
              this.$wrapper.append($navPause);
              switch (this.options.navshowplaypausestandaloneposition) {
                case "topleft":
                  $navPlay.css({
                    top: 0,
                    left: 0,
                    "margin-left":
                      this.options.navshowplaypausestandalonemarginx + "px",
                    "margin-top":
                      this.options.navshowplaypausestandalonemarginy + "px",
                  });
                  $navPause.css({
                    top: 0,
                    left: 0,
                    "margin-left":
                      this.options.navshowplaypausestandalonemarginx + "px",
                    "margin-top":
                      this.options.navshowplaypausestandalonemarginy + "px",
                  });
                  break;
                case "topright":
                  $navPlay.css({
                    top: 0,
                    right: 0,
                    "margin-right":
                      this.options.navshowplaypausestandalonemarginx + "px",
                    "margin-top":
                      this.options.navshowplaypausestandalonemarginy + "px",
                  });
                  $navPause.css({
                    top: 0,
                    right: 0,
                    "margin-right":
                      this.options.navshowplaypausestandalonemarginx + "px",
                    "margin-top":
                      this.options.navshowplaypausestandalonemarginy + "px",
                  });
                  break;
                case "bottomleft":
                  $navPlay.css({
                    bottom: 0,
                    left: 0,
                    "margin-left":
                      this.options.navshowplaypausestandalonemarginx + "px",
                    "margin-bottom":
                      this.options.navshowplaypausestandalonemarginy + "px",
                  });
                  $navPause.css({
                    bottom: 0,
                    left: 0,
                    "margin-left":
                      this.options.navshowplaypausestandalonemarginx + "px",
                    "margin-bottom":
                      this.options.navshowplaypausestandalonemarginy + "px",
                  });
                  break;
                case "bottomright":
                  $navPlay.css({
                    bottom: 0,
                    right: 0,
                    "margin-right":
                      this.options.navshowplaypausestandalonemarginx + "px",
                    "margin-bottom":
                      this.options.navshowplaypausestandalonemarginy + "px",
                  });
                  $navPause.css({
                    bottom: 0,
                    right: 0,
                    "margin-right":
                      this.options.navshowplaypausestandalonemarginx + "px",
                    "margin-bottom":
                      this.options.navshowplaypausestandalonemarginy + "px",
                  });
                  break;
                case "center":
                  $navPlay.css({
                    top: "50%",
                    left: "50%",
                    "margin-left":
                      "-" +
                      Math.round(
                        this.options.navshowplaypausestandalonewidth / 2
                      ) +
                      "px",
                    "margin-top":
                      "-" +
                      Math.round(
                        this.options.navshowplaypausestandaloneheight / 2
                      ) +
                      "px",
                  });
                  $navPause.css({
                    top: "50%",
                    left: "50%",
                    "margin-left":
                      "-" +
                      Math.round(
                        this.options.navshowplaypausestandalonewidth / 2
                      ) +
                      "px",
                    "margin-top":
                      "-" +
                      Math.round(
                        this.options.navshowplaypausestandaloneheight / 2
                      ) +
                      "px",
                  });
                  break;
              }
            } else {
              $navPlay = $(
                "<div class='amazingslider-nav-play-" +
                  this.id +
                  "' style='position:relative;float:" +
                  floatDir +
                  ";margin-" +
                  floatDir +
                  ":" +
                  spacing +
                  "px;width:" +
                  this.options.navwidth +
                  "px;height:" +
                  this.options.navheight +
                  "px;cursor:pointer;'></div>"
              );
              $bulletWrapper.append($navPlay);
              $navPause = $(
                "<div class='amazingslider-nav-pause-" +
                  this.id +
                  "' style='position:relative;float:" +
                  floatDir +
                  ";margin-" +
                  floatDir +
                  ":" +
                  spacing +
                  "px;width:" +
                  this.options.navwidth +
                  "px;height:" +
                  this.options.navheight +
                  "px;cursor:pointer;'></div>"
              );
              $bulletWrapper.append($navPause);
            }
            if (this.options.navbuttonradius)
              $navPlay.css(
                ASPlatforms.applyBrowserStyles({
                  "border-radius": this.options.navbuttonradius + "px",
                })
              );
            if (this.options.navbuttoncolor)
              $navPlay.css({ "background-color": this.options.navbuttoncolor });
            if (this.options.navarrowimage)
              $navPlay.css({
                "background-image":
                  "url('" +
                  this.options.skinsfolder +
                  this.options.navplaypauseimage +
                  "')",
                "background-repeat": "no-repeat",
                "background-position": "left top",
              });
            $navPlay.hover(
              function () {
                if (instance.options.navbuttonhighlightcolor)
                  $(this).css({
                    "background-color":
                      instance.options.navbuttonhighlightcolor,
                  });
                if (instance.options.navarrowimage)
                  $(this).css({ "background-position": "left bottom" });
              },
              function () {
                if (instance.options.navbuttoncolor)
                  $(this).css({
                    "background-color": instance.options.navbuttoncolor,
                  });
                if (instance.options.navarrowimage)
                  $(this).css({ "background-position": "left top" });
              }
            );
            $navPlay.click(function () {
              instance.isPaused = false;
              instance.loopCount = 0;
              if (!instance.videoPaused) instance.sliderTimeout.start();
              $(this).css({ display: "none" });
              $(
                ".amazingslider-nav-pause-" + instance.id,
                instance.container
              ).css({ display: "block" });
            });
            if (this.options.navbuttonradius)
              $navPause.css(
                ASPlatforms.applyBrowserStyles({
                  "border-radius": this.options.navbuttonradius + "px",
                })
              );
            if (this.options.navbuttoncolor)
              $navPause.css({
                "background-color": this.options.navbuttoncolor,
              });
            if (this.options.navarrowimage)
              $navPause.css({
                "background-image":
                  "url('" +
                  this.options.skinsfolder +
                  this.options.navplaypauseimage +
                  "')",
                "background-repeat": "no-repeat",
                "background-position": "right top",
              });
            $navPause.hover(
              function () {
                if (instance.options.navbuttonhighlightcolor)
                  $(this).css({
                    "background-color":
                      instance.options.navbuttonhighlightcolor,
                  });
                if (instance.options.navarrowimage)
                  $(this).css({ "background-position": "right bottom" });
              },
              function () {
                if (instance.options.navbuttoncolor)
                  $(this).css({
                    "background-color": instance.options.navbuttoncolor,
                  });
                if (instance.options.navarrowimage)
                  $(this).css({ "background-position": "right top" });
              }
            );
            $navPause.click(function () {
              instance.isPaused = true;
              instance.sliderTimeout.stop();
              $(this).css({ display: "none" });
              $(
                ".amazingslider-nav-play-" + instance.id,
                instance.container
              ).css({ display: "block" });
            });
            if (
              this.options.navshowplaypausestandalone &&
              this.options.navshowplaypausestandaloneautohide
            ) {
              $navPlay.css({ display: "none" });
              $navPause.css({ display: "none" });
              this.$wrapper.hover(
                function () {
                  if (instance.isPaused) {
                    $navPlay.fadeIn();
                    $navPause.css({ display: "none" });
                  } else {
                    $navPlay.css({ display: "none" });
                    $navPause.fadeIn();
                  }
                },
                function () {
                  $navPlay.fadeOut();
                  $navPause.fadeOut();
                }
              );
            } else {
              $navPlay.css({ display: instance.isPaused ? "block" : "none" });
              $navPause.css({ display: instance.isPaused ? "none" : "block" });
            }
          }
          if (this.options.navshowarrow) {
            var $navRight = $(
              "<div class='amazingslider-nav-right-" +
                this.id +
                "' style='position:relative;float:" +
                floatDir +
                ";margin-" +
                floatDir +
                ":" +
                spacing +
                "px;width:" +
                this.options.navwidth +
                "px;height:" +
                this.options.navheight +
                "px;cursor:pointer;'></div>"
            );
            $bulletWrapper.append($navRight);
            if (this.options.navbuttonradius)
              $navRight.css(
                ASPlatforms.applyBrowserStyles({
                  "border-radius": this.options.navbuttonradius + "px",
                })
              );
            if (this.options.navbuttoncolor)
              $navRight.css({
                "background-color": this.options.navbuttoncolor,
              });
            if (this.options.navarrowimage)
              $navRight.css({
                "background-image":
                  "url('" +
                  this.options.skinsfolder +
                  this.options.navarrowimage +
                  "')",
                "background-repeat": "no-repeat",
                "background-position": "right top",
              });
            $navRight.hover(
              function () {
                if (instance.options.navbuttonhighlightcolor)
                  $(this).css({
                    "background-color":
                      instance.options.navbuttonhighlightcolor,
                  });
                if (instance.options.navarrowimage)
                  $(this).css({ "background-position": "right bottom" });
              },
              function () {
                if (instance.options.navbuttoncolor)
                  $(this).css({
                    "background-color": instance.options.navbuttoncolor,
                  });
                if (instance.options.navarrowimage)
                  $(this).css({ "background-position": "right top" });
              }
            );
            $navRight.click(function () {
              instance.slideRun(-1);
            });
          }
        }
      },
      createNavBullet: function (index) {
        var instance = this;
        var f = this.options.navdirection == "vertical" ? "top" : "left";
        var marginF =
          this.options.navdirection == "vertical" ? "bottom" : "right";
        var spacing =
          index == this.elemArray.length - 1 ? 0 : this.options.navspacing;
        var w =
          this.options.navstyle == "thumbnails"
            ? this.options.navwidth - this.options.navborder * 2
            : this.options.navwidth;
        var h =
          this.options.navstyle == "thumbnails"
            ? this.options.navheight - this.options.navborder * 2
            : this.options.navheight;
        var $bullet = $(
          "<div class='amazingslider-bullet-" +
            this.id +
            "-" +
            index +
            "' style='position:relative;float:" +
            f +
            ";margin-" +
            marginF +
            ":" +
            spacing +
            "px;width:" +
            w +
            "px;height:" +
            h +
            "px;cursor:pointer;'></div>"
        );
        $bullet.data("index", index);
        $bullet.hover(
          function () {
            if ($(this).data("index") != instance.curElem)
              $(this)["bulletHighlight" + instance.id]();
            var bulletIndex = $(this).data("index");
            if (instance.options.navswitchonmouseover)
              if (bulletIndex != instance.curElem)
                instance.slideRun(bulletIndex);
            if (instance.options.navshowpreview) {
              var $preview = $(
                ".amazingslider-nav-preview-" + instance.id,
                instance.container
              );
              var $previewImages = $(
                ".amazingslider-nav-preview-images-" + instance.id,
                $preview
              );
              if (instance.options.navshowplayvideo) {
                var $previewPlay = $(
                  ".amazingslider-nav-preview-play-" + instance.id,
                  $preview
                );
                if (
                  instance.elemArray[bulletIndex][ELEM_VIDEO].length > 0 ||
                  (instance.elemArray[bulletIndex][ELEM_LINK] &&
                    instance.elemArray[bulletIndex][ELEM_LIGHTBOX] &&
                    instance.checkVideoType(
                      instance.elemArray[bulletIndex][ELEM_LINK]
                    ) > 0)
                )
                  $previewPlay.show();
                else $previewPlay.hide();
              }
              var $nav = $(
                ".amazingslider-nav-" + instance.id,
                instance.container
              );
              var $bulletWrapper = $(
                ".amazingslider-bullet-wrapper-" + instance.id,
                instance.container
              );
              var pos = $(this).position();
              var navPos = $nav.position();
              var bulletWrapperPos = $bulletWrapper.position();
              pos.left += navPos.left + bulletWrapperPos.left;
              pos.left += isNaN(parseInt($bulletWrapper.css("margin-left")))
                ? 0
                : parseInt($bulletWrapper.css("margin-left"));
              pos.left += isNaN(parseInt($nav.css("margin-left")))
                ? 0
                : parseInt($nav.css("margin-left"));
              pos.top += navPos.top + bulletWrapperPos.top;
              pos.top += isNaN(parseInt($bulletWrapper.css("margin-top")))
                ? 0
                : parseInt($bulletWrapper.css("margin-top"));
              pos.top += isNaN(parseInt($nav.css("margin-top")))
                ? 0
                : parseInt($nav.css("margin-top"));
              if (instance.options.navdirection == "vertical") {
                var $navContainer = $(
                  ".amazingslider-nav-container-" + instance.id,
                  instance.container
                );
                pos.top += isNaN(parseInt($navContainer.css("margin-top")))
                  ? 0
                  : parseInt($navContainer.css("margin-top"));
              }
              var t,
                l =
                  pos.left +
                  instance.options.navwidth / 2 -
                  instance.options.navpreviewwidth / 2 -
                  instance.options.navpreviewborder;
              var lv,
                tv =
                  pos.top +
                  instance.options.navheight / 2 -
                  instance.options.navpreviewheight / 2 -
                  instance.options.navpreviewborder;
              var p = {};
              switch (instance.options.navpreviewposition) {
                case "bottom":
                  t =
                    pos.top +
                    instance.options.navheight +
                    instance.options.navpreviewarrowheight;
                  p = { left: l + "px", top: t + "px" };
                  break;
                case "top":
                  t =
                    pos.top -
                    instance.options.navpreviewheight -
                    2 * instance.options.navpreviewborder -
                    instance.options.navpreviewarrowheight;
                  p = { left: l + "px", top: t + "px" };
                  break;
                case "left":
                  lv =
                    pos.left -
                    instance.options.navpreviewwidth -
                    2 * instance.options.navpreviewborder -
                    instance.options.navpreviewarrowwidth;
                  p = { left: lv + "px", top: tv + "px" };
                  break;
                case "right":
                  lv =
                    pos.left +
                    instance.options.navwidth +
                    instance.options.navpreviewarrowwidth;
                  p = { left: lv + "px", top: tv + "px" };
                  break;
              }
              var imgLoader = new Image();
              $(imgLoader).load(function () {
                var style;
                if (
                  this.width / this.height <=
                  instance.options.navpreviewwidth /
                    instance.options.navpreviewheight
                )
                  style =
                    "width:" +
                    instance.options.navpreviewwidth +
                    "px;max-width:" +
                    instance.options.navpreviewwidth +
                    "px;height:auto;margin-top:-" +
                    Math.floor(
                      ((this.height / this.width) *
                        instance.options.navpreviewwidth) /
                        2 -
                        instance.options.navpreviewheight / 2
                    ) +
                    "px;";
                else
                  style =
                    "width:auto;max-width:none;height:" +
                    instance.options.navpreviewheight +
                    "px;margin-left:-" +
                    Math.floor(
                      ((this.width / this.height) *
                        instance.options.navpreviewheight) /
                        2 -
                        instance.options.navpreviewwidth / 2
                    ) +
                    "px;";
                var $prevImg = $(
                  ".amazingslider-nav-preview-img-" + instance.id,
                  $previewImages
                );
                if (instance.options.navdirection == "vertical") {
                  var $curImg = $(
                    "<div class='amazingslider-nav-preview-img-" +
                      instance.id +
                      "' style='display:block;position:absolute;overflow:hidden;width:" +
                      instance.options.navpreviewwidth +
                      "px;height:" +
                      instance.options.navpreviewheight +
                      "px;left:0px;top:" +
                      instance.options.navpreviewheight +
                      "px;'><img src='" +
                      instance.elemArray[bulletIndex][ELEM_THUMBNAIL] +
                      "' style='display:block;position:absolute;left:0px;top:0px;" +
                      style +
                      "' /></div>"
                  );
                  $previewImages.append($curImg);
                  if ($prevImg.length > 0)
                    $prevImg.animate(
                      { top: "-" + instance.options.navpreviewheight + "px" },
                      function () {
                        $prevImg.remove();
                      }
                    );
                  if ($preview.is(":visible")) {
                    $curImg.animate({ top: "0px" });
                    $preview.stop(true, true).animate(p);
                  } else {
                    $curImg.css({ top: "0px" });
                    $preview.stop(true, true).css(p).fadeIn();
                  }
                } else {
                  var $curImg = $(
                    "<div class='amazingslider-nav-preview-img-" +
                      instance.id +
                      "' style='display:block;position:absolute;overflow:hidden;width:" +
                      instance.options.navpreviewwidth +
                      "px;height:" +
                      instance.options.navpreviewheight +
                      "px;left:" +
                      instance.options.navpreviewheight +
                      "px;top:0px;'><img src='" +
                      instance.elemArray[bulletIndex][ELEM_THUMBNAIL] +
                      "' style='display:block;position:absolute;left:0px;top:0px;" +
                      style +
                      "' /></div>"
                  );
                  $previewImages.append($curImg);
                  if ($prevImg.length > 0)
                    $prevImg.animate(
                      { left: "-" + instance.options.navpreviewwidth + "px" },
                      function () {
                        $prevImg.remove();
                      }
                    );
                  if ($preview.is(":visible")) {
                    $curImg.animate({ left: "0px" });
                    $preview.stop(true, true).animate(p);
                  } else {
                    $curImg.css({ left: "0px" });
                    $preview.stop(true, true).css(p).fadeIn();
                  }
                }
              });
              imgLoader.src = instance.elemArray[bulletIndex][ELEM_THUMBNAIL];
            }
          },
          function () {
            if ($(this).data("index") != instance.curElem)
              $(this)["bulletNormal" + instance.id]();
            if (instance.options.navshowpreview) {
              var $preview = $(
                ".amazingslider-nav-preview-" + instance.id,
                instance.container
              );
              $preview.delay(500).fadeOut();
            }
          }
        );
        $bullet.click(function () {
          instance.slideRun(
            $(this).data("index"),
            instance.options.playvideoonclickthumb
          );
        });
        if (this.options.navstyle == "bullets") {
          $bullet.css({
            background:
              "url('" + this.options.navimage + "') no-repeat left top",
          });
          $.fn["bulletNormal" + this.id] = function () {
            $(this).css({ "background-position": "left top" });
          };
          $.fn["bulletHighlight" + this.id] = $.fn[
            "bulletSelected" + this.id
          ] = function () {
            $(this).css({ "background-position": "left bottom" });
          };
        } else if (this.options.navstyle == "numbering") {
          $bullet.text(index + 1);
          $bullet.css({
            "background-color": this.options.navcolor,
            color: this.options.navfontcolor,
            "font-size": this.options.navfontsize,
            "font-family": this.options.navfont,
            "text-align": "center",
            "line-height": this.options.navheight + "px",
          });
          $bullet.css(
            ASPlatforms.applyBrowserStyles({
              "border-radius": this.options.navradius + "px",
            })
          );
          if (
            this.options.navbuttonshowbgimage &&
            this.options.navbuttonbgimage
          )
            $bullet.css({
              background:
                "url('" +
                this.options.skinsfolder +
                this.options.navbuttonbgimage +
                "') no-repeat center top",
            });
          $.fn["bulletNormal" + this.id] = function () {
            $(this).css({
              "background-color": instance.options.navcolor,
              color: instance.options.navfontcolor,
            });
            if (
              instance.options.navbuttonshowbgimage &&
              instance.options.navbuttonbgimage
            )
              $(this).css({ "background-position": "center top" });
          };
          $.fn["bulletHighlight" + this.id] = $.fn[
            "bulletSelected" + this.id
          ] = function () {
            $(this).css({
              "background-color": instance.options.navhighlightcolor,
              color: instance.options.navfonthighlightcolor,
            });
            if (
              instance.options.navbuttonshowbgimage &&
              instance.options.navbuttonbgimage
            )
              $(this).css({ "background-position": "center bottom" });
          };
        } else if (this.options.navstyle == "thumbnails") {
          $bullet.css({
            padding: this.options.navborder + "px",
            "background-color": this.options.navbordercolor,
          });
          $bullet.css({
            opacity: this.options.navopacity,
            filter:
              "alpha(opacity=" +
              Math.round(100 * this.options.navopacity) +
              ")",
          });
          var imgLoader = new Image();
          var instance = this;
          $(imgLoader).load(function () {
            if (instance.options.navthumbstyle != "textonly") {
              var style;
              if (
                this.width / this.height <=
                instance.options.navimagewidth / instance.options.navimageheight
              )
                style =
                  "max-width:none !important;width:100%;height:auto;margin-top:-" +
                  Math.floor(
                    ((this.height / this.width) *
                      instance.options.navimagewidth) /
                      2 -
                      instance.options.navimageheight / 2
                  ) +
                  "px";
              else
                style =
                  "max-width:none !important;width:auto;height:100%;margin-left:-" +
                  Math.floor(
                    ((this.width / this.height) *
                      instance.options.navimageheight) /
                      2 -
                      instance.options.navimagewidth / 2
                  ) +
                  "px";
              $bullet.append(
                "<div class='amazingslider-bullet-image-" +
                  instance.id +
                  "' style='display:block;position:absolute;width:" +
                  instance.options.navimagewidth +
                  "px;height:" +
                  instance.options.navimageheight +
                  "px;overflow:hidden;'><img src='" +
                  instance.elemArray[index][ELEM_THUMBNAIL] +
                  "' style='" +
                  style +
                  "' /></div>"
              );
              if (
                instance.options.navshowplayvideo &&
                (instance.elemArray[index][ELEM_VIDEO].length > 0 ||
                  (instance.elemArray[index][ELEM_LINK] &&
                    instance.elemArray[index][ELEM_LIGHTBOX] &&
                    instance.checkVideoType(
                      instance.elemArray[index][ELEM_LINK]
                    ) > 0))
              )
                $bullet.append(
                  "<div style='display:block;position:absolute;margin-left:0;margin-top:0;width:" +
                    instance.options.navimagewidth +
                    "px;height:" +
                    instance.options.navimageheight +
                    "px;" +
                    'background:url("' +
                    instance.options.skinsfolder +
                    instance.options.navplayvideoimage +
                    '") no-repeat center center;' +
                    "' ></div>"
                );
            }
            if (instance.options.navthumbstyle != "imageonly") {
              var thumbtitle =
                "<div class='amazingslider-bullet-text-" +
                instance.id +
                "' style='display:block;position:absolute;overflow:hidden;";
              if (instance.options.navthumbstyle == "imageandtitle")
                thumbtitle +=
                  "margin-left:0px;margin-top:" +
                  instance.options.navimageheight +
                  "px;width:" +
                  instance.options.navimagewidth +
                  "px;height:" +
                  instance.options.navthumbtitleheight +
                  "px;";
              else if (
                instance.options.navthumbstyle == "imageandtitledescription"
              )
                thumbtitle +=
                  "margin-left:" +
                  instance.options.navimagewidth +
                  "px;margin-top:0px;width:" +
                  instance.options.navthumbtitlewidth +
                  "px;height:" +
                  instance.options.navimageheight +
                  "px;";
              else if (instance.options.navthumbstyle == "textonly")
                thumbtitle +=
                  "margin-left:0px;margin-top:0px;width:" +
                  String(
                    instance.options.navthumbtitlewidth +
                      instance.options.navimagewidth
                  ) +
                  "px;height:" +
                  instance.options.navimageheight +
                  "px;";
              thumbtitle +=
                "'><div class='amazingslider-nav-thumbnail-tite-" +
                instance.id +
                "'>" +
                instance.elemArray[index][ELEM_TITLE] +
                "</div>";
              if (
                instance.options.navthumbstyle == "imageandtitledescription" ||
                instance.options.navthumbstyle == "textonly"
              )
                thumbtitle +=
                  "<div class='amazingslider-nav-thumbnail-description-" +
                  instance.id +
                  "'>" +
                  instance.elemArray[index][ELEM_DESCRIPTION] +
                  "</div>";
              thumbtitle += "</div>";
              $bullet.append(thumbtitle);
            }
          });
          imgLoader.src = this.elemArray[index][ELEM_THUMBNAIL];
          $.fn["bulletNormal" + this.id] = function () {
            $(this).css({
              opacity: instance.options.navopacity,
              filter:
                "alpha(opacity=" +
                Math.round(100 * instance.options.navopacity) +
                ")",
            });
          };
          $.fn["bulletHighlight" + this.id] = function () {
            $(this).css({ opacity: 1, filter: "alpha(opacity=100)" });
          };
          $.fn["bulletSelected" + this.id] = function () {
            $(this).css({ opacity: 1, filter: "alpha(opacity=100)" });
            if (instance.options.navshowfeaturedarrow) {
              var $featuredarrow = $(
                ".amazingslider-nav-featuredarrow-" + instance.id,
                instance.container
              );
              var pos = $(this).position();
              var $navContainer = $(
                ".amazingslider-nav-container-" + instance.id,
                instance.container
              );
              var $bulletWrapper = $(
                ".amazingslider-bullet-wrapper-" + instance.id,
                instance.container
              );
              if (instance.options.navdirection == "horizontal") {
                var t,
                  l =
                    pos.left +
                    instance.options.navwidth / 2 -
                    instance.options.navfeaturedarrowimagewidth / 2;
                if (
                  instance.options.navposition == "top" ||
                  instance.options.navposition == "topleft" ||
                  instance.options.navposition == "topright"
                )
                  t = pos.top + instance.options.navheight;
                else t = pos.top - instance.options.navfeaturedarrowimageheight;
                $featuredarrow.css({ top: t + "px" });
                if ($featuredarrow.is(":visible"))
                  $featuredarrow.stop(true, true).animate({ left: l + "px" });
                else $featuredarrow.css({ display: "block", left: l + "px" });
                if (
                  $navContainer.width() < $bulletWrapper.width() &&
                  !instance.pauseCarousel
                ) {
                  var m = Math.abs(
                    isNaN(parseInt($bulletWrapper.css("margin-left")))
                      ? 0
                      : parseInt($bulletWrapper.css("margin-left"))
                  );
                  if (
                    pos.left < m ||
                    pos.left + instance.options.navwidth >
                      m + $navContainer.width()
                  ) {
                    var pl = -pos.left;
                    if (pl <= $navContainer.width() - $bulletWrapper.width())
                      pl = $navContainer.width() - $bulletWrapper.width();
                    if (pl >= 0) pl = 0;
                    $bulletWrapper.animate(
                      { "margin-left": pl + "px" },
                      { queue: false, duration: 500, easing: "easeOutCirc" }
                    );
                    instance.updateCarouselLeftRightArrow(pl);
                  }
                }
              } else {
                var l,
                  t =
                    pos.top +
                    instance.options.navheight / 2 -
                    instance.options.navfeaturedarrowimageheight / 2;
                if (instance.options.navposition == "left")
                  l = pos.left + instance.options.navwidth;
                else l = pos.left - instance.options.navfeaturedarrowimagewidth;
                $featuredarrow.css({ left: l + "px" });
                if ($featuredarrow.is(":visible"))
                  $featuredarrow.stop(true, true).animate({ top: t + "px" });
                else $featuredarrow.css({ display: "block", top: t + "px" });
                if (
                  $navContainer.height() < $bulletWrapper.height() &&
                  !instance.pauseCarousel
                ) {
                  var m = Math.abs(
                    isNaN(parseInt($bulletWrapper.css("margin-top")))
                      ? 0
                      : parseInt($bulletWrapper.css("margin-top"))
                  );
                  if (
                    pos.top < m ||
                    pos.top + instance.options.navheight >
                      m + $navContainer.height()
                  ) {
                    var pl = -pos.top;
                    if (pl <= $navContainer.height() - $bulletWrapper.height())
                      pl = $navContainer.height() - $bulletWrapper.height();
                    if (pl >= 0) pl = 0;
                    $bulletWrapper.animate(
                      { "margin-top": pl + "px" },
                      { queue: false, duration: 500, easing: "easeOutCirc" }
                    );
                    instance.updateCarouselLeftRightArrow(pl);
                  }
                }
              }
            }
          };
        }
        return $bullet;
      },
      slideRun: function (index, playVideo) {
        savedCur = this.curElem;
        this.calcIndex(index);
        if (savedCur == this.curElem) return;
        if (this.isAnimating) {
          if (this.transitionTimeout) clearTimeout(this.transitionTimeout);
          $(".amazingslider-img-box-" + this.id, this.container).unbind(
            "transitionFinished"
          );
          var imageCodes =
            "<div class='amazingslider-img-" +
            this.id +
            " ' style='display:block;position:absolute;left:0px;top:0px;width:100%;height:100%;overflow:hidden;'>";
          imageCodes += "<img style='position:absolute;";
          if (Math.abs(this.curImageMarginLeft) > 0)
            imageCodes +=
              "max-width:" +
              this.curImageMaxWidth +
              "%;width:" +
              this.curImageMaxWidth +
              "%;height:100%;left:0%;top:0%;margin-left:" +
              this.curImageMarginLeft +
              "%";
          else
            imageCodes +=
              "max-width:" +
              this.curImageMaxWidth +
              "%;width:" +
              this.curImageMaxWidth +
              "%;height:auto;left:0%;top:0%;margin-top:" +
              this.curImageMarginTop +
              "%;";
          imageCodes +=
            "' src='" + this.elemArray[savedCur][ELEM_SRC] + "' /></div>";
          $(".amazingslider-img-box-" + this.id, this.container).html(
            imageCodes
          );
          this.isAnimating = false;
        }
        if (
          this.elemArray[this.curElem][ELEM_TEXTEFFECT] &&
          this.elemArray[this.curElem][ELEM_TEXTEFFECT].length > 0 &&
          "textformat" in this.options &&
          this.elemArray[this.curElem][ELEM_TEXTEFFECT] in
            this.options["textformat"]
        )
          this.textoptions = $.ASUpdateObject(
            this.textoptions,
            this.options["textformat"][
              this.elemArray[this.curElem][ELEM_TEXTEFFECT]
            ]
          );
        else
          this.textoptions = $.ASUpdateObject(this.textoptions, this.options);
        this.sliderTimeout.stop();
        this.sliderTimeout.timeout =
          this.elemArray[this.curElem][ELEM_DURATION] > 0
            ? this.elemArray[this.curElem][ELEM_DURATION]
            : this.options.slideinterval;
        this.videoPaused = false;
        this.container.trigger("amazingslider.switch", [
          savedCur,
          this.curElem,
        ]);
        $(".amazingslider-video-wrapper-" + this.id, this.container)
          .find("iframe")
          .each(function () {
            $(this).attr("src", "");
          });
        if (
          (playVideo || this.options.autoplayvideo) &&
          this.elemArray[this.curElem][ELEM_VIDEO].length > 0
        )
          this.playVideo(true);
        else {
          $(".amazingslider-video-wrapper-" + this.id, this.container)
            .css({ display: "none" })
            .empty();
          this.container.trigger("amazingslider.switchtext", [
            savedCur,
            this.curElem,
          ]);
          var slideDirection = true;
          if (index == -2) slideDirection = false;
          else if (index == -1) slideDirection = true;
          else if (index >= 0)
            slideDirection = this.curElem > savedCur ? true : false;
          this.showImage(slideDirection);
        }
        new Image().src = this.elemArray[this.prevElem][ELEM_SRC];
        new Image().src = this.elemArray[this.nextElem][ELEM_SRC];
        if (this.options.loop > 0)
          if (this.curElem == this.elemArray.length - 1) {
            this.loopCount++;
            if (this.options.loop <= this.loopCount) this.isPaused = true;
          }
      },
      showImage: function (slideDirection) {
        var instance = this;
        var imgLoader = new Image();
        $(imgLoader).load(function () {
          var $box = $(
            ".amazingslider-img-box-" + instance.id,
            instance.container
          );
          var $imgPrev = $(
            ".amazingslider-img-" + instance.id,
            instance.container
          );
          var imgCurCodes =
            "<div class='amazingslider-img-" +
            instance.id +
            " ' style='display:block;position:absolute;left:0px;top:0px;width:100%;height:100%;overflow:hidden;'>";
          imgCurCodes +=
            "<img style='position:absolute;" +
            (ASPlatforms.isIE678() ? "opacity:inherit;filter:inherit;" : "");
          var sliderRatio = instance.options.height / instance.options.width;
          var imgRatio = this.height / this.width;
          instance.curImageMarginTop = 0;
          instance.curImageMarginLeft = 0;
          instance.curImageMaxWidth = 100;
          if (sliderRatio < imgRatio)
            if (instance.options.scalemode == "fit") {
              instance.curImageMaxWidth = (sliderRatio / imgRatio) * 100;
              instance.curImageMarginLeft = 50 - instance.curImageMaxWidth / 2;
            } else
              instance.curImageMarginTop = -1 * (imgRatio - sliderRatio) * 50;
          else if (instance.options.scalemode == "fit")
            instance.curImageMarginTop = (sliderRatio - imgRatio) * 50;
          else {
            instance.curImageMarginLeft =
              -1 * (1 / imgRatio - 1 / sliderRatio) * 50;
            instance.curImageMaxWidth = 100 - 2 * instance.curImageMarginLeft;
          }
          if (Math.abs(instance.curImageMarginLeft) > 0)
            imgCurCodes +=
              "max-width:" +
              instance.curImageMaxWidth +
              "%;width:" +
              instance.curImageMaxWidth +
              "%;height:100%;left:0%;top:0%;margin-left:" +
              instance.curImageMarginLeft +
              "%";
          else
            imgCurCodes +=
              "max-width:" +
              instance.curImageMaxWidth +
              "%;width:" +
              instance.curImageMaxWidth +
              "%;height:auto;left:0%;top:0%;margin-top:" +
              instance.curImageMarginTop +
              "%;";
          imgCurCodes +=
            "' src='" + instance.elemArray[instance.curElem][ELEM_SRC] + "' />";
          imgCurCodes += "</div>";
          var $imgCur = $(imgCurCodes);
          if ($imgPrev.length > 0) $imgPrev.before($imgCur);
          else $box.append($imgCur);
          var transitioneffect =
            instance.firstslide && !instance.options.transitiononfirstslide
              ? ""
              : instance.options.transition;
          instance.firstslide = false;
          instance.isAnimating = true;
          $box.amazingsliderTransition(
            instance.id,
            $imgPrev,
            $imgCur,
            {
              effect: transitioneffect,
              direction: slideDirection,
              duration: instance.options.transitionduration,
              easing: instance.options.transitioneasing,
              imgmarginleft: instance.curImageMarginLeft,
              imgmargintop: instance.curImageMarginTop,
              imgmaxwidth: instance.curImageMaxWidth,
              crossfade: instance.options.crossfade,
              fade: instance.options.fade,
              slide: instance.options.slide,
              slice: instance.options.slice,
              blinds: instance.options.blinds,
              threed: instance.options.threed,
              threedhorizontal: instance.options.threedhorizontal,
              blocks: instance.options.blocks,
              shuffle: instance.options.shuffle,
            },
            function () {
              instance.isAnimating = false;
              instance.sliderTimeout.resume(true);
            },
            function (timeoutid) {
              instance.transitionTimeout = timeoutid;
              if (
                !instance.isPaused &&
                !instance.videoPaused &&
                instance.elemArray.length > 1
              )
                instance.sliderTimeout.startandpause();
            }
          );
          var $swipeBox = $(
            ".amazingslider-swipe-box-" + instance.id,
            instance.container
          );
          if (instance.elemArray[instance.curElem][ELEM_LINK]) {
            $swipeBox.css({ cursor: "pointer" });
            $swipeBox.unbind("click").bind("click", function () {
              if (instance.elemArray[instance.curElem][ELEM_LIGHTBOX]) {
                if (!instance.isPaused) {
                  instance.lightboxPaused = true;
                  instance.isPaused = true;
                  instance.sliderTimeout.pause();
                }
                instance.html5Lightbox.showItem(
                  instance.elemArray[instance.curElem][ELEM_LINK]
                );
              } else {
                var target = instance.elemArray[instance.curElem][ELEM_TARGET]
                  ? instance.elemArray[instance.curElem][ELEM_TARGET]
                  : "_self";
                window.open(
                  instance.elemArray[instance.curElem][ELEM_LINK],
                  target
                );
              }
            });
          } else {
            $swipeBox.css({ cursor: "" });
            $swipeBox.unbind("click");
          }
          var videoLightbox =
            instance.elemArray[instance.curElem][ELEM_LINK] &&
            instance.elemArray[instance.curElem][ELEM_LIGHTBOX] &&
            instance.checkVideoType(
              instance.elemArray[instance.curElem][ELEM_LINK]
            ) > 0;
          $(
            ".amazingslider-lightbox-play-" + instance.id,
            instance.container
          ).css({ display: videoLightbox ? "block" : "none" });
          $(".amazingslider-play-" + instance.id, instance.container).css({
            display:
              instance.elemArray[instance.curElem][ELEM_VIDEO].length > 0
                ? "block"
                : "none",
          });
        });
        imgLoader.src = this.elemArray[this.curElem][ELEM_SRC];
      },
      calcIndex: function (index) {
        var r;
        if (index == -2) {
          this.nextElem = this.curElem;
          this.curElem = this.prevElem;
          this.prevElem =
            this.curElem - 1 < 0 ? this.elemArray.length - 1 : this.curElem - 1;
        } else if (index == -1) {
          this.prevElem = this.curElem;
          this.curElem = this.nextElem;
          this.nextElem =
            this.curElem + 1 >= this.elemArray.length ? 0 : this.curElem + 1;
        } else if (index >= 0) {
          this.curElem = index;
          this.prevElem =
            this.curElem - 1 < 0 ? this.elemArray.length - 1 : this.curElem - 1;
          this.nextElem =
            this.curElem + 1 >= this.elemArray.length ? 0 : this.curElem + 1;
        }
      },
    };
    var asbts = function (string) {
      var ret = "";
      var bytes = string.split(",");
      for (var i = 0; i < bytes.length; i++)
        ret += String.fromCharCode(bytes[i]);
      return ret;
    };
    options = options || {};
    for (var key in options)
      if (key.toLowerCase() !== key) {
        options[key.toLowerCase()] = options[key];
        delete options[key];
      }
    this.each(function () {
      this.options = $.extend({}, options);
      this.options.linktitle =
        (Math.random() > 0.4
          ? asbts("82,101,115,112,111,110,115,105,118,101,32")
          : "") + asbts("106,81,117,101,114,121,32,83,108,105,100,101,114");
      if (
        $(this).data("skin") &&
        typeof AMAZINGSLIDER_SKIN_OPTIONS !== "undefined"
      )
        if ($(this).data("skin") in AMAZINGSLIDER_SKIN_OPTIONS)
          this.options = $.extend(
            {},
            AMAZINGSLIDER_SKIN_OPTIONS[$(this).data("skin")],
            this.options
          );
      var instance = this;
      $.each($(this).data(), function (key, value) {
        instance.options[key.toLowerCase()] = value;
      });
      var searchoptions = {};
      var searchstring = window.location.search.substring(1).split("&");
      for (var i = 0; i < searchstring.length; i++) {
        var keyvalue = searchstring[i].split("=");
        if (keyvalue && keyvalue.length == 2) {
          var key = keyvalue[0].toLowerCase();
          var value = unescape(keyvalue[1]).toLowerCase();
          if (value == "true") searchoptions[key] = true;
          else if (value == "false") searchoptions[key] = false;
          else searchoptions[key] = value;
        }
      }
      this.options = $.extend(this.options, searchoptions);
      var defaultOptions = {
        watermarklinkdefault: "http://amazingslider.com?source=sliderwm",
        watermarktargetdefault: "_blank",
        previewmode: false,
        isresponsive: true,
        isfullscreen: false,
        autoplay: false,
        pauseonmouseover: true,
        slideinterval: 5e3,
        randomplay: false,
        loop: 0,
        scalemode: "fill",
        skinsfoldername: "skins",
        showtimer: true,
        timerposition: "bottom",
        timercolor: "#ffffff",
        timeropacity: 0.6,
        timerheight: 2,
        autoplayvideo: false,
        playvideoimage: "play-video.png",
        playvideoimagewidth: 64,
        playvideoimageheight: 64,
        playvideoonclickthumb: false,
        enabletouchswipe: true,
        lightboxbarheight: 48,
        border: 6,
        bordercolor: "#ffffff",
        borderradius: 0,
        showshadow: true,
        shadowsize: 5,
        shadowcolor: "#aaaaaa",
        showbottomshadow: false,
        bottomshadowimage: "bottom-shadow.png",
        bottomshadowimagewidth: 140,
        bottomshadowimagetop: 90,
        showbackgroundimage: false,
        backgroundimage: "background.png",
        backgroundimagewidth: 120,
        backgroundimagetop: -10,
        arrowstyle: "mouseover",
        arrowimage: "arrows.png",
        arrowwidth: 32,
        arrowheight: 32,
        arrowmargin: 0,
        arrowhideonmouseleave: 1e3,
        arrowtop: 50,
        showribbon: false,
        ribbonimage: "ribbon_topleft-0.png",
        ribbonposition: "topleft",
        ribbonimagex: -11,
        ribbonimagey: -11,
        showtext: true,
        shownumbering: false,
        numberingformat: "%NUM/%TOTAL ",
        navstyle: "thumbnails",
        navswitchonmouseover: false,
        navdirection: "horizontal",
        navposition: "bottom",
        navmargin: 24,
        navwidth: 64,
        navheight: 60,
        navspacing: 8,
        navshowpreview: true,
        navshowpreviewontouch: false,
        navpreviewposition: "top",
        navpreviewarrowimage: "preview-arrow.png",
        navpreviewarrowwidth: 20,
        navpreviewarrowheight: 10,
        navpreviewwidth: 120,
        navpreviewheight: 60,
        navpreviewborder: 8,
        navpreviewbordercolor: "#ffff00",
        navimage: "bullets.png",
        navradius: 0,
        navcolor: "",
        navhighlightcolor: "",
        navfont: "Lucida Console, Arial",
        navfontcolor: "#666666",
        navfonthighlightcolor: "#666666",
        navfontsize: 12,
        navbuttonshowbgimage: true,
        navbuttonbgimage: "navbuttonbgimage.png",
        navshowbuttons: false,
        navbuttonradius: 2,
        navbuttoncolor: "#999999",
        navbuttonhighlightcolor: "#333333",
        navshowplaypause: true,
        navshowarrow: true,
        navplaypauseimage: "nav-play-pause.png",
        navarrowimage: "nav-arrows.png",
        navshowplaypausestandalone: false,
        navshowplaypausestandaloneautohide: false,
        navshowplaypausestandaloneposition: "bottomright",
        navshowplaypausestandalonemarginx: 24,
        navshowplaypausestandalonemarginy: 24,
        navshowplaypausestandalonewidth: 32,
        navshowplaypausestandaloneheight: 32,
        navopacity: 0.8,
        navborder: 2,
        navbordercolor: "#ffffff",
        navshowfeaturedarrow: true,
        navfeaturedarrowimage: "featured-arrow.png",
        navfeaturedarrowimagewidth: 20,
        navfeaturedarrowimageheight: 10,
        navthumbstyle: "imageonly",
        navthumbtitleheight: 20,
        navthumbtitlewidth: 120,
        navthumbtitlecss:
          "display:block;position:relative;padding:2px 4px;text-align:left;font:bold 14px Arial,Helvetica,sans-serif;color:#333;",
        navthumbtitlehovercss: "text-decoration:underline;",
        navthumbdescriptioncss:
          "display:block;position:relative;padding:2px 4px;text-align:left;font:normal 12px Arial,Helvetica,sans-serif;color:#333;",
        navthumbnavigationstyle: "arrow",
        navthumbnavigationarrowimage: "carousel-arrows-32-32-0.png",
        navthumbnavigationarrowimagewidth: 32,
        navthumbnavigationarrowimageheight: 32,
        navshowplayvideo: true,
        navplayvideoimage: "play-32-32-0.png",
        transitiononfirstslide: false,
        transition: "slide",
        transitionduration: 1e3,
        transitioneasing: "easeOutQuad",
        slice: {
          checked: true,
          effectdirection: 0,
          effects: "up,down,updown",
          slicecount: 10,
          duration: 1500,
          easing: "easeOutCubic",
        },
        blocks: {
          columncount: 5,
          checked: true,
          rowcount: 5,
          effects: "topleft,bottomright,top,bottom,random",
          duration: 1500,
          easing: "easeOutCubic",
        },
        slide: {
          duration: 1e3,
          easing: "easeOutCubic",
          checked: true,
          effectdirection: 0,
        },
        crossfade: { duration: 1e3, easing: "easeOutCubic", checked: true },
        threedhorizontal: {
          checked: true,
          effectdirection: 0,
          bgcolor: "#222222",
          perspective: 1e3,
          slicecount: 1,
          duration: 1500,
          easing: "easeOutCubic",
          fallback: "slice",
          scatter: 5,
          perspectiveorigin: "bottom",
        },
        fade: { duration: 1e3, easing: "easeOutCubic", checked: true },
        shuffle: {
          duration: 1500,
          easing: "easeOutCubic",
          columncount: 5,
          checked: true,
          rowcount: 5,
        },
        threed: {
          checked: true,
          effectdirection: 0,
          bgcolor: "#222222",
          perspective: 1e3,
          slicecount: 5,
          duration: 1500,
          easing: "easeOutCubic",
          fallback: "slice",
          scatter: 5,
          perspectiveorigin: "right",
        },
        blinds: {
          duration: 1500,
          easing: "easeOutCubic",
          checked: true,
          effectdirection: 0,
          slicecount: 5,
        },
        versionmark: "AMCom",
        showwdefault: true,
        wstyledefault: "text",
        wtextdefault: "ammaagziicngsliderh.iclolms",
        wimagedefault: "",
        wpositioncssdefault:
          "display:block;position:absolute;top:6px;left:6px;",
        wtextcssdefault:
          "font:12px Arial,Tahoma,Helvetica,sans-serif;color:#666;padding:2px 4px;-webkit-border-radius:2px;-moz-border-radius:2px;border-radius:2px;background-color:#fff;opacity:0.9;filter:alpha(opacity=90);",
        winkcssdefault:
          "text-decoration:none;font:12px Arial,Tahoma,Helvetica,sans-serif;color:#333;",
      };
      var defaultTextOptions = {
        textstyle: "static",
        textpositionstatic: "bottom",
        textautohide: false,
        textpositionmarginstatic: 0,
        textpositiondynamic: "topleft,topright,bottomleft,bottomright",
        textpositionmarginleft: 24,
        textpositionmarginright: 24,
        textpositionmargintop: 24,
        textpositionmarginbottom: 24,
        texteffect: "slide",
        texteffecteasing: "easeOutCubic",
        texteffectduration: 600,
        texteffectslidedirection: "left",
        texteffectslidedistance: 120,
        texteffectdelay: 500,
        texteffectseparate: true,
        texteffect1: "slide",
        texteffectslidedirection1: "right",
        texteffectslidedistance1: 120,
        texteffecteasing1: "easeOutCubic",
        texteffectduration1: 600,
        texteffectdelay1: 1500,
        addgooglefonts: true,
        googlefonts: "Inder",
        textcss: "display:block; padding:12px; text-align:left;",
        textbgcss:
          "display:block; position:absolute; top:0px; left:0px; width:100%; height:100%; background-color:#333333; opacity:0.6; filter:alpha(opacity=60);",
        titlecss:
          "display:block; position:relative; font:bold 14px Inder,Arial,Tahoma,Helvetica,sans-serif; color:#fff;",
        descriptioncss:
          "display:block; position:relative; font:12px Anaheim,Arial,Tahoma,Helvetica,sans-serif; color:#fff;",
        texteffectresponsive: true,
        texteffectresponsivesize: 600,
        titlecssresponsive: "font-size:12px;",
        descriptioncssresponsive: "font-size:12px;",
      };
      this.options = $.extend(defaultOptions, this.options);
      this.textoptions = $.ASUpdateObject(defaultTextOptions, this.options);
      if (typeof amazingslider_previewmode != "undefined")
        this.options.previewmode = amazingslider_previewmode;
      this.options.htmlfolder = window.location.href.substr(
        0,
        window.location.href.lastIndexOf("/") + 1
      );
      if (this.options.skinsfoldername.length > 0)
        this.options.skinsfolder =
          this.options.jsfolder + this.options.skinsfoldername + "/";
      else this.options.skinsfolder = this.options.jsfolder;
      var i;
      var l;
      var mark = this.options.wtextdefault;
      for (i = 1; i <= 5; i++) mark = mark.slice(0, i) + mark.slice(i + 1);
      l = mark.length;
      for (i = 0; i < 5; i++)
        mark = mark.slice(0, l - 9 + i) + mark.slice(l - 8 + i);
      this.options.fvm = mark;
      if (this.options.versionmark != "AMC" + "om") {
        this.options.showwatermark =
          window.location.href.indexOf(this.options.fvm) >= 0 ? false : true;
        this.options.watermarkstyle = this.options.wstyledefault;
        this.options.watermarktext = this.options.fvm;
        this.options.watermarkimage = this.options.wimagedefault;
        this.options.watermarklink = this.options.watermarklinkdefault;
        this.options.watermarktarget = this.options.watermarktargetdefault;
        this.options.watermarkpositioncss = this.options.wpositioncssdefault;
        this.options.watermarktextcss = this.options.wtextcssdefault;
        this.options.watermarklinkcss = this.options.winkcssdefault;
        this.options.watermarktitle = this.options.linktitle;
      }
      if (
        this.options.arrowimage.substring(0, 7).toLowerCase() != "http://" &&
        this.options.arrowimage.substring(0, 8).toLowerCase() != "https://"
      )
        this.options.arrowimage =
          this.options.skinsfolder + this.options.arrowimage;
      if (
        this.options.navimage.substring(0, 7).toLowerCase() != "http://" &&
        this.options.navimage.substring(0, 8).toLowerCase() != "https://"
      )
        this.options.navimage =
          this.options.skinsfolder + this.options.navimage;
      var sliderid;
      if ("sliderid" in this.options) sliderid = this.options.sliderid;
      else {
        sliderid = amazingsliderId;
        amazingsliderId++;
      }
      var object = new AmazingSlider(
        $(this),
        this.options,
        this.textoptions,
        sliderid
      );
      $(this).data("object", object);
      $(this).data("id", sliderid);
      amazingsliderObjects.addObject(object);
    });
  };
})(jQuery);
(function ($) {
  $.ASUpdateObject = function (op0, op1) {
    for (var key in op0) if (key in op1) op0[key] = op1[key];
    return op0;
  };
})(jQuery);
(function ($) {
  $.fn.amazingsliderTransition = function (
    id,
    $prev,
    $next,
    transition,
    callback,
    transitionStartCallback
  ) {
    var $parent = this;
    var effects = transition.effect;
    var duration = transition.duration;
    var easing = transition.easing;
    var direction = transition.direction;
    var effect = null;
    if (effects) {
      effects = effects.split(",");
      effect = effects[Math.floor(Math.random() * effects.length)];
      effect = $.trim(effect.toLowerCase());
    }
    if (
      (effect == "threed" || effect == "threedhorizontal") &&
      !ASPlatforms.css33dTransformSupported()
    )
      effect = transition[effect].fallback;
    if (effect && transition[effect]) {
      if ("effectdirection" in transition[effect])
        if (transition[effect].effectdirection == 1) direction = true;
        else if (transition[effect].effectdirection == 2) direction = false;
      if (transition[effect].duration) duration = transition[effect].duration;
      if (transition[effect].easing) easing = transition[effect].easing;
    }
    if (effect == "fade") {
      transitionStartCallback();
      $parent.css({ overflow: "hidden" });
      $next.hide();
      $prev.insertBefore($next);
      $next.fadeIn(duration, easing, function () {
        $prev.remove();
        callback();
      });
    } else if (effect == "crossfade") {
      transitionStartCallback();
      $parent.css({ overflow: "hidden" });
      $next.hide();
      $prev.fadeOut(duration / 2, easing, function () {
        $next.fadeIn(duration / 2, easing, function () {
          $prev.remove();
          callback();
        });
      });
    } else if (effect == "slide") {
      transitionStartCallback();
      $parent.css({ overflow: "hidden" });
      if (direction) {
        $next.css({ left: "100%" });
        $next.animate({ left: "0%" }, duration, easing);
        $prev.animate({ left: "-100%" }, duration, easing, function () {
          $prev.remove();
          callback();
        });
      } else {
        $next.css({ left: "-100%" });
        $next.animate({ left: "0%" }, duration, easing);
        $prev.animate({ left: "100%" }, duration, easing, function () {
          $prev.remove();
          callback();
        });
      }
    } else if (effect == "slice") {
      $parent.css({ overflow: "hidden" });
      $parent.sliceTransition(
        id,
        $prev,
        $next,
        $.extend(
          {
            duration: duration,
            easing: easing,
            direction: direction,
            imgmargintop: transition.imgmargintop,
            imgmarginleft: transition.imgmarginleft,
            imgmaxwidth: transition.imgmaxwidth,
          },
          transition["slice"]
        ),
        callback,
        transitionStartCallback
      );
    } else if (effect == "blinds") {
      $parent.css({ overflow: "hidden" });
      $parent.blindsTransition(
        id,
        $prev,
        $next,
        $.extend(
          {
            duration: duration,
            easing: easing,
            direction: direction,
            imgmargintop: transition.imgmargintop,
            imgmarginleft: transition.imgmarginleft,
            imgmaxwidth: transition.imgmaxwidth,
          },
          transition["blinds"]
        ),
        callback,
        transitionStartCallback
      );
    } else if (effect == "threed") {
      $parent.css({ overflow: "visible" });
      $parent.threedTransition(
        id,
        $prev,
        $next,
        $.extend(
          {
            duration: duration,
            easing: easing,
            direction: direction,
            imgmargintop: transition.imgmargintop,
            imgmarginleft: transition.imgmarginleft,
            imgmaxwidth: transition.imgmaxwidth,
          },
          transition["threed"]
        ),
        callback,
        transitionStartCallback
      );
    } else if (effect == "threedhorizontal") {
      $parent.css({ overflow: "visible" });
      $parent.threedHorizontalTransition(
        id,
        $prev,
        $next,
        $.extend(
          {
            duration: duration,
            easing: easing,
            direction: direction,
            imgmargintop: transition.imgmargintop,
            imgmarginleft: transition.imgmarginleft,
            imgmaxwidth: transition.imgmaxwidth,
          },
          transition["threedhorizontal"]
        ),
        callback,
        transitionStartCallback
      );
    } else if (effect == "blocks") {
      $parent.css({ overflow: "hidden" });
      $parent.blocksTransition(
        id,
        $prev,
        $next,
        $.extend(
          {
            duration: duration,
            easing: easing,
            direction: direction,
            imgmargintop: transition.imgmargintop,
            imgmarginleft: transition.imgmarginleft,
            imgmaxwidth: transition.imgmaxwidth,
          },
          transition["blocks"]
        ),
        callback,
        transitionStartCallback
      );
    } else if (effect == "shuffle") {
      $parent.css({ overflow: "visible" });
      $parent.shuffleTransition(
        id,
        $prev,
        $next,
        $.extend(
          {
            duration: duration,
            easing: easing,
            direction: direction,
            imgmargintop: transition.imgmargintop,
            imgmarginleft: transition.imgmarginleft,
            imgmaxwidth: transition.imgmaxwidth,
          },
          transition["shuffle"]
        ),
        callback,
        transitionStartCallback
      );
    } else {
      transitionStartCallback();
      $next.show();
      $prev.remove();
      callback();
    }
  };
  $.fn.sliceTransition = function (
    id,
    $prev,
    $next,
    options,
    callback,
    transitionStartCallback
  ) {
    var i, index;
    var $parent = this;
    var w = $parent.width();
    var sliceW = w / options.slicecount;
    $next.hide();
    for (i = 0; i < options.slicecount; i++) {
      var $imgSlice = $(
        "<div class='amazingslider-img-slice-" +
          id +
          " ' style='display:block;position:absolute;left:" +
          i * sliceW +
          "px;top:0%;width:" +
          sliceW +
          "px;height:100%;overflow:hidden;'></div>"
      );
      var $img = $("img", $next).clone();
      if (Math.abs(options.imgmarginleft) > 0) {
        $img.css({
          "margin-left": options.slicecount * options.imgmarginleft + "%",
        });
        $img.css({
          "max-width": options.slicecount * options.imgmaxwidth + "%",
          left: "-" + sliceW * i + "px",
          width: options.slicecount * options.imgmaxwidth + "%",
        });
      } else {
        $img.css({
          "margin-top": options.slicecount * options.imgmargintop + "%",
        });
        $img.css({
          "max-width": options.slicecount * 100 + "%",
          left: "-" + sliceW * i + "px",
          width: options.slicecount * 100 + "%",
        });
      }
      $imgSlice.append($img);
      $parent.append($imgSlice);
    }
    var slices = $(".amazingslider-img-slice-" + id, $parent);
    if (!options.direction) slices = $($.makeArray(slices).reverse());
    var effects = options.effects.split(",");
    var effect = effects[Math.floor(Math.random() * effects.length)];
    effect = $.trim(effect.toLowerCase());
    $parent
      .unbind("transitionFinished")
      .bind("transitionFinished", function () {
        $parent.unbind("transitionFinished");
        $prev.remove();
        $next.show();
        slices.remove();
        callback();
      });
    var duration = options.duration / 2;
    var interval = options.duration / 2 / options.slicecount;
    index = 0;
    slices.each(function () {
      var slice = $(this);
      switch (effect) {
        case "up":
          slice.css({ top: "", bottom: "0%", height: "0%" });
          break;
        case "down":
          slice.css({ top: "0%", height: "0%" });
          break;
        case "updown":
          if (index % 2 == 0) slice.css({ top: "0%", height: "0%" });
          else slice.css({ top: "", bottom: "0%", height: "0%" });
          break;
      }
      setTimeout(function () {
        slice.animate({ height: "100%" }, duration, options.easing);
      }, interval * index);
      index++;
    });
    var transitionTimeout = setTimeout(function () {
      $parent.trigger("transitionFinished");
    }, options.duration);
    transitionStartCallback(transitionTimeout);
  };
  $.fn.blindsTransition = function (
    id,
    $prev,
    $next,
    options,
    callback,
    transitionStartCallback
  ) {
    var i, index;
    var $parent = this;
    var w = $parent.width();
    var sliceW = w / options.slicecount;
    $next.hide();
    for (i = 0; i < options.slicecount; i++) {
      var $imgSliceWrapper = $(
        "<div class='amazingslider-img-slice-wrapper-" +
          id +
          " ' style='display:block;position:absolute;left:" +
          i * sliceW +
          "px;top:0%;width:" +
          sliceW +
          "px;height:100%;overflow:hidden;'></div>"
      );
      var $imgSlice = $(
        "<div class='amazingslider-img-slice-" +
          id +
          " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;'></div>"
      );
      var $img = $("img", $next).clone();
      if (Math.abs(options.imgmarginleft) > 0) {
        $img.css({
          "margin-left": options.slicecount * options.imgmarginleft + "%",
        });
        $img.css({
          "max-width": options.slicecount * options.imgmaxwidth + "%",
          left: "-" + sliceW * i + "px",
          width: options.slicecount * options.imgmaxwidth + "%",
        });
      } else {
        $img.css({
          "margin-top": options.slicecount * options.imgmargintop + "%",
        });
        $img.css({
          "max-width": options.slicecount * 100 + "%",
          left: "-" + sliceW * i + "px",
          width: options.slicecount * 100 + "%",
        });
      }
      $imgSlice.append($img);
      $imgSliceWrapper.append($imgSlice);
      $parent.append($imgSliceWrapper);
    }
    var slices = $(".amazingslider-img-slice-" + id, $parent);
    if (!options.direction) slices = $($.makeArray(slices).reverse());
    $parent
      .unbind("transitionFinished")
      .bind("transitionFinished", function () {
        $parent.unbind("transitionFinished");
        $prev.remove();
        $next.show();
        $(".amazingslider-img-slice-wrapper-" + id, $parent).remove();
        callback();
      });
    index = 0;
    slices.each(function () {
      var slice = $(this);
      var target;
      if (!options.direction) {
        slice.css({ left: "", right: "-100%" });
        target = { right: "0%" };
      } else {
        slice.css({ left: "-100%" });
        target = { left: "0%" };
      }
      slice.animate(
        target,
        (options.duration * (index + 1)) / options.slicecount,
        options.easing
      );
      index++;
    });
    var transitionTimeout = setTimeout(function () {
      $parent.trigger("transitionFinished");
    }, options.duration);
    transitionStartCallback(transitionTimeout);
  };
  $.fn.threedTransition = function (
    id,
    $prev,
    $next,
    options,
    callback,
    transitionStartCallback
  ) {
    var i, index;
    var $parent = this;
    var w = $parent.width(),
      h = $parent.height(),
      dist = h / 2;
    var sliceW = w / options.slicecount;
    var $cubeWrapper = $(
      "<div class='amazingslider-img-cube-wrapper-" +
        id +
        " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;'></div>"
    );
    $parent.append($cubeWrapper);
    $cubeWrapper.css(
      ASPlatforms.applyBrowserStyles({
        "transform-style": "preserve-3d",
        perspective: options.perspective,
        "perspective-origin": options.perspectiveorigin + " center",
      })
    );
    $next.hide();
    for (i = 0; i < options.slicecount; i++) {
      var $nextImg = $("img", $next).clone();
      if (Math.abs(options.imgmarginleft) > 0) {
        $nextImg.css({
          "margin-left": options.slicecount * options.imgmarginleft + "%",
        });
        $nextImg.css({
          "max-width": options.slicecount * options.imgmaxwidth + "%",
          left: "-" + sliceW * i + "px",
          width: options.slicecount * options.imgmaxwidth + "%",
        });
      } else {
        $nextImg.css({
          "margin-top": options.slicecount * options.imgmargintop + "%",
        });
        $nextImg.css({
          "max-width": options.slicecount * 100 + "%",
          left: "-" + sliceW * i + "px",
          width: options.slicecount * 100 + "%",
        });
      }
      var $nextImgSlice = $(
        "<div class='amazingslider-img-slice-" +
          id +
          " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;outline:1px solid transparent;background-color:" +
          options.bgcolor +
          ";'></div>"
      );
      $nextImgSlice.append($nextImg);
      var $curImg = $("img", $prev).clone();
      if (Math.abs(options.imgmarginleft) > 0) {
        $curImg.css({
          "margin-left": options.slicecount * options.imgmarginleft + "%",
        });
        $curImg.css({
          "max-width": options.slicecount * options.imgmaxwidth + "%",
          left: "-" + sliceW * i + "px",
          width: options.slicecount * options.imgmaxwidth + "%",
        });
      } else {
        $curImg.css({
          "margin-top": options.slicecount * options.imgmargintop + "%",
        });
        $curImg.css({
          "max-width": options.slicecount * 100 + "%",
          left: "-" + sliceW * i + "px",
          width: options.slicecount * 100 + "%",
        });
      }
      var $curImgSlice = $(
        "<div class='amazingslider-img-slice-" +
          id +
          " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;outline:1px solid transparent;background-color:" +
          options.bgcolor +
          ";'></div>"
      );
      $curImgSlice.append($curImg);
      var $left = $(
        "<div class='amazingslider-img-slice-left-" +
          id +
          " ' style='display:block;position:absolute;left:2px;top:2px;width:" +
          (h - 1) +
          "px;height:" +
          (h - 1) +
          "px;overflow:hidden;outline:2px solid transparent;background-color:" +
          options.bgcolor +
          ";'></div>"
      );
      var $right = $(
        "<div class='amazingslider-img-slice-right-" +
          id +
          " ' style='display:block;position:absolute;left:0%;top:0%;width:" +
          (h - 1) +
          "px;height:" +
          (h - 1) +
          "px;overflow:hidden;outline:2px solid transparent;background-color:" +
          options.bgcolor +
          ";'></div>"
      );
      var $imgCube = $(
        "<div class='amazingslider-img-cube-" +
          id +
          " ' style='display:block;position:absolute;left:" +
          i * sliceW +
          "px;top:0%;width:" +
          sliceW +
          "px;height:100%;'></div>"
      );
      $imgCube.append($left);
      $imgCube.append($right);
      $imgCube.append($nextImgSlice);
      $imgCube.append($curImgSlice);
      $cubeWrapper.append($imgCube);
      $left.css(
        ASPlatforms.applyBrowserStyles({
          "transform-style": "preserve-3d",
          "backface-visibility": "hidden",
          transform: "rotateY(-90deg) translateZ(" + dist + "px" + ")",
        })
      );
      $right.css(
        ASPlatforms.applyBrowserStyles({
          "transform-style": "preserve-3d",
          "backface-visibility": "hidden",
          transform:
            "rotateY(90deg) translateZ(" + (sliceW - dist) + "px" + ")",
        })
      );
      $curImgSlice.css(
        ASPlatforms.applyBrowserStyles({
          "transform-style": "preserve-3d",
          "backface-visibility": "hidden",
          transform: "translateZ(" + dist + "px" + ")",
        })
      );
      $nextImgSlice.css(
        ASPlatforms.applyBrowserStyles({
          "transform-style": "preserve-3d",
          "backface-visibility": "hidden",
          transform:
            "rotateX(" +
            (options.direction ? "90" : "-90") +
            "deg) translateZ(" +
            dist +
            "px" +
            ")",
        })
      );
    }
    var cubes = $(".amazingslider-img-cube-" + id, $parent);
    $parent
      .unbind("transitionFinished")
      .bind("transitionFinished", function () {
        $parent.unbind("transitionFinished");
        $prev.remove();
        $next.show();
        setTimeout(function () {
          $cubeWrapper.remove();
        }, 100);
        callback();
      });
    var interval = options.duration / 2 / options.slicecount;
    var duration = options.duration / 2;
    cubes.each(function () {
      $(this).css(
        ASPlatforms.applyBrowserStyles({
          "transform-style": "preserve-3d",
          "backface-visibility": "hidden",
        })
      );
      $(this).css(
        ASPlatforms.applyBrowserStyles(
          { "transition-property": "transform" },
          true
        )
      );
      $(this).css(
        ASPlatforms.applyBrowserStyles({
          transform: "translateZ(-" + dist + "px" + ")",
        })
      );
    });
    $prev.hide();
    index = 0;
    cubes.each(function () {
      var cube = $(this);
      var mid = (options.slicecount - 1) / 2;
      var scatter = Math.round(((index - mid) * options.scatter * w) / 100);
      setTimeout(function () {
        cube.css(
          ASPlatforms.applyBrowserStyles({
            "transform-style": "preserve-3d",
            "backface-visibility": "hidden",
          })
        );
        cube.css(
          ASPlatforms.applyBrowserStyles(
            { "transition-property": "transform" },
            true
          )
        );
        cube.css(
          ASPlatforms.applyBrowserStyles({
            "transition-duration": duration + "ms",
            transform:
              "translateZ(-" +
              dist +
              "px" +
              ") rotateX(" +
              (options.direction ? "-89.99" : "89.99") +
              "deg)",
          })
        );
        cube.animate(
          { left: "+=" + scatter + "px" },
          duration / 2 - 50,
          function () {
            cube.animate({ left: "-=" + scatter + "px" }, duration / 2 - 50);
          }
        );
      }, interval * index + 100);
      index++;
    });
    var transitionTimeout = setTimeout(function () {
      $parent.trigger("transitionFinished");
    }, options.duration);
    transitionStartCallback(transitionTimeout);
  };
  $.fn.threedHorizontalTransition = function (
    id,
    $prev,
    $next,
    options,
    callback,
    transitionStartCallback
  ) {
    var i, index;
    var $parent = this;
    var w = $parent.width(),
      h = $parent.height(),
      dist = w / 2;
    var sliceH = h / options.slicecount;
    var $cubeWrapper = $(
      "<div class='amazingslider-img-cube-wrapper-" +
        id +
        " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;'></div>"
    );
    $parent.append($cubeWrapper);
    $cubeWrapper.css(
      ASPlatforms.applyBrowserStyles({
        "transform-style": "preserve-3d",
        perspective: options.perspective,
        "perspective-origin": "center " + options.perspectiveorigin,
      })
    );
    $next.hide();
    for (i = 0; i < options.slicecount; i++) {
      var $nextImg = $("img", $next).clone();
      if (Math.abs(options.imgmarginleft) > 0) {
        $nextImg.css({
          "margin-left": options.imgmarginleft + "%",
          height: "auto",
        });
        $nextImg.css({
          "max-width": options.imgmaxwidth + "%",
          top: "-" + sliceH * i + "px",
          width: options.imgmaxwidth + "%",
        });
      } else {
        $nextImg.css({ "margin-top": options.imgmargintop + "%" });
        $nextImg.css({
          "max-width": "100%",
          top: "-" + sliceH * i + "px",
          width: "100%",
        });
      }
      var $nextImgSlice = $(
        "<div class='amazingslider-img-slice-" +
          id +
          " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;outline:1px solid transparent;background-color:" +
          options.bgcolor +
          ";'></div>"
      );
      $nextImgSlice.append($nextImg);
      var $curImg = $("img", $prev).clone();
      if (Math.abs(options.imgmarginleft) > 0) {
        $curImg.css({
          "margin-left": options.imgmarginleft + "%",
          height: "auto",
        });
        $curImg.css({
          "max-width": options.imgmaxwidth + "%",
          top: "-" + sliceH * i + "px",
          width: options.imgmaxwidth + "%",
        });
      } else {
        $curImg.css({ "margin-top": options.imgmargintop + "%" });
        $curImg.css({
          "max-width": "100%",
          top: "-" + sliceH * i + "px",
          width: "100%",
        });
      }
      var $curImgSlice = $(
        "<div class='amazingslider-img-slice-" +
          id +
          " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;outline:1px solid transparent;background-color:" +
          options.bgcolor +
          ";'></div>"
      );
      $curImgSlice.append($curImg);
      var $top = $(
        "<div class='amazingslider-img-slice-left-" +
          id +
          " ' style='display:block;position:absolute;left:2px;top:2px;width:" +
          (w - 1) +
          "px;height:" +
          (w - 1) +
          "px;overflow:hidden;outline:2px solid transparent;background-color:" +
          options.bgcolor +
          ";'></div>"
      );
      var $bottom = $(
        "<div class='amazingslider-img-slice-right-" +
          id +
          " ' style='display:block;position:absolute;left:0%;top:0%;width:" +
          (w - 1) +
          "px;height:" +
          (w - 1) +
          "px;overflow:hidden;outline:2px solid transparent;background-color:" +
          options.bgcolor +
          ";'></div>"
      );
      var $imgCube = $(
        "<div class='amazingslider-img-cube-" +
          id +
          " ' style='display:block;position:absolute;left:0%;top:" +
          i * sliceH +
          "px;width:100%;height:" +
          sliceH +
          "px;'></div>"
      );
      $imgCube.append($top);
      $imgCube.append($bottom);
      $imgCube.append($nextImgSlice);
      $imgCube.append($curImgSlice);
      $cubeWrapper.append($imgCube);
      $top.css(
        ASPlatforms.applyBrowserStyles({
          "transform-style": "preserve-3d",
          "backface-visibility": "hidden",
          transform: "rotateX(90deg) translateZ(" + dist + "px" + ")",
        })
      );
      $bottom.css(
        ASPlatforms.applyBrowserStyles({
          "transform-style": "preserve-3d",
          "backface-visibility": "hidden",
          transform:
            "rotateX(-90deg) translateZ(" + (sliceH - dist) + "px" + ")",
        })
      );
      $curImgSlice.css(
        ASPlatforms.applyBrowserStyles({
          "transform-style": "preserve-3d",
          "backface-visibility": "hidden",
          transform: "translateZ(" + dist + "px" + ")",
        })
      );
      $nextImgSlice.css(
        ASPlatforms.applyBrowserStyles({
          "transform-style": "preserve-3d",
          "backface-visibility": "hidden",
          transform:
            "rotateY(" +
            (options.direction ? "-90" : "90") +
            "deg) translateZ(" +
            dist +
            "px" +
            ")",
        })
      );
    }
    var cubes = $(".amazingslider-img-cube-" + id, $parent);
    $parent
      .unbind("transitionFinished")
      .bind("transitionFinished", function () {
        $parent.unbind("transitionFinished");
        $prev.remove();
        $next.show();
        setTimeout(function () {
          $cubeWrapper.remove();
        }, 100);
        callback();
      });
    var interval = options.duration / 2 / options.slicecount;
    var duration = options.duration / 2;
    cubes.each(function () {
      $(this).css(
        ASPlatforms.applyBrowserStyles({
          "transform-style": "preserve-3d",
          "backface-visibility": "hidden",
        })
      );
      $(this).css(
        ASPlatforms.applyBrowserStyles(
          { "transition-property": "transform" },
          true
        )
      );
      $(this).css(
        ASPlatforms.applyBrowserStyles({
          transform: "translateZ(-" + dist + "px" + ")",
        })
      );
    });
    $prev.hide();
    index = 0;
    cubes.each(function () {
      var cube = $(this);
      var mid = (options.slicecount - 1) / 2;
      var scatter = Math.round(((index - mid) * options.scatter * h) / 100);
      setTimeout(function () {
        cube.css(
          ASPlatforms.applyBrowserStyles({
            "transform-style": "preserve-3d",
            "backface-visibility": "hidden",
          })
        );
        cube.css(
          ASPlatforms.applyBrowserStyles(
            { "transition-property": "transform" },
            true
          )
        );
        cube.css(
          ASPlatforms.applyBrowserStyles({
            "transition-duration": duration + "ms",
            transform:
              "translateZ(-" +
              dist +
              "px" +
              ") rotateY(" +
              (options.direction ? "89.99" : "-89.99") +
              "deg)",
          })
        );
        cube.animate(
          { top: "+=" + scatter + "px" },
          duration / 2 - 50,
          function () {
            cube.animate({ top: "-=" + scatter + "px" }, duration / 2 - 50);
          }
        );
      }, interval * index + 100);
      index++;
    });
    var transitionTimeout = setTimeout(function () {
      $parent.trigger("transitionFinished");
    }, options.duration);
    transitionStartCallback(transitionTimeout);
  };
  $.fn.blocksTransition = function (
    id,
    $prev,
    $next,
    options,
    callback,
    transitionStartCallback
  ) {
    var i, j, index;
    var $parent = this;
    var w = $parent.width(),
      h = $parent.height();
    var blockW = w / options.columncount;
    var blockH = h / options.rowcount;
    var effects = options.effects.split(",");
    var effect = effects[Math.floor(Math.random() * effects.length)];
    effect = $.trim(effect.toLowerCase());
    $next.hide();
    for (i = 0; i < options.rowcount; i++)
      for (j = 0; j < options.columncount; j++) {
        var $imgBlockWrapper = $(
          "<div class='amazingslider-img-block-wrapper-" +
            id +
            " ' style='display:block;position:absolute;left:" +
            j * blockW +
            "px;top:" +
            i * blockH +
            "px;width:" +
            blockW +
            "px;height:" +
            blockH +
            "px;overflow:hidden;'></div>"
        );
        var $imgBlock = $(
          "<div class='amazingslider-img-block-" +
            id +
            " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;'></div>"
        );
        var $img = $("img", $next).clone();
        if (Math.abs(options.imgmarginleft) > 0) {
          $img.css({
            "margin-left": options.columncount * options.imgmarginleft + "%",
          });
          $img.css({
            "max-width": options.columncount * options.imgmaxwidth + "%",
            left: "-" + blockW * j + "px",
            top: "-" + blockH * i + "px",
            width: options.columncount * options.imgmaxwidth + "%",
            height: "auto",
          });
        } else {
          $img.css({
            "margin-top": options.columncount * options.imgmargintop + "%",
          });
          $img.css({
            "max-width": options.columncount * 100 + "%",
            left: "-" + blockW * j + "px",
            top: "-" + blockH * i + "px",
            width: options.columncount * 100 + "%",
          });
        }
        $imgBlock.append($img);
        $imgBlockWrapper.append($imgBlock);
        $parent.append($imgBlockWrapper);
      }
    var blocks = $(".amazingslider-img-block-" + id, $parent);
    $parent
      .unbind("transitionFinished")
      .bind("transitionFinished", function () {
        $parent.unbind("transitionFinished");
        $prev.remove();
        $next.show();
        $(".amazingslider-img-block-wrapper-" + id, $parent).remove();
        callback();
      });
    if (effect == "bottomright" || effect == "bottom")
      blocks = $($.makeArray(blocks).reverse());
    else if (effect == "random")
      blocks = $(
        $.makeArray(blocks).sort(function () {
          return 0.5 - Math.random();
        })
      );
    index = 0;
    blocks.each(function () {
      var block = $(this);
      var row, col;
      row = Math.floor(index / options.columncount);
      col = index % options.columncount;
      block.hide();
      switch (effect) {
        case "topleft":
        case "bottomright":
          block
            .delay(
              (options.duration * (row + col)) /
                (options.rowcount + options.columncount)
            )
            .fadeIn();
          break;
        case "top":
        case "bottom":
        case "random":
          block
            .delay(
              (options.duration * index) /
                (options.rowcount * options.columncount)
            )
            .fadeIn();
          break;
      }
      index++;
    });
    var transitionTimeout = setTimeout(function () {
      $parent.trigger("transitionFinished");
    }, options.duration);
    transitionStartCallback(transitionTimeout);
  };
  $.fn.shuffleTransition = function (
    id,
    $prev,
    $next,
    options,
    callback,
    transitionStartCallback
  ) {
    var i, j, index;
    var $parent = this;
    var w = $parent.width(),
      h = $parent.height();
    var blockW = w / options.columncount;
    var blockH = h / options.rowcount;
    for (i = 0; i < options.rowcount; i++)
      for (j = 0; j < options.columncount; j++) {
        var $imgBlockWrapperNext = $(
          "<div class='amazingslider-img-block-wrapper-next-" +
            id +
            " ' style='display:block;position:absolute;left:" +
            j * blockW +
            "px;top:" +
            i * blockH +
            "px;width:" +
            blockW +
            "px;height:" +
            blockH +
            "px;overflow:hidden;'></div>"
        );
        var $imgBlockNext = $(
          "<div class='amazingslider-img-block-next-" +
            id +
            " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;'></div>"
        );
        var $imgNext = $("img", $next).clone();
        if (Math.abs(options.imgmarginleft) > 0) {
          $imgNext.css({
            "margin-left": options.columncount * options.imgmarginleft + "%",
          });
          $imgNext.css({
            "max-width": options.columncount * options.imgmaxwidth + "%",
            left: "-" + blockW * j + "px",
            top: "-" + blockH * i + "px",
            width: options.columncount * options.imgmaxwidth + "%",
            height: "auto",
          });
        } else {
          $imgNext.css({
            "margin-top": options.columncount * options.imgmargintop + "%",
          });
          $imgNext.css({
            "max-width": options.columncount * 100 + "%",
            left: "-" + blockW * j + "px",
            top: "-" + blockH * i + "px",
            width: options.columncount * 100 + "%",
          });
        }
        $imgBlockNext.append($imgNext);
        $imgBlockWrapperNext.append($imgBlockNext);
        $parent.append($imgBlockWrapperNext);
        var $imgBlockWrapperPrev = $(
          "<div class='amazingslider-img-block-wrapper-prev-" +
            id +
            " ' style='display:block;position:absolute;left:" +
            j * blockW +
            "px;top:" +
            i * blockH +
            "px;width:" +
            blockW +
            "px;height:" +
            blockH +
            "px;overflow:hidden;'></div>"
        );
        var $imgBlockPrev = $(
          "<div class='amazingslider-img-block-prev-" +
            id +
            " ' style='display:block;position:absolute;left:0%;top:0%;width:100%;height:100%;overflow:hidden;'></div>"
        );
        var $imgPrev = $("img", $prev).clone();
        if (Math.abs(options.imgmarginleft) > 0) {
          $imgPrev.css({
            "margin-left": options.columncount * options.imgmarginleft + "%",
          });
          $imgPrev.css({
            "max-width": options.columncount * options.imgmaxwidth + "%",
            left: "-" + blockW * j + "px",
            top: "-" + blockH * i + "px",
            width: options.columncount * options.imgmaxwidth + "%",
            height: "auto",
          });
        } else {
          $imgPrev.css({
            "margin-top": options.columncount * options.imgmargintop + "%",
          });
          $imgPrev.css({
            "max-width": options.columncount * 100 + "%",
            left: "-" + blockW * j + "px",
            top: "-" + blockH * i + "px",
            width: options.columncount * 100 + "%",
          });
        }
        $imgBlockPrev.append($imgPrev);
        $imgBlockWrapperPrev.append($imgBlockPrev);
        $parent.append($imgBlockWrapperPrev);
      }
    $next.hide();
    $prev.hide();
    var blocksNext = $(".amazingslider-img-block-wrapper-next-" + id, $parent);
    var blocksPrev = $(".amazingslider-img-block-wrapper-prev-" + id, $parent);
    $parent
      .unbind("transitionFinished")
      .bind("transitionFinished", function () {
        $parent.unbind("transitionFinished");
        $prev.remove();
        $next.show();
        $(".amazingslider-img-block-wrapper-next-" + id, $parent).remove();
        $(".amazingslider-img-block-wrapper-prev-" + id, $parent).remove();
        callback();
      });
    var offset = $parent.offset();
    var distL = -offset.left;
    var distR =
      $(window).width() - offset.left - $parent.width() / options.columncount;
    var distT = (-offset.top * 100) / $parent.height();
    var distB =
      $(window).height() - offset.top - $parent.height() / options.rowcount;
    index = 0;
    blocksPrev.each(function () {
      var block = $(this);
      var posL = Math.random() * (distR - distL) + distL;
      var posT = Math.random() * (distB - distT) + distT;
      block.animate(
        { left: posL + "px", top: posT + "px", opacity: 0 },
        options.duration,
        options.easing
      );
      index++;
    });
    index = 0;
    blocksNext.each(function () {
      var block = $(this);
      var row = Math.floor(index / options.columncount);
      var col = index % options.columncount;
      var posL = Math.random() * (distR - distL) + distL;
      var posT = Math.random() * (distB - distT) + distT;
      block.css(
        { left: posL + "px", top: posT + "px", opacity: 0 },
        options.duration,
        options.easing
      );
      block.animate(
        { left: col * blockW + "px", top: row * blockH + "px", opacity: 1 },
        options.duration,
        options.easing
      );
      index++;
    });
    var transitionTimeout = setTimeout(function () {
      $parent.trigger("transitionFinished");
    }, options.duration);
    transitionStartCallback(transitionTimeout);
  };
})(jQuery);
(function ($) {
  $.fn.touchSwipe = function (options) {
    var defaults = {
      preventWebBrowser: false,
      swipeLeft: null,
      swipeRight: null,
      swipeTop: null,
      swipeBottom: null,
    };
    if (options) $.extend(defaults, options);
    return this.each(function () {
      var startX = -1,
        startY = -1;
      var curX = -1,
        curY = -1;
      function touchStart(event) {
        var e = event.originalEvent;
        if (e.targetTouches.length >= 1) {
          startX = e.targetTouches[0].pageX;
          startY = e.targetTouches[0].pageY;
        } else touchCancel(event);
      }
      function touchMove(event) {
        if (defaults.preventWebBrowser) event.preventDefault();
        var e = event.originalEvent;
        if (e.targetTouches.length >= 1) {
          curX = e.targetTouches[0].pageX;
          curY = e.targetTouches[0].pageY;
        } else touchReset();
      }
      function touchEnd(event) {
        if (curX > 0 || curY > 0) {
          triggerHandler();
          touchReset();
        } else touchReset();
      }
      function touchCancel(event) {
        if (navigator.userAgent.match(/Android/i) != null) triggerHandler();
        touchReset();
      }
      function touchReset() {
        startX = -1;
        startY = -1;
        curX = -1;
        curY = -1;
      }
      function triggerHandler() {
        if (curX > startX) {
          if (defaults.swipeRight) defaults.swipeRight.call();
        } else if (defaults.swipeLeft) defaults.swipeLeft.call();
        if (curY > startY) {
          if (defaults.swipeBottom) defaults.swipeBottom.call();
        } else if (defaults.swipeTop) defaults.swipeTop.call();
      }
      try {
        $(this).bind("touchstart", touchStart);
        $(this).bind("touchmove", touchMove);
        $(this).bind("touchend", touchEnd);
        $(this).bind("touchcancel", touchCancel);
      } catch (e) {}
    });
  };
})(jQuery);
jQuery.easing["jswing"] = jQuery.easing["swing"];
jQuery.extend(jQuery.easing, {
  def: "easeOutQuad",
  swing: function (x, t, b, c, d) {
    return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
  },
  easeInQuad: function (x, t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  easeOutQuad: function (x, t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  easeInOutQuad: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
    return (-c / 2) * (--t * (t - 2) - 1) + b;
  },
  easeInCubic: function (x, t, b, c, d) {
    return c * (t /= d) * t * t + b;
  },
  easeOutCubic: function (x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  easeInOutCubic: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
    return (c / 2) * ((t -= 2) * t * t + 2) + b;
  },
  easeInQuart: function (x, t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
  },
  easeOutQuart: function (x, t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
  easeInOutQuart: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b;
    return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
  },
  easeInQuint: function (x, t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  easeOutQuint: function (x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  easeInOutQuint: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b;
    return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
  },
  easeInSine: function (x, t, b, c, d) {
    return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
  },
  easeOutSine: function (x, t, b, c, d) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b;
  },
  easeInOutSine: function (x, t, b, c, d) {
    return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
  },
  easeInExpo: function (x, t, b, c, d) {
    return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  },
  easeOutExpo: function (x, t, b, c, d) {
    return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
  },
  easeInOutExpo: function (x, t, b, c, d) {
    if (t == 0) return b;
    if (t == d) return b + c;
    if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
    return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  easeInCirc: function (x, t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  easeOutCirc: function (x, t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  },
  easeInOutCirc: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
    return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  },
  easeInElastic: function (x, t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * 0.3;
    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
    return (
      -(
        a *
        Math.pow(2, 10 * (t -= 1)) *
        Math.sin(((t * d - s) * 2 * Math.PI) / p)
      ) + b
    );
  },
  easeOutElastic: function (x, t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * 0.3;
    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
    return (
      a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * 2 * Math.PI) / p) +
      c +
      b
    );
  },
  easeInOutElastic: function (x, t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d / 2) == 2) return b + c;
    if (!p) p = d * 0.3 * 1.5;
    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
    if (t < 1)
      return (
        -0.5 *
          a *
          Math.pow(2, 10 * (t -= 1)) *
          Math.sin(((t * d - s) * 2 * Math.PI) / p) +
        b
      );
    return (
      a *
        Math.pow(2, -10 * (t -= 1)) *
        Math.sin(((t * d - s) * 2 * Math.PI) / p) *
        0.5 +
      c +
      b
    );
  },
  easeInBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },
  easeOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
  easeInOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    if ((t /= d / 2) < 1)
      return (c / 2) * t * t * (((s *= 1.525) + 1) * t - s) + b;
    return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
  },
  easeInBounce: function (x, t, b, c, d) {
    return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
  },
  easeOutBounce: function (x, t, b, c, d) {
    if ((t /= d) < 1 / 2.75) return c * 7.5625 * t * t + b;
    else if (t < 2 / 2.75)
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
    else if (t < 2.5 / 2.75)
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
    else return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
  },
  easeInOutBounce: function (x, t, b, c, d) {
    if (t < d / 2)
      return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * 0.5 + b;
    return (
      jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
    );
  },
});
if (typeof amazingsliderObjects === "undefined")
  var amazingsliderObjects = new (function () {
    this.objects = [];
    this.addObject = function (obj) {
      this.objects.push(obj);
    };
  })();
if (typeof ASYouTubeIframeAPIReady === "undefined") {
  var ASYouTubeIframeAPIReady = false;
  var ASYouTubeTimeout = 0;
  function onYouTubeIframeAPIReady() {
    ASYouTubeIframeAPIReady = true;
  }
}
if (typeof amazingsliderId === "undefined") var amazingsliderId = 0;
