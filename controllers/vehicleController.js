import Vehicle from "../models/Vehicle.js";

const getVehicles = async (req, res) => {
  const vehicles = await Vehicle.find()
    .populate({ path: "travels", select: "km" })
    .where("user")
    .equals(req.user);
  res.json(vehicles);
};

const newVehicle = async (req, res) => {
  const { patent, typeVehicle } = req.body;

  // const patentExist = await Vehicle.findOne({ patent });
  // if (patentExist) {
  //   const error = new Error("There is already a vehicle with this patent");
  //   return res.status(404).json({ msg: error.message });
  // }

  // Compruebo que se ingrese el tipo de vehiculo
  if (!typeVehicle) {
    const error = new Error("The type of vehicle is obligatory");
    return res.status(400).json({ msg: error.message });
  }

  // Compruebo que se ingrese la patente
  if (!patent) {
    const error = new Error("The patent is obligatory");
    return res.status(400).json({ msg: error.message });
  }

  // Guardo el vehiculo
  const vehicle = new Vehicle(req.body);
  vehicle.user = req.user._id;
  try {
    const vehicleStored = await vehicle.save();
    res.json(vehicleStored);
  } catch (error) {
    console.log(error);
  }
};

const getVehicle = async (req, res) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const vehicle = await Vehicle.findById(id);

  // Comprubo que exista el vehiculo
  if (!vehicle) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que el vehiculo pertenezca al usuario logueado
  if (vehicle.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  res.json(vehicle);
};

const editVehicle = async (req, res) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const vehicle = await Vehicle.findById(id);

  // Comprubo que exista el vehiculo
  if (!vehicle) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que el vehiculo pertenezca al usuario logueado
  if (vehicle.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  vehicle.patent = req.body.patent || vehicle.patent;
  vehicle.model = req.body.model || vehicle.model;
  vehicle.typeVehicle = req.body.typeVehicle || vehicle.typeVehicle;
  vehicle.rego = req.body.rego || vehicle.rego;
  vehicle.consume = req.body.consume || vehicle.consume;
  vehicle.insurance = req.body.insurance || vehicle.insurance;
  vehicle.rent = req.body.rent || vehicle.rent;

  try {
    const vehicleStored = await vehicle.save();
    return res.json(vehicleStored);
  } catch (error) {
    console.log(error);
  }
};

const deleteVehicle = async (req, res) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const vehicle = await Vehicle.findById(id);

  // Comprubo que exista el vehiculo
  if (!vehicle) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que el vehiculo pertenezca al usuario logueado
  if (vehicle.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  try {
    await vehicle.deleteOne();
    res.json({ msg: "Vehicle successfully eliminated" });
  } catch (error) {
    console.log(error);
  }
};

export { getVehicles, newVehicle, getVehicle, editVehicle, deleteVehicle };
