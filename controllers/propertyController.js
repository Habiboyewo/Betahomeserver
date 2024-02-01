const Property = require("../models/property");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const handleAddProperty = async (req, res) => {
  const {
    title,
    location,
    price,
    description,
    propertyType,
    tags,
    propertyStatus,
    bedroom,
    bathrooms,
    garage,
    squareFeet,
    name,
    phoneNumber,
    whatsappNumber,
  } = req.body;

  const video = req.files.video.tempFilePath;
  const images = req.files.images;
  const avatar = req.files.avatar.tempFilePath;

  try {
    //avatar upload
    const avatarResult = await cloudinary.uploader.upload(avatar, {
      use_filename: true,
      folder: "BetaHome",
    });
    //
    fs.unlinkSync(req.files.avatar.tempFilePath);

    //upload image
    const imageUploadPromises = images.map(async (image) => {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        use_filename: true,
        folder: "BetaHome",
      });
      fs.unlinkSync(image.tempFilePath);
      return result.secure_url;
    });
    const uploaddedImages = await Promise.all(imageUploadPromises);

    //video upload
    const videoResult = await cloudinary.uploader.upload(video, {
      resource_type: "video",
      folder: "BetaHome",
    });
    fs.unlinkSync(req.files.video.tempFilePath);
    //set up media
    const media = {
      images: [...uploaddedImages],
      video: videoResult.secure_url,
    };

    // set up salesSupport
    const salesSupport = {
      name,
      phoneNumber,
      whatsappNumber,
      avatar: avatarResult.secure_url,
    };
    // set up property
    const property = await Property.create({
      title,
      location,
      description,
      price,
      propertyType,
      tags,
      propertyStatus,
      bedroom,
      bathrooms,
      garage,
      squareFeet,
      media,
      salesSupport,
    });

    res.status(201).json({ success: true, property });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const handleGetAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort("-createdAt");
    res.status(200).json({ success: true, properties });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const handleGetRecentProperties = async (req, res) => {
  try {
    const recentProperties = await Property.find().sort("-createdAt").limit(3);
    res.status(200).json({ success: true, properties: recentProperties });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const handleGetASingleProperty = async (req, res) => {
  const { propertyId } = req.params;
  try {
    const property = await Property.findById({_id: propertyId})
    const propertyType = property.propertyType
    const similarProperties = await Property.find({ propertyType }).limit(3)

    res.status(200).json({ success: true, property, similarProperties })
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const handleEditProperty = async (req, res) => {
  res.send("update a property");
};

const handleDeleteProperty = async (req, res) => {
    const { propertyId } = req.params;
  try {
    await Property.findByIdAndDelete({ _id: propertyId })
    res.status(200).json({ message: "property Deleted", success: true });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

module.exports = {
  handleAddProperty,
  handleGetAllProperties,
  handleGetASingleProperty,
  handleEditProperty,
  handleDeleteProperty,
  handleGetRecentProperties,
};
