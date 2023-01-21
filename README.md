This is an express application that deals with user authentication management. The workflow of the application can be described as follows:

Signup endpoints:

The signup endpoint is built on post request. Users have to enter the following for the signup process:
name, mobile number, email, and password.
The data should be in the form of a JSON object.

After the successful signup process, A JSON toke will be sent along with data whether the signup is successful.

Test case:
{ "name":"anand kumar",
"email":"anandk@gmail.com",
"mobile":"4785123654",
"password":"abcd123@#",
}

Output:

{
"success": true,
"jwt_data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjNjYzBjOTA2ZjgyZTMyNjEwZjMyNjhlIiwibW9iaWxlIjoiNDc4NTEyMzY1NCIsImVtYWlsIjoiYW5hbmRrQGdtYWlsLmNvbSJ9LCJpYXQiOjE2NzQzMTY5NDR9.lDYTBlpHUoaZHKTKEWNODtpJfzvlSU2RJE_JlVH6DTg"
}

However, if the user already exists then the return value will be an error message which says that the user already exists.

On hitting the endpoint a second time, we will get the following message:

{
"success": false,
"error": "Sorry the user already exists"
}

Login endpoint:
This endpoint also uses the post request.
The endpoint accepts the email and the user's password as the parameters. They should be in JSON format.
If the user enters the correct password corresponding to the email, then a auth token will be sent containing the details such as id, mobile, email, etc.

Test case.

{
"email":"anandk@gmail.com",
"password":"abcd123@#",
}

Output:

{
"success": true,
"authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjNjYzBjOTA2ZjgyZTMyNjEwZjMyNjhlIiwiZW1haWwiOiJhbmFuZGtAZ21haWwuY29tIiwibW9iaWxlIjoiNDc4NTEyMzY1NCJ9LCJpYXQiOjE2NzQzMTc0MTN9.5Q1UE2KWIUYumn9ryZXJQLK4PzX0crIjacZrUduHqbA"
}

However, an error message will be displayed on entering the incorrect password.

{
"success": false,
"errors": []
}

Reset password:

The reset password also uses post request. The endpoint accepts the email, old password, and new password as the parameters. On entering the correct old password, the user can update the password, and a message containing the new password will be displayed in an encrypted format.

Test case:
{  
 "email":"anandk@gmail.com",,
"oldPassword":"abcd123@#",
"newPassword":"abcd123@#",
}

Output:

{
"message": "Password reset successfully and new password in hashed forrm is:$2a$10$.SRE6mklo6sjaT8ixnwfp.kP9YpiEQ4pzmQj3RDOr8wmiFJZ15vja"
}

However, if you enter an incorrect old password, then the following message will be shown:

{
"message": "Old password is incorrect."
}

update endpoint:

This endpoint uses the update request. The endpoint accepts name, email, mobile, etc. as the parameters. One can update the data. The data should be in the form of a JSON object.

Test case:

{ "name":"anand kumar",
"email":"anandk@gmail.com",
"mobile":"4785123657",
"password":"abcd12f3@#",
}

Output:

{
"message": "Data update successfully."
}

All the data are encrypted. The private and public keys are auto-generated and can be obtained by running the following commands:

var publicKey=key.exportKey('public');
var privateKey=key.exportKey('private');

