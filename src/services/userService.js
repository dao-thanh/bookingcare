import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async(resolve, reject) => {
        let userData = {};
        try{
            let isExist = await checkUserEmail(email);
            if(isExist){
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: {email: email},
                    raw: true
                });
                if(user) {
                    let check  = await bcrypt.compareSync(password, user.password)
                    if(check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        delete user.password;
                        userData.user = user;
                    }else{
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                }else{
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`;
                }
                resolve(userData);
            }else{
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in your system. Plz try other email!`
                resolve(userData)
            }
        }catch(e){
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async(resolve, reject) => {
        try{
            let user = await db.User.findOne({
                where: {email: userEmail}
            })
            if(user) {
                resolve(true);
            }else{
                resolve(false);
            }
        }catch(e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async(resolve, reject) => {
        try{
            let users = '';
            if(userId === 'ALL') {
                users = db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                });
            }
            if(userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);
        }catch(e){
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
        try{
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        }catch(e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async(resolve, reject) => {
        try{
            let check = await checkUserEmail(data.email);
            if(check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email already exists, please try another email!'
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstname,
                    lastName: data.lastname,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId
                })
                resolve({
                    errCode: 0,
                    message: 'OK'
                });
            }
        }catch(e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async(resolve, reject) => {
      let user = await db.User.findOne({
          where: {id: userId}
      });
      if(!user) {
        resolve({
            errCode: 2,
            errMessage: `The user isn't exist`
        });
      }
      await db.User.destroy({
          where: {id: userId}
      });
      resolve({
          errCode: 0,
          message: `The user is deleted`
      })
    })
}

let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try{
            if(!data.id || !data.roleId || !data.positionId || !data.gender){
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters!'
                })
            }
            let user = await db.User.findOne({
                where: {id: data.id},
                raw: false
            })
            if(user) {
                user.firstName = data.firstname;
                user.lastName = data.lastname;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phonenumber = data.phonenumber;
                await user.save();

                // await db.User.save({
                //     firstName :  data.firstname,
                //     lastName : data.lastname,
                //     address : data.address
                // })
                resolve({
                    errCode: 0,
                    message: `Update the user succeeds!`
                });
            }else {;
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!`
                });
            }
        }catch(e){
            reject(e);
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async(resolve, reject) => {
        try{
            if(!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising required parameters !'
                })
            }else{
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: {
                        type: typeInput
                    }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
           

           
        }catch(e){
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService
}