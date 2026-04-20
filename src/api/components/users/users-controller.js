const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { hashPassword } = require('../../../utils/password');

//Register
async function register(req, res, next) {
  try {
    const{
      username,
      email,
      password,
      fullName,
    } = req.body;

    //email harus terisi
    if(!email){
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'Email is required');
    }

    //fullname harus terisi
     if (!fullName) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Full name is required'
      );
    }

    // Email must be unique
    if (await usersService.emailExists(email)) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already exists'
      );
    }

    // The password is at least 8 characters long
    if (password.length < 8) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Password must be at least 8 characters long'
      );
    }

    // Hash the password before saving it to the database
    const hashedPassword = await hashPassword(password);

    // Create the user
    const success = await usersService.createUser(
      username,
      email,
      hashedPassword,
      fullName
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    return next(error);
  }
}

//login
async function login (req, res, next) {
  try {
    const { 
      email, 
      password,
    } = req.body;

    const loginResult = await usersService.checkLogin(email, password);

    if (!loginResult) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or passwod'
      );
    }
    return res.status(200).json(loginResult);
  } catch (error) {
    return next(error);
  }
}

async function getProfile (req, res, next) {
  try {
    const user = await usersService.getProfile(req.user.id);

    if (!user) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY, 'User not found'
      );
    }
    
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}


async function history (req, res, next) {
  try {
    // req.user.id didapat dari middleware auth
    const historyData = await usersService.getHistory(req.user.id);

    //penambahan
    if(!historyData) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY, 'history not available'
      )
    }

    return res.status(200).json(historyData);
  } catch (error) {
    return next(error)
  } 
};

async function edit (req, res) {
  try {
    const update = await usersService.editUser(req.user.id, req.body);
    res.json({ message: 'Profil berhasil diupdate', data: update });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function changePassword (req, res) {
  try {
    const { passwordBaru } = req.body;
    await usersService.updatePassword(req.user.id, passwordBaru);
    res.json({ message: 'Nicee password kamu telah diganti' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// ... isi fungsi-fungsi kamu (register, login, dll) ...

// PASTIKAN INI ADA DI PALING BAWAH FILE
module.exports = {
  register,
  login,
  getProfile,
  edit,
  changePassword,
  history
};