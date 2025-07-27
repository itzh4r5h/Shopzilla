# Backend TODOS

## Product
#### Creation
- Product image upload to imagekit.io when product is created
#### Deletion
- Product image delete from imagekit while deleting the product
#### Updation
- if admin removed the previous images of product while updating and also adds new one then delete the images in imagekit.io

## User
#### Deletion
- User image delete from imagekit while deleteing user or updating new profile pic
#### Creation
- add cron job for user deletion if user email not verified under specified time after user is created
- if user signin/signup with google , add a route to add password is isGoogleUser is true