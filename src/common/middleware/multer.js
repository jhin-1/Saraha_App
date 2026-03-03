import multer from "multer";
import fs from 'fs';
export let multer_local = ({customPath}={customPath:"general"})=>{
    let storage = multer.diskStorage({
        destination:function(req,file,cd){
            let path = `uploads/${customPath}`

            if(!fs.existsSync(path)){
                fs.mkdirSync(path,{recursive:ture})
            }
            cd(null, path)

        }
        ,
        filename:function(req,file,cb){
            let perfix = Data.now()
            console.log(file)


            let name = perfix +"-"+file.originalname
            cd(null,name)
        }
    })
    return multer({storage})
}