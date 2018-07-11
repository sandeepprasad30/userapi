import { IUser, model as User } from "../models/user.model";

class Users {

    public getUser = async (req, res) => {
        try {
            const username = req.params.username;
            const user = await User.findOne({ UserName: username }).exec();
            res.status(200).jsonp({ status:'success', result: user });
        } catch (err) {
            /* istanbul ignore next */
            res.status(400).json(err);
        }
    }

}

export default new Users();
