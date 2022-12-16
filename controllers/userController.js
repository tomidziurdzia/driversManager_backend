import User from "../models/User.js";
import generateId from "../helpers/generateId.js";
import generateJWT from "../helpers/generateJWT.js";
import { emailForgetPassword, emailRegister } from "../helpers/email.js";

const register = async (req, res) => {
  // Prevenir usuarios duplicados
  const { email } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    const error = new Error("User already registered");
    return res.status(400).json({ msg: error.message });
  }

  // Registro nuevo usuario
  try {
    const user = new User(req.body);
    // Genero token unico para confirmar usuario
    user.token = generateId();

    // Almaceno el usuario creado
    await user.save();

    // Envio mail de registro
    emailRegister({
      name: user.name,
      surname: user.surname,
      email: user.email,
      token: user.token,
    });
    res.json({ msg: "User successfully created, check your email" });
  } catch (error) {
    console.log(error);
  }
};

const authenticate = async (req, res) => {
  const { email, password } = req.body;

  // Comprobar si el usuario existe
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User does not exist");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar si el usuario esta confirmado
  if (!user.confirmed) {
    const error = new Error("Your account has not been confirmed");
    return res.status(403).json({ msg: error.message });
  }

  // Comprobar password
  if (await user.checkPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      token: generateJWT(user._id),
    });
  } else {
    const error = new Error("The password is incorrect");
    return res.status(403).json({ msg: error.message });
  }
};

// Confirmar token de un solo uso para confirmar la cuenta
const confirm = async (req, res) => {
  const { token } = req.params;
  const userConfirm = await User.findOne({ token });

  if (!userConfirm) {
    const error = new Error("Invalid token");
    return res.status(403).json({ msg: error.message });
  }

  try {
    userConfirm.confirmed = true;
    userConfirm.token = "";
    await userConfirm.save();
    res.json({ msg: "User successfully confirmed" });
  } catch (error) {
    console.log(error);
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  // Comprobar si el usuario existe
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User does not exist");
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.token = generateId();
    await user.save();

    // Enviar email con instrucciones
    emailForgetPassword({
      name: user.name,
      surname: user.surname,
      email: user.email,
      token: user.token,
    });

    res.json({ msg: "We have sent an email with instructions" });
  } catch (error) {
    console.log(error);
  }
};

const checkToken = async (req, res) => {
  const { token } = req.params;

  // Comprobar si el token existe
  const validToken = await User.findOne({ token });

  if (validToken) {
    res.json({ msg: "Token valid, user exists" });
  } else {
    const error = new Error("Invalid token");
    return res.status(404).json({ msg: error.message });
  }
};

const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });
  if (user) {
    user.password = password;
    user.token = "";

    try {
      await user.save();
      res.json({ msg: "Password successfully modified" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Invalid token");
    return res.status(403).json({ msg: error.message });
  }
};

const perfil = async (req, res) => {
  const { user } = req;
  user.token = generateJWT(user._id);
  res.json(user);
};

export {
  register,
  authenticate,
  confirm,
  forgetPassword,
  checkToken,
  newPassword,
  perfil,
};
