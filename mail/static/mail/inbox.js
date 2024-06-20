document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  //send email
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-detail-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //get mailbox
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => 
    //create div for each email
    emails.forEach(email => {
      const div = document.createElement('div');
      div.className = 'card-body';
      div.innerHTML = `
      <h6>Sender: ${email.sender}</h6>
      <h5>Subject: ${email.subject}</h5>
      <p>${email.timestamp}</p>`;

      //change background color, grey if read, red if not
      div.style.backgroundColor = email.read ? '#D3D3D3' : '#FFFFFF';

      // add listener and append to DOM
      div.addEventListener('click', () => {
        view_email(email.id);
      })
      document.querySelector('#emails-view').append(div);
    })
  )
}


function view_email(id) {

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail-view').style.display = 'block';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {

    //mark email as read
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        read: true
      })
    });

    //display email detail
    document.querySelector('#email-detail-view').innerHTML = `
      <p><b>From:</b>${email.sender}</p>
      <p><b>To:</b>${email.recipients}</p>
      <p><b>Subject:</b>${email.subject}</p>
      <p><b>Timestamp:</b>${email.timestamp}</p>
      <p>${email.body}</p>`;

    //reply
    const replyButton = document.createElement('button');
    replyButton.className = 'btn btn-sm btn-outline-primary'
    replyButton.innerHTML ='Reply';
    replyButton.addEventListener('click', () => reply_email(id));
    document.querySelector('#email-detail-view').append(replyButton);

    //archive
    const archiveButton = document.createElement('button');
    archiveButton.className = 'btn btn-sm btn-outline-primary'
    archiveButton.innerHTML = email.archived ? 'Unarchived' : 'Archive';
    archiveButton.addEventListener('click', () => archive_email(id, email.archived));
    document.querySelector('#email-detail-view').append(archiveButton);
  })
}


function reply_email(id) {
  compose_email();

  //get email
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector('#compose-recipients').value = email.sender;
    if (!email.subject.startsWith('RE: ')) {
      email.subject = 'RE: ' + email.subject;
    }
    document.querySelector('#compose-subject').value = email.subject;
    document.querySelector('#compose-body').value = `On ${email.timestamp}, ${email.sender} wrote: ${email.body}`;
  });
}

//archive email
function archive_email(id, state) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: !state
    })
  })
  .then(() => {
    load_mailbox('archive');
  });
}


//send email
function send_email(event) {
  event.preventDefault();

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);
    load_mailbox('sent');
  });
}