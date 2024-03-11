# Backend Assignment for **Lean Platform Technologies**

## **Neel Sheth | neel.s2@ahduni.edu.in | [LinkedIn](https://www.linkedin.com/in/neel-sheth-4779641bb/)**
### **API Endpoints**

Use command: **<ins>npm run dev</ins>** to start your local server

Home Page: "localhost:{port}/" [GET]

-------------------------------------------------------------------------------------------------------------------------------------------
#### **Users**
##### Base URL: localhost:{port}/api/v1/users
  1.  Register User: "/register" [POST]
  2.  Login User: "/login" [POST]
  3.  Logout User: "/logout" [POST]
  4.  Rate Mentor: "/rateMentor" [POST]
  5.  Review Mentor: "/reviewMentor" [POST]
  6.  Get Mentor Details: "/getMentorDetails" [GET]
  7.  Get Recommendation: "/getRecommendation" [GET]
-------------------------------------------------------------------------------------------------------------------------------------------
#### **Mentors**
##### Base URL: localhost:{port}/api/v1/mentors
  1.  Register Mentor: "/register" [POST]
  2.  Login Mentor: "/login" [POST]
  3.  Logout Mentor: "/logout" [POST]
  4.  Recommend Student: "/recommendStudent" [POST]

-------------------------------------------------------------------------------------------------------------------------------------------

##### All functionalities of Users and Mentors except Register and Login are authenticated with JSON Web Token (JWT)
