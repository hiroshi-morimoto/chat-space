$(function(){ 
  function buildHTML(message){
    if ( message.image ) {
      var html =
         `<div class="main_chat__message--list" data-message-id=${message.id}>
            <div class="main_chat__message--list--name">
              ${message.user_name}
              <div class="main_chat__message--list--name--date">
                ${message.created_at}
              </div>
            </div>
            <div class="main_chat__message--list--messages">
                <p class="lower-message__content">
                  ${message.content}
                </p>
            </div> 
          </div>
            <img src=${message.image} >`
      return html;
    } else {
      var html =
         `<div class="main_chat__message--list" data-message-id=${message.id}>
            <div class="main_chat__message--list--name">
              ${message.user_name}
              <div class="main_chat__message--list--name--date">
                ${message.created_at}
              </div>
            </div>
            <div class="main_chat__message--list--messages">
              <p class="lower-message__content">
                ${message.content}
              </p>
            </div>
          </div>`
      return html;
    };
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
      .done(function(date){
        var html = buildHTML(date);
        $('.main_chat__message').append(html);
        $('.main_chat__message').animate({ scrollTop: $('.main_chat__message')[0].scrollHeight});
        $('.form__submit').prop('disabled', false);
        $('form')[0].reset();
      })

      .fail(function() {
        alert("メッセージ送信に失敗しました");
        $('.form__submit').prop('disabled', false);
    });
   
  })
  var reloadMessages = function() {
    var last_message_id = $('.main_chat__message--list:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.main_chat__message').append(insertHTML);
        $('.main_chat__message').animate({ scrollTop: $('.main_chat__message')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});