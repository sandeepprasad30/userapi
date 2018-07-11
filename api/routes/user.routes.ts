import User from "../controllers/user.controllers";

export = (app) => {

    const endpoint = process.env.API_BASE + "users";

    /**
    * @api {get} /api/v1/users/getuser/:username Retrieve user
    * @apiVersion 1.0.0
    * @apiName getuser
    * @apiGroup User
    * @apiPermission authenticated user
    *
    * @apiExample {js} Example usage:
    * $http.defaults.headers.common["username"] = username;
    * $http.get(url)
    *   .success((res, status) => doSomethingHere())
    *   .error((err, status) => doSomethingHere());
    *
    * @apiSuccess {String} _id The user id
    * @apiSuccess {String} UserName The username of the user
    * @apiSuccess {String} Firstname The Firstname
    * @apiSuccess {String} Lastname The Lastname
    * @apiSuccess {String} Fullname The Fullname
    * @apiSuccess {String} EmailAddress The EmailAddress
    * @apiSuccess {String} Country The Country
    * @apiSuccess {String} EmployeeType The EmployeeType
    * @apiSuccess {Array} Permissions Permissions
    * @apiSuccess {String} Organization The Organization
    * @apiSuccess {String} Status The Status
    *
    * @apiSuccessExample {json} Success response:
    *     HTTPS 200 OK
    *     {
    *    "status": "success",
    *    "result": {
    *        "_id": "5b45439354b39c50b81aac59",
    *        "updatedAt": "2018-07-10T23:38:59.158Z",
    *        "createdAt": "2018-07-10T23:38:59.158Z",
    *        "FirstName": "Abhishek",
    *        "LastName": "Nigam",
    *        "FullName": "Abhishek Nigam",
    *        "UserName": "abnigam",
    *        "EmailAddress": "abnigam@cisco.com",
    *        "Country": "UNITED STATES",
    *        "EmployeeType": "Vendor",
    *        "__v": 0,
    *        "Permissions": [],
    *        "Organization": "",
    *        "Status": "ACTIVE"
    *    }
    *}
    *
    * @apiUse UnauthorizedError
    */
    app.get(endpoint+ "/getuser/:username", User.getUser);


};
