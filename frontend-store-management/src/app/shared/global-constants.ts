export class GlobalConstant{
    //message
    public static genericError:string ="Something went wrong, please try again later";
    public static unauthorized:string ="your are not authorized person to acces this page";
    public static productExistError:string ="Product already exist";
    public static productAdded:string ="Product added Successfully";
    
    //expressions regulieres
    public static nameRegex:string = "[a-zA-Z0-9 ]*";

    public static emailRegex:string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

    public static contactNumberRegex:string = "^[e0-9]{10,10}$";


    //variables
    public static error:string ="error";

}