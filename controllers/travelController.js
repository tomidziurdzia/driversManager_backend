import Travel from "../models/Travel.js";
import Platform from "../models/Platform.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

const getTravels = async (req, res) => {
  const travels = await Travel.find()
    .populate({ path: "platform", select: "name" })
    .populate({ path: "vehicle" })
    .where("user")
    .equals(req.user);

  res.json(travels);
};

const newTravel = async (req, res) => {
  const { hours, trips, netFare, platform, vehicle } = req.body;
  const { id } = req.user;
  console.log(id);

  const platformExist = await Platform.findById(platform);
  const vehicleExist = await Vehicle.findById(vehicle);

  // Verifico que exista la plataforma donde se ingresa el travel
  if (!platformExist) {
    const error = new Error("The platform does not exist");
    return res.status(404).json({ msg: error.message });
  }

  if (!vehicleExist) {
    const error = new Error("Vehicle is required");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico que la plataforma pertenezca al usuario logueado
  if (platformExist.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  // Verifico los campos obligatorios
  if (!hours) {
    const error = new Error("Number of hours required");
    return res.status(404).json({ msg: error.message });
  }
  if (!trips) {
    const error = new Error("Number of trips required");
    return res.status(404).json({ msg: error.message });
  }
  if (!netFare) {
    const error = new Error("Money without promotions or tips required");
    return res.status(404).json({ msg: error.message });
  }

  try {
    const newTravel = new Travel(req.body);
    newTravel.user = req.user._id;

    platformExist.travels.push(newTravel._id);
    await platformExist.save();

    await newTravel.save();

    res.json(newTravel);
    // console.log(newTravel);
  } catch (error) {
    console.log(error);
  }
};
const getTravel = async (req, res) => {
  const { id } = req.params;

  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const travel = await Travel.findById(id)
    .populate("platform", "name")
    .populate("vehicle", "patent consume");

  // Verifico que la plataforma pertenezca al usuario logueado
  if (travel.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  if (!travel) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  res.json(travel);
};

const editTravel = async (req, res) => {
  const { id } = req.params;
  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const travel = await Travel.findById(id)
    .populate({ path: "platform", select: "name" })
    .populate({ path: "vehicle" });
  // Compruebo que se ingrese la patente
  if (!travel) {
    const error = new Error("The travel does not exist");
    return res.status(400).json({ msg: error.message });
  }

  // Verifico que la plataforma pertenezca al usuario logueado
  if (travel.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  console.log(req.body);
  travel.date = req.body.date || travel.date;
  travel.platform = req.body.platform || travel.platform;
  travel.vehicle = req.body.vehicle || travel.vehicle;

  travel.hours = req.body.hours || travel.hours;
  travel.trips = req.body.trips || travel.trips;
  travel.netFare = req.body.netFare || travel.netFare;
  travel.promotions = req.body.promotions || travel.promotions;
  travel.tips = req.body.tips || travel.tips;
  travel.km = req.body.km || travel.km;
  travel.liters = req.body.liters || travel.liters;
  travel.priceLiter = req.body.priceLiter || travel.priceLiter;

  try {
    const travelStored = await travel.save();
    res.json(travelStored);
  } catch (error) {
    console.log(error);
  }
};
const deleteTravels = async (req, res) => {
  const { id } = req.params;
  // Verifico la longitud del id
  if (id.length !== 24) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  const travel = await Travel.findById(id).populate("platform");
  // Compruebo que se ingrese la patente
  if (!travel) {
    const error = new Error("The travel does not exist");
    return res.status(400).json({ msg: error.message });
  }

  // Verifico que la plataforma pertenezca al usuario logueado
  if (travel.user.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid action");
    return res.status(404).json({ msg: error.message });
  }

  try {
    await travel.deleteOne();
    res.json({ msg: "Travel successfully eliminated" });
  } catch (error) {
    console.log(error);
  }
};

export { getTravels, newTravel, getTravel, editTravel, deleteTravels };
