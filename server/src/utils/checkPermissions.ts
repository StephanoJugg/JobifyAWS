import { UnauthenticatedError } from "../errors";

interface RequestUser {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}

export const checkPermissions = (requestUser: RequestUser, resourceUserId: String) => {
    if(requestUser.userId === resourceUserId){
        return 
    }

    throw new UnauthenticatedError("You are not authorized to perform this action");
};