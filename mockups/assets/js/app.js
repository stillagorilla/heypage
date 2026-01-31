/*
MOST OF THIS .JS IS FOR INTERACTION DEMOS, 
as client insisted to "try" the interactions ... 
*/
//JQuery Module Pattern
"use strict";

// An object literal
const app = {
  init() {
    app.functionOne();
  },
  functionOne() {},
};

$("document").ready(() => {
  app.init();
});

$("body").on("click", "#sideNavToggle", function () {
  $("#sideNav").toggleClass("open");
});

includeHTML();

//show reply
$("body").on("click", ".toggleReply", function () {
  $(this).closest(".media-body").children(".showReply").slideToggle(200);
  //toggle show/hide text
  $(this).text( $(this).text() == 'Show 2 replies' ? "Hide replies" : "Show 2 replies");
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

//ADD reaction
$("body").on("mouseover, click", ".addReaction:not(.has-popover)", function () {
  $(this).append(
    '<div class="popover fade bs-popover-top show" role="tooltip" x-placement="top" style="position: absolute; top: -5.5rem; left: 0.5rem; right: auto; width: 300px; max-width:300px;"><h3 class="popover-header">Add Reaction</h3><div class="popover-body"><button class="btn btn-ghost"><img src="assets/img/emojis/emoji1.png" alt=""></button><button class="btn btn-ghost"><img src="assets/img/emojis/emoji2.png" alt=""></button><button class="btn btn-ghost"><img src="assets/img/emojis/emoji3.png" alt=""></button><button class="btn btn-ghost"><img src="assets/img/emojis/emoji4.png" alt=""></button><button class="btn btn-ghost"><img src="assets/img/emojis/emoji5.png" alt=""></button><button class="btn btn-ghost"><img src="assets/img/emojis/emoji1.png" alt=""></button></div></div>'
  );
  $(this).addClass("has-popover");
});

//Share post
$("body").on("click", ".shareLink:not(.has-popover)", function () {
  $(this).append(
    '<div class="popover fade bs-popover-top show" role="tooltip" x-placement="top" style="position: absolute; top: -5.25rem; left: 0.5rem; width: 280px;"><h3 class="popover-header">Share</h3><div class="popover-body"><a role="button" class="btn btn-sm btn-secondary mr-2">Share to my Feed</a><a role="button" class="btn btn-sm btn-light">Copy Link</a></div></div>'
  );
  $(this).addClass("has-popover");
});

$("body").on("mouseleave click", ".has-popover", function () {
  $(this).removeClass("has-popover").children(".popover").remove();
});

$("body").on("click", "body", function () {
  $("html").find(".has-popover").children(".popover").remove();
  $("html").find(".has-popover").removeClass("has-popover");
});

$("body").on("click", ".popover", function () {
  $(this).closest(".has-popover").removeClass("has-popover");
  $(this).remove();
});

$("body").on("click", ".addEmoji:not(.has-popover)", function () {
  $(this).after(
    '<div class="popover fade bs-popover-top show" role="tooltip" x-placement="top" style="position: absolute; top: -5.5rem; left: initial; right: 0; width: 300px;"><div class="arrow" style="bottom: -8px; right: 1rem;" ></div><h3 class="popover-header">Add Emojis</h3><div class="popover-body">Emojis here</div></div>'
  );
  $(this).addClass("has-popover");
});

//edit post
$("body").on("click", "#editPost", function () { 
  //get post content
  var postWraper = $(this).parents(".card-body").find(".postContent");
  var postContent = postWraper.html();
  //generate makePost form
  postWraper.empty().append('<form id="makePost"><div class="form-row pr-1"><textarea class="form-control mb-2 border-0 my-comment" placeholder="" spellcheck="false">' + postContent + '</textarea></div> <div class="form-row align-items-center"><div class="col"> <a role="button" class="ml-2 mr-3" data-toggle="modal" data-target="#uploadImgModal"><i class="fa fa-image text-secondary"></i></a> <a role="button" class="mr-3 "><i class="fa fa-smile text-secondary"></i></a> </div><div class="col-auto"> <select class="form-control"><option selected="selected">Everyone</option> <option>Friends</option><option>Private</option></select></div><div class="col-auto"><button class="btn btn-ghost mr-3">Cancel</button><button type="submit" class="btn btn-primary">Save Edit</button></div></div></form>');

  

});
//loads reply form in comments
$("body").on("click", ".addReply:not(.has-reply-form)", function () {
  $(this)
    .parent()
    .after(
      '<div class="media"><img src="assets/img/users/user5.jpg" class="user-img" /> <div class="media-body"><form><div class="input-group response-group position-relative"><textarea  class="form-control" placeholder="Leave a comment" aria-label="Leave a comment" aria-describedby=""></textarea><div class="d-flex flex-column"><span><button class="btn px-1" type="button"><i class="fa fa-image"></i></button><button class="btn px-2 addEmoji" type="button"><i class="fa fa-smile"></i></button></span><span class="p-2"><button type="submit" class="btn btn-sm btn-secondary btn-block">Post</button></span></div></div></form></div></div>'
    );
  $(this).addClass("has-reply-form");
});

$("body").on("click", ".has-reply-form", function () {
  $(this).parent().next(".media").remove();
  $(this).removeClass("has-reply-form");
});

//Voting Buttons imitation :)
$(".voteResults:not(.voted)").hide();

$("body").on("click", ".voteBtns .btn:not(.disabled)", function () {
  $(this).closest(".card").find(".voteName").html("Voted.");
  $(".voteBtns .btn").addClass("disabled");
  $(this).addClass("btn-secondary").removeClass("btn-outline-secondary");
  $(this).closest(".row").next(".voteResults").slideDown();
});

//voting stars
$(function () {
  var star = ".voting-star-btns .btn",
    selected = ".selected";
  $(star).on("click", function () {
    $(selected).each(function () {
      $(this).removeClass("selected");
    });
    $(this).addClass("selected");
  });
});

//show more content
$(".showHidden").click(function () {
  $(this).next(".hidden-content").fadeIn(1500);
  $(this).hide();
});

//prevent notifications dropdown to close on click inside
$(document).on("click", ".notify-drop.dropdown-menu", function (e) {
  e.stopPropagation();
});

//emoji add response
$("body").on("click", ".btn-emoji-response:not(.voted)", function () {
  var a = 1 + parseInt($(this).find("span").text());
  $(this).find("span").html(a);
  $(this).addClass("voted");
});

//emoji remove response
$("body").on("click", ".btn-emoji-response.voted", function () {
  var a = -1 + parseInt($(this).find("span").text());
  $(this).find("span").html(a);
  $(this).removeClass("voted");
});

//searchbox in navbar
$("body").on("focus", "#searchBox", function () {
  $(".searchResults").fadeIn(300);
});
$("body").on("blur", "#searchBox", function () {
  $(".searchResults").fadeOut(300);
});



$("body").on("click", "#liveToastBtn", function () {
  $(".toast").toast("show");
});

//Show hide "post" button when typing and if there is text
$(".response-group .form-control").click(function () {
  $(this).closest(".response-group").find(".p-2").addClass("d-block");
});
$(".response-group .form-control").blur(function () {
  if (!$(this).val()) {
    $(this).closest(".response-group").find(".p-2").removeClass("d-block");
  }
});

//chat sidebar
$("#toggle-chat-sidebar").click(function () {
  $("#chat-sidebar").toggleClass("open");
  $("main").addClass("shade");
});
$("#chat-side-close").click(function () {
  $("#chat-sidebar").removeClass("open");
  $("main").removeClass("shade");
});

//image gallery modal
$(".gallery-img").Am2_SimpleSlider();

$("body").on("click",".gallery-img",function(){
  //copy author to modal
  var myAuthorBox = $(this).closest('.card-body').find('.media');
  $(myAuthorBox).clone().appendTo(".product-information").first().addClass('mb-3');
});

// sticky sidebar 
var lastScrollTop = 0;

$(window).scroll(function (event) {

  var stickyBar = $("#sticky-side");
  var real_start = $('#main-content').offset().top;

  var element_height = stickyBar.outerHeight();
  var top_of_element = stickyBar.offset().top; //px where sideBar starts
  var bottom_of_element = stickyBar.offset().top + element_height; //where sideBar ends
  var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
  var top_of_screen = $(window).scrollTop();

  var st = $(this).scrollTop();
  if (st > lastScrollTop) {
    // downscrooll code
    if (element_height < $(window).innerHeight()) {
      $("#sticky-side").addClass('stickTop');
    }
    else if (bottom_of_screen > bottom_of_element) {
      $("#sticky-side").addClass('stickBottom');
    }
    
  } else {
    // upscroll code
    if (top_of_element < real_start) { 
      $("#sticky-side").removeClass("stickBottom");
    }
  }
  lastScrollTop = st;
});


//styled select box
$(".select2").select2({ theme: "bootstrap4" });

