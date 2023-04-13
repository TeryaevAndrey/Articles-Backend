import UserModel from "../models/UserModel.js";
import {Request, Response} from "express";

class ProfileController {
    editProfile = async(req: Request, res: Response) => {
        try {
            const {email, userName, password, passwordRepeat}: {
                email?: string;
                userName?: string;
                password?: string;
                passwordRepeat?: string;
            } = req.body;

            const avatar = req.file;

            
        } catch(err) {
            return res.status(500).json({message: "Ошибка сервера"});
        }
    }
}

export default ProfileController;