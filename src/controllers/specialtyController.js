import specialtyService from '../services/specialtyService'

let createSpecialty = async(req, res) => {
    try{
        let infor = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(infor);
    }catch(e) {
        console.log(e);
        res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getAllSpecialty = async(req, res) => {
      try{
        let infor = await specialtyService.getAllSpecialty();
        return res.status(200).json(infor);
    }catch(e) {
        console.log(e);
        res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty
}