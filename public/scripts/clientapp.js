$(document).ready(function() {
  $('#submit-button').on('click', postData);
});

function postData() {
  event.preventDefault();

  var values = {};
  $.each($('#sql-form').serializeArray(), function(i, field) {
    values[field.name] = field.value;
  });

  console.log(values);

  $.ajax({
    type: 'POST',
    url: '/people',
    data: values,
    success: function(data) {
      if (data) {
        // everything went ok
        console.log('from server:', data);
        getData();

      } else {
        console.log('error');
      }
    }
  });

}

function getData() {
  $.ajax({
    type: 'GET',
    url: '/people',
    success: function(data) {
      console.log(data);
      appendDom(data);
    }
  });
}

function appendDom(data) {
  var $el;
  for (var i = 0; i < data.length; i++) {
    $('.data').append('<div class="person"></div>');
    $el = $('.data').children().last();
    $el.append('<h4> name: ' + data[i].name + '</h4>');
    $el.append('<h4> Address: ' + data[i].address + '</h4>');
    $el.append('<h4> City: ' + data[i].city + '</h4>');
    $el.append('<h4> State: ' + data[i].state + '</h4>');
    $el.append('<h4> Zipcode: ' + data[i].zip_code + '</h4>');

  }
}
