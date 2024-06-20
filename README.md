# CS50's Web Programming with Python and JavaScript

# Project 3 - Mail
[Project Description](https://cs50.harvard.edu/web/2020/projects/3/mail/)

## Overview
This project is a single-page application for an email client. The application features a front-end interface that communicates with backend APIs to send and receive emails.

## Features
- **Send Mail**
   - Users can compose and send emails.
   - On successful sending, the user is redirected to their Sent mailbox.

- **Mailbox Views**
   - Users can view their **Inbox**, **Sent**, and **Archived** emails.
   - Each email is displayed in a box showing the sender, subject, and timestamp.
   - Read emails are displayed with a gray background, while unread emails are displayed with a red background.

- **View Email**
   - Users can click on an email to view its full content.
   - The email's sender, recipients, subject, timestamp, and body are displayed.

- **Archive and Unarchive**
   - Users can archive and unarchive emails.
   - Archived emails can be moved back to the Inbox and vice versa.

- **Reply**
   - Users can reply to emails.
   - The reply form is pre-filled with the original sender as the recipient, and the original email's content is included in the body.

 ## Requirements
  - Python 3.x
  - Django

## How to Run
1. **Clone the Repository**
      ```
      git clone https://github.com/sashalai64/cs50web-mail.git
      ```
      
2. Apply migrations:
    ```
    python manage.py makemigrations mail
    ```
    ```
    python manage.py migrate
    ```
   
3. **Run the Server**
      ```
      python manage.py runserver
      ```
4. **Access the Application**
   
     Visit `http://127.0.0.1:8000/` in your browser.
