function submit(e) {
  e.preventDefault();
  var form = $(this);
  var formData;
  if (window.FormData) {
    formData = new FormData(form[0]);
  }
  console.log(formData, e, form[0]);
  let edit = formData.get('id');
  
  $.ajax({
    url: '/api/events/' +(!! edit ? edit: ''),
    method: !!edit ? 'PUT' : 'POST',
    data: formData ? formData : form.serialize(),
    cache: false,
    contentType: false,
    processData: false,
    success: () =>{
      location.reload();
    }
  });

  return false;
}
$('form').on('submit', submit);
function deleteEvent(i) {
  console.log(i)
  if (i) {
    $.ajax({
      url: '/api/events/' +i,
      method: 'DELETE' ,
      cache: false,
      contentType: false,
      processData: false,
      success: () =>{
        location.reload();
      }
    });
  }
}