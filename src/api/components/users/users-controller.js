const usersService = require("./users-service");
const { errorResponder, errorTypes } = require("../../../core/errors");
const { hashPassword, passwordMatched } = require("../../../utils/password");

async function register(request, response, next) {
  try {
    const { username, email, password, fullName } = request.body;

    if (!email) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR, 
        "Email is required");
    }

    if (!fullName) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        "Full name is required",
      );
    }

    if (await usersService.emailExists(email)) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        "Email already exists",
      );
    }

    if (password.length < 8) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        "Password must be at least 8 characters long",
      );
    }

    const hashedPassword = await hashPassword(password);
    const success = await usersService.createUser(
      username,
      email,
      hashedPassword,
      fullName,
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        "Failed to create user",
      );
    }

    return response.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return next(error);
  }
}

async function login(request, response, next) {
  try {
    const { 
      email, 
      password 
    } = request.body;

    const loginResult = await usersService.checkLogin(email, password);

    if (!loginResult) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        "Wrong email or password",
      );
    }

    return response.status(200).json(loginResult);
  } catch (error) {
    return next(error);
  }
}

async function getProfile(request, response, next) {
  try {
    const user = await usersService.getProfile(request.user.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, "User not found");
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

async function edit(request, response, next) {
  try {
    const { username, fullName } = request.body;

    if (!username || !fullName) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        "Username and Full Name are required",
      );
    }

    const updateResult = await usersService.editUser(request.user.id, {
      username,
      fullName,
    });

    if (!updateResult) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        "Failed to update profile",
      );
    }

    return response.status(200).json({
      message: "Profil berhasil diupdate",
      data: updateResult,
    });
  } catch (error) {
    return next(error);
  }
}

async function changePassword(request, response, next) {
  try {
    const { 
      oldPassword, 
      newPassword 
    } = request.body;
    const user = await usersService.getProfile(request.user.id);

    const isMatch = await passwordMatched(oldPassword, user.password);
    if (!isMatch) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        "Old password does not match",
      );
    }

    const success = await usersService.updatePassword(
      request.user.id,
      newPassword,
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        "Failed to change password",
      );
    }

    return response.status(200).json({ message: "Nicee password kamu telah diganti" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  getProfile,
  edit,
  changePassword,
};
