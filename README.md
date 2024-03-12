# Backend Assignment for **Lean Platform Technologies**

## **Neel Sheth | neel.s2@ahduni.edu.in | [LinkedIn](https://www.linkedin.com/in/neel-sheth-4779641bb/)**

Use commands: <br>
**<ins>npm install</ins>** to install all the dependencies <br>
**<ins>npm run dev</ins>** to start your local server

-------------------------------------------------------------------------------------------------------------------------------------------
### **API Endpoints**

Home Page: "localhost:{port}/" [GET]

#### **Users**
##### Base URL: localhost:{port}/api/v1/users
  1.  Register User: "/register" [POST] -> send name, email, password in req.body
  2.  Login User: "/login" [POST] -> send email, password in req.body
  3.  Logout User: "/logout" [POST] -> send email in req.body
  4.  Rate Mentor: "/rateMentor" [POST] -> send mentorId, userId, rating in req.body
  5.  Review Mentor: "/reviewMentor" [POST] -> send mentorId, userId, review in req.body
  6.  Get Mentor Details: "/getMentorDetails" [GET] -> send rating in req.body
  7.  Get Recommendation: "/getRecommendation" [GET] -> send generated recommendation link in req.body

#### **Mentors**
##### Base URL: localhost:{port}/api/v1/mentors
  1.  Register Mentor: "/register" [POST] -> send name, email, password in req.body
  2.  Login Mentor: "/login" [POST] -> send email, password in req.body
  3.  Logout Mentor: "/logout" [POST] -> send email in req.body
  4.  Recommend Student: "/recommendStudent" [POST] -> send mentorId, studentId, review in req.body

-------------------------------------------------------------------------------------------------------------------------------------------

##### All functionalities of Users and Mentors except Register and Login are authenticated with JSON Web Token (JWT)
