import Platform from "../models/Platform.js";
import Travel from "../models/Travel.js";

const getPlatforms = async (req, res) => {
  // const platform = await Platform.findById(id).populate({
  //   path: "travels",
  //   populate: { path: "vehicle", select: "patent consume" },
  // });
  const platforms = await Platform.find()
    .populate({
      path: "travels",
      select: "km netFare promotions tips priceLiter",
      populate: { path: "vehicle", select: "consume" },
    })
    .where("user")
    .equals(req.user);
  res.json(platforms);
};

const newPlatform = async (req, res) => {
  const { name } = req.body;

  // const platformExist = await Platform.findOne({ name });
  // if (platformExist) {
  //   const error = new Error("There is already a platform with this name");
  //   return res.status(404).json({ msg: error.message });
  // }

  // Compruebo que ingrese el nombre
  if (!name) {
    const error = new Error("The name is obligatory");
    return res.status(400).json({ msg: error.message });
  }

  // Guardo la plataforma
  const platform = new Platform(req.body);
  platform.user = req.user._id;
  try {
    const platformStored = await platform.save();
    res.json(platformStored);
  } catch (error) {
    console.log(error);
  }
};

const getPlatform = async (req, res) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const platform = await Platform.findById(id).populate({
    path: "travels",
    populate: { path: "vehicle", select: "patent consume" },
  });

  if (!platform) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que la plataforma pertenezca al usuario logueado
  if (platform.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  // Obtener los travels de la platform
  // const travels = await Travel.find().where("platform").equals(platform._id);
  res.json(platform);
};
const editPlatform = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  // Verifico la longitud del id
  // if (id.length !== 24) {
  //   const error = new Error("Not found Id");
  //   return res.status(404).json({ msg: error.message });
  // }

  const platform = await Platform.findById(id);
  // const platformExist = await Platform.findOne({ name });

  // Compruebo que exista la platform
  if (!platform) {
    const error = new Error("Not found platform");
    return res.status(404).json({ msg: error.message });
  }

  // Compruebo que ya no haya una plataforma con ese nombre
  // if (platformExist?.name) {
  //   const error = new Error("There is already a platform with this name");
  //   return res.status(404).json({ msg: error.message });
  // }

  // Verifico que la plataforma pertenezca al usuario logueado
  if (platform.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  platform.name = req.body.name || platform.name;

  try {
    const platformStored = await platform.save();
    res.json(platformStored);
  } catch (error) {
    console.log(error);
  }
};
const deletePlatform = async (req, res) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const platform = await Platform.findById(id);

  // Compruebo que exista la platform
  if (!platform) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que la plataforma pertenezca al usuario logueado
  if (platform.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  try {
    await platform.deleteOne();
    res.json({ msg: "Platform successfully eliminated" });
  } catch (error) {
    console.log(error);
  }
};

export { getPlatforms, newPlatform, getPlatform, editPlatform, deletePlatform };
